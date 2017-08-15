const fs = require("fs");
var http = require("http");
const request = require("request");
var io = require("socket.io");
const aws = require('aws-sdk');
const colors = require('colors');
const _rooms = require('./rooms');
const players = require('./players');
const rails = require('./rails');

// var _rooms = [];
var _time = 0;
var _scores = [];

var _rooms_head = 0;
var _rooms_tail = 0;

http = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  var output = fs.readFileSync("./index.html", "utf-8");
  res.end(output);
}).listen(3000);

io = io.listen(http);


io.sockets.on("connection", function (socket) {

    // props = JSON.parse(props);

  var types = {
    start_match: start_match,
    cancel_match: cancel_match,
    game_finish: game_finish,
    splash_water: splash_water,
    hit_water: hit_water,
    move: move
  };

  socket.on('message', function(props) {

    // Check whether props.type is correct type.
    var typeNames = Object.keys(types);
    if (!typeNames.includes(props.type)) {
      io.to(socket.id).emit(`message`, {
        status: `ng`,
        reason: `Incorrect type.`
      });
      return;
    }

    types[props.type](socket, props);
  });

  socket.on('disconnect', function(props) {
    const player = players.getBySocketId(socket.id);
    if (player) {
      players.remove(player.device_id);
      _rooms.leave(player.room_id, socket, { device_id: player.device_id });
    }
  });
});

var emit = function(socket_id, props) {
  io.to(socket_id).emit(`message`, props);
}

var start_match = async function(socket, props) {
  var user = null;
  var options = {
    user_name: props.user_name,
    device_id: props.device_id
  };

  // Signin/Signout.
  let body = await rails.signin(options);
  if (body.status === 'ng') {
    let body = await rails.signup(options);
    if (body.status === 'ng') {
      emit(socket.id, {
        type: `start_match`,
        status: body.status,
        message: body.message
      });
    } else {
      user = rails.users(props.device_id, body.login_key);
    }
  } else{
    user = body.user;
  }

  if (user == null)
    return;

  if (players.get(props.device_id)) {
    const body = {
      type: `start_match`,
      message: `You are already logged in.`
    };
    emit(socket.id, body);
    return;
  }

  // Join to Room.
  let status = await user.status.get();
  const room_id = _rooms.waiting() || _rooms.add(socket, props);
  const room = _rooms.get(room_id);
  for (const p of room.players) {
    if (p.device_id == props.device_id) {
      const body = {
        type: `start_match`,
        room_id: room_id,
        message: `You are already logged in.`
      };
      emit(socket.id, body);
      return;
    }
  }
  _rooms.join(room_id, socket, props);
  status = JSON.parse(status);
  var player = {
    user_name: props.user_name,
    login_key: user.login_key,
    room_id: room_id,
    device_id: props.device_id,
    socket_id: socket.id,
    summer_vacation_days: body.summer_vacation_days,
    rank: body.rank,
    score: 0
  }
  players.add(player);
  emit(socket.id, { type: `start_match`, room_id: room_id });
  if (_rooms.get(room_id).players.length === 2) {
    complete_match(room_id);
  }
}

var cancel_match = function(socket, props) {
  var player = players.get(props.device_id);
  if (player == null) {
    const body = {
      type: `cancel_match`,
      status: 'ng',
      message: `Not exists user.`
    }
    emit(socket.id, body);
    return;
  }
  players.remove(player.device_id);
  _rooms.leave(player.room_id, socket, props);
  emit(socket.id, { type: `cancel_match` });
}

var complete_match = function(room_id) {
  const room = _rooms.get(room_id);
  room.players.forEach(function(player) {
    var rival = players.rivalOf(player.device_id);
    if (rival == null) {
      emit(player.socket_id, {
        type: `complete_match`,
        status: `ng`,
        message: `players.length == 1`
      });
      return;
    }
    emit(player.socket_id, {
      type: `complete_match`,
      room_id: room_id,
      enemy: rival
    });
    emit(player.socket_id, {
      type: `game_start`,
      room_id: room_id,
    });
  });
}

var game_finish = async function(socket, props) {
  const player = players.get(props.device_id);
  const rival = players.rivalOf(player.device_id);
  const room = _rooms.get(player.room_id);
  const win = Number(player.score) > Number(rival.score);
  const body = {
    type: `game_finish`,
    device_id: props.device_id,
    room_id: props.room_id,
    win: win,
    you: player,
    enemy: rival
  };
  emit(player.socket_id, body);
  
  // Set player as finished.
  player.finished = true;
  
  // Leave from the room.
  if (player.finished == true && rival.finished == true) {
    players.remove(player.device_id);
    players.remove(rival.device_id);
    _rooms.leave(player.room_id, socket, { device_id: player.device_id });
    _rooms.leave(rival.room_id, socket, { socket_id: rival.socket_id });
  }

  // Send the result to Rails.
  const user = rails.users(player.device_id, player.login_key);
  const result = {
    login_key: player.login_key,
    score: player.score,
    vs: win ? `win` : `lose`
  };
  const response = await user.results.set(result);
  console.log(response);
}

var splash_water = function(socket, props) {
  const player = players.get(props.device_id);
  if (player == null) {
    emit(socket.id, {
      type: `splash_water`,
      status: `ng`,
      message: `You are not logged in.`
    });
    return;
  }
  const rival = players.rivalOf(props.device_id);
  if (rival == null) {
    emit(socket.id, {
      type: `splash_water`,
      status: `ng`,
      message: `rival is not logged in.`
    });
    return;
  }
  emit(rival.socket_id, props);
}

var hit_water = function(socket, props) {
  const player = players.get(props.device_id);
  if (player == null) {
    emit(socket.id, {
      type: `hit_water`,
      status: `ng`,
      message: `You are not logged in.`
    });
    return;
  }
  const room = _rooms.get(player.room_id);
  room.players.forEach(function(p) {
    const rival = players.rivalOf(p.device_id);
    if (player.device_id == p.device_id)
      player.score += props.score;
  });
  room.players.forEach(function(p) {
    const player = players.get(p.device_id);
    const rival = players.rivalOf(p.device_id);
    if (rival == null) {
      emit(socket.id, {
        type: `hit_water`,
        status: `ng`,
        message: `rival is not logged in.`
      });
      return;
    }
    const body = {
      type: `hit_water`,
      device_id: player.device_id,
      room_id: player.room_id,
      you: {
          device_id: player.device_id,
          user_name: player.user_name,
          score: player.score
      },
      enemy: {
        device_id: rival.device_id,
        user_name: rival.user_name,
        score: rival.score
      }
    };
    emit(p.socket_id, body);
  });
}

var move = function(socket, props) {
  const player = players.get(props.device_id);
  if (player == null) {
    emit(socket.id, {
      type: `move`,
      status: `ng`,
      message: `You are not logged in.`
    });
    return;
  }
  const rival = players.rivalOf(props.device_id);
  if (rival == null) {
    emit(socket.id, {
      type: `move`,
      status: `ng`,
      message: `rival is not logged in.`
    });
    return;
  }
  emit(rival.socket_id, props);
}
