const fs = require("fs");
const http = require("http");
const request = require("request");
const io = require("socket.io");
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

  log('Connected', { socketId: socket.id });

  socket.on('message', function(props) {

    // props = JSON.parse(props);

    var types = {

      // Matching.
      start_match: start_match,
      cancel_match: cancel_match,
      // complete_match: complete_match,
      // failed_match: failed_match

      // Progress.
      // game_start: game_start,
      // game_finish: game_finish,

      // Play.
      // game_time: game_time,
      // game_score: game_score,
      shoot_ball: shoot_ball,
      move_bar: move_bar,
      launch_special: launch_special,
      reflect_ball: reflect_ball,
      goal: goal,

    };

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
});

var emit = function(socket_id, props) {
  io.to(socket_id).emit(`message`, props);
}

var get_rival_player = function(socket, props) {
  var room = _rooms[props.room_id];
  if (room == null) {
    var body = {
      status: `ng`,
      message: props.room_id + `is not exist.`
    };
    emit(socket, body);
    return;
  }
  var rival = null;
  room.players.forEach(function(player) {
    if (player.device_id != props.device_id) {
      rival = player;
    }
  });
  return rival;
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
      user = rails.users(body.name, body.login_key);
    }
  } else{
    user = body.user;
  }

  if (user == null)
    return;

  // Join to Room.
  let status = await user.status.get();
  const room_id = _rooms.waiting() || _rooms.add(socket, props);
  _rooms.join(room_id, socket, props);
  status = JSON.parse(status);
  var player = {
    user_name: props.user_name,
    room_id: room_id,
    device_id: props.device_id,
    socket_id: socket.id,
    summer_vacation_days: body.summer_vacation_days,
    rank: body.rank
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

var join_room = function(socket, props) {
  var room = _rooms[props.room_id];
  if (room == null) {
    let body = {
      status: `ng`,
      message: props.room_id + `is not exist.` 
    };
    emit(socket, body);
    return;
  }
  if (room.players.length >= 2) {
    let body = {
      message: `ng`,
      reason: `players count is over 2.`
    };
    emit(socket, body);
    return;
  }
  var newPlayer = {
    device_id: props.device_id,
    user_name: props.user_name,
    socket_id: socket.id
  };
  room.players.push(newPlayer);
  emit(socket, { type: props.type, status: `ok` });
}

var leave_room = function(socket, props) {
  var room = _rooms[props.room_id];
  if (room == null) {
    let body = {
      status: `error`,
      reason: props.room_id + `is not exist.`
    };
    emit(socket, body);
    return;
  }
  room.players.forEach(function(player, index) {
    if (player.device_id == props.device_id) {
      room.players.splice(index, 1);
    }
  });
  emit(socket, { type: props.type, status: `ok` });
}

// game_start();
var game_finish = function(socket, props) {
  var player = players.get(props.device_id);
  var room = _rooms.get(player.room_id);
  room.players.forEach(function(player) {
    var rival = players.rivalOf(player.device_id);
    var body = {
      type: `game_finish`,
      room_id: room_id,
      enemy: rival
    }
    emit(rival.socket_id, body);
  });
  // Rails.
}

var splash_water = function(socket, props) {
  var rival = players.rivalOf(props.device_id);
  emit(rival.socket_id, props);
}

var hit_water = function(socket, props) {
  const player = players.get(props.device_id);
  const room = _rooms.get(player.room_id);
  room.players.forEach(function(p) {
    const rival = players.rivalOf(p.device_id);
    if (player.device_id == p.device_id)
      rival.score += props.score;
    else
      rival.score -= props.score;
  });
  room.players.forEach(function(p) {
    const rival = players.rivalOf(p.device_id);
    const body = {
      device_id: p.device_id,
      room_id: p.room_id,
      scores: [
        {
          device_id: p.device_id,
          user_name: p.user_name,
          score: p.score
        },
        {
          device_id: rival.device_id,
          user_name: rival.user_name,
          score: rival.score
        }
      ]
    };
    emit(p.socket_id, body);
  });
}

var move = function(socket, props) {
  const rival = players.rivalOf(props.device_id);
  emit(rival.socket_id, props);
}

var send_result = function() {
  // Rails.
}

function log(eventName, objects) {
  console.log(colors.bgCyan.black(`LOG`) + ' ' + colors.green(eventName));
  Object.keys(objects).forEach(function(key) {
    console.log(colors.gray(key + ':'), objects[key]);
  });
}
