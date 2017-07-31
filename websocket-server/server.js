var fs = require("fs");
var http = require("http");
var io = require("socket.io");
var aws = require('aws-sdk');
var uuid = require('node-uuid');
var colors = require('colors');


http = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  var output = fs.readFileSync("./index.html", "utf-8");
  res.end(output);
}).listen(3000);

io = io.listen(http);


var _rooms = [];
var _time = 0;
var _scores = [];


io.sockets.on("connection", function (socket) {

  log('Connected', { socketId: socket.id });

  socket.on('message', function(props) {

    props = JSON.parse(props);

    var types = {

      // Matching.
      get_rooms: get_rooms,
      join_room: join_room,
      leave_room: leave_room,

      // Progress.
      game_start: game_start,
      game_finish: game_finish,

      // Play.
      game_time: game_time,
      game_score: game_score,
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

    props[props.type](socket, props);
  });
});

var emit = function(socket, props) {
  io.to(socket.id).emit(`message`, props);
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
  // Rails.
}

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
  var rival_player = rival_player(socket, props);
  emit(rival_player.socket_id, props);
}

var move_bar = function(socket, props) {
  var rival_player = get_rival_player(socket, props);
  emit(rival_player.socket_id, props);
}

var launch_special = function(socket, props) {
  var rival_player = get_rival_player(socket, props);
  emit(rival_player.socket_id, props);
}

var reflect_ball = function(socket, props) {
  var rival_player = get_rival_player(socket, props);
  emit(rival_player.socket_id, props);
}
  
var goal = function(socket, props) {
  var rival_player = get_rival_player(socket, props);
  emit(rival_player.socket_id, props);
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