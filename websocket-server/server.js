var fs = require("fs");
var http = require("http");
var request = require("request");
var io = require("socket.io");
var aws = require('aws-sdk');
var colors = require('colors');
var _rooms = require('./rooms');
var players = require('./players')
var rails = require('./rails');

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
        status: `error`,
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
    emit(socket, { status: `error`, reason: props.room_id + `is not exist.` });
    return;
  }
  var rival_player;
  room.players.forEach(function(player) {
    if (player.device_id != props.device_id) {
      rival_player = player;
    }
  });
  return rival_player;
}

var get_rooms = function(socket, props) {
  emit(socket, { type: props.type, rooms: _rooms });
}

var start_match = function(socket, props) {
  var _user = null;
  var options = {
    user_name: props.user_name,
    device_id: props.device_id
  };
  rails.signin(options, function(body, user) {
    if (body.status === 'ok')
      _user = rails.users(user.name, user.login_key);
    if (_user == null) {
      rails.signup(options, function (body, user) {
        if (body.status === 'ng')
          emit(socket.id, { type: `start_match`, status: body.status, message: body.message });
        else
          _user = rails.users(user.name, user.login_key);
      });
    }
    if (_user == null) return;
    _user.status.get(function (body) {
      var room_id = _rooms.waiting();
      if (room_id == null)
        room_id = _rooms.add(socket, props);
      else
        _rooms.join(room_id, socket, props);
      body = JSON.parse(body);
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
    });
  });
}

var cancel_match = function(socket, props) {
  var player = players.get(props.device_id);
  if (player == null) {
    emit(socket.id, { type: `cancel_match`, status: 'ng', message: `Not exists user.` });
    return;
  }
  players.remove(player.device_id);
  _rooms.leave(player.room_id, socket, props);
  emit(socket.id, { type: `cancel_match` });
}

var complete_match = function(room_id) {
  _rooms.get(room_id).players.forEach(function(player) {
    var rival = players.rivalOf(player.device_id);
    emit(rival.socket_id, {
      type: `complete_match`,
      room_id: room_id,
      enemy: rival
    });
  });
}

var join_room = function(socket, props) {
  var room = _rooms[props.room_id];
  if (room == null) {
    emit(socket, { status: `error`, reason: props.room_id + `is not exist.` });
    return;
  }
  if (room.players.length >= 2) {
    emit(socket, { status: `error`, reason: `players count is over 2.` });
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
    emit(socket, { status: `error`, reason: props.room_id + `is not exist.` });
    return;
  }
  room.players.forEach(function(player, index) {
    if (player.device_id == props.device_id) {
      room.players.splice(index, 1);
    }
  });
  emit(socket, { type: props.type, status: `ok` });
}

var game_start = function(socket, props) {
  // rails.signup({ name: 'Yun12', device_id: '000012' }, function(user) {

  // });
  // rails.signup({ name: `Yun11`, device_id: '000011' }, function(user) {
    // user.list(function (body) {
    //   console.log(body);
    // });
    rails.users().list(function(body) {
      console.log(body);
    });
    var user = rails.users(`Yun11`, `9UX2cBqhPZg=`);
    // console.log(user);
    user.status.get(function(body) {
      // console.log(body);
    });
    user.items.get(function(body) {
      console.log(body);
    });
    // user.items.set({
    //   name: `TestBall`,
    //   login_key: this.login_key,
    //   value: '100',
    //   number: '1'
    // }, function (body) {
    //   console.log(body);
    // });
    user.items.get(function(body) {
      console.log(body);
    });
    // user.results(null, function (body) {
      // console.log(body);
    // });
    // user.results({ "score": "200", "vs": "win", "login_key": user.login_key }, function (body) {
      // console.log(body);
    // });
    user.results.get(function(body) {
      console.log(body);
    });
  // });
}

// game_start();
var game_finish = function(socket, props) {
  // Rails.
}

var game_time = function(socket, props) {
  emit(socket, { type: props.type, time_second: _time });
}

var game_score = function(socket, props) {
  emit(socket, { type: props.type, scores: _scores });
}

var shoot_ball = function(socket, props) {
  var rival = players.rivalOf(props.device_id);
  emit(rival.socket_id, props);
}

var move_bar = function(socket, props) {
  var rival = players.rivalOf(props.device_id);
  emit(rival.socket_id, props);
}

var launch_special = function(socket, props) {
  var rival = players.rivalOf(props.device_id);
  emit(rival.socket_id, props);

}

var reflect_ball = function(socket, props) {
  var rival = players.rivalOf(props.device_id);
  emit(rival.socket_id, props);
}
  
var goal = function(socket, props) {
  var rival = players.rivalOf(props.device_id);
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
