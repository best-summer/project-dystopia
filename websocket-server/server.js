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

// aws.config.loadFromPath('credentials.json');

// var dy = new aws.DynamoDB();

var _rooms = [];
var _players = {};
// var players = {
//   0000000: {
//     name: `michael`,
//     score: 10,
//     roomId: 2,
//     socketId: 888,
//   }
// }


// 部屋を初期化する
for (var i = 1; i <= 10; i++) {
  _rooms.push({
    roomId: i,
    players: [
      // { deviceId: 00000000 },
      // { deviceId: 11111111 }
    ],
    playerCount: 0
  });
}


io.sockets.on("connection", function (socket) {

  log('Connected', { socketId: socket.id });

  
  // 部屋に入る
  socket.on('join', function(props) {
    var roomId   = props.roomId;
    var deviceId = props.deviceId;
    var name     = props.name;

    // 例外処理
    if (_rooms[roomId].playerCount >= 2) {
      io.to(socket.id).emit('joined', {
        error: `Failed to join: playerCount is over 2.`
      });
      return;
    }

    // _rooms に登録
    var players = _rooms[roomId].players;
    players.push(deviceId);
    _rooms[roomId].playerCount++;

    // users に登録
    _players[deviceId] = {
      name: name,
      score: 0,
      roomId: roomId,
      socketId: socket.id
    };

    // 入室
    socket.join(roomId);

    // 入室完了
    io.to(socket.id).emit('joined', {
      playerId: 1,
      roomId: roomId
    });

    log('Joined', {
      socketId: socket.id,
      _rooms: _rooms,
      _players: _players
    });
  });


  // 部屋を抜ける
  socket.on('leave', function(props) {
    var roomId   = props.roomId;
    var deviceId = props.deviceId;

    // 例外処理
    if (_players[deviceId] == null) {
      io.to(socket.id).emit('leaved', {
        error: `Failed to leave: You are not joined.`
      });
      return;
    }

    // _rooms から削除
    var room = _rooms[roomId];
    var players = room.players;
    players.forEach(function(value, index) {
      if (players[index] === deviceId)
        players.splice(index, 1);
    })
    room.playerCount--;

    // users から削除
    delete _players[deviceId];

    // 退室
    socket.leave(roomId);

    // 退室完了
    io.to(socket.id).emit('leaved');

    log('Leaved', {
      socketId: socket.id,
      _rooms: _rooms,
      _players: _players
    });
  });


  // 部屋のリストを取得する
  socket.on('List', function() {
    io.to(socket.id).emit('list', _rooms);
  });


  // ボールを送る
  socket.on('send', function(props) {
    var roomId = props.roomId;
    var myDeviceId = props.deviceId; // 相手ではなく自分の端末 ID
    var ballType = props.ballType;
    var x = props.x;
    var y = props.y;

    // 相手の socketId を取得する
    var rivalDeviceId = _rivalDeviceId(roomId, myDeviceId);
    var rivalSocketId = _players[rivalDeviceId].socketId;

    var properties = {
      ballType: ballType,
      x: x,
      y: y
    };

    // 送信
    io.to(rivalSocketId).emit('received', properties);

    log('Send', {
      myDeviceIdId: myDeviceId,
      rivalDeviceId:rivalDeviceId,
      props: props
    });
  });


  // 自分が得点した
  socket.on('attack', function(props) {
    var roomId = props.roomId;
    var myDeviceId = props.deviceId; // 相手ではなく自分の端末 ID
    var score = props.score;

    // 相手の socketId を取得する
    var rivalDeviceId = _rivalDeviceId(roomId, myDeviceId);
    var rivalSocketId = _players[rivalDeviceId].socketId;

    var properties = { score: score };

    // 送信
    io.to(rivalSocketId).emit('damaged', properties);

    log('Attack', {
      myDeviceIdId: myDeviceId,
      rivalDeviceId:rivalDeviceId,
      props: props
    });
  });


  // ゲーム終了
  socket.on('finish', function(props) {
    var roomId = props.roomId;
    var playerDeviceIds = _playerDeviceIds(roomId);

    playerDeviceIds.forEach(function(value, index) {
      io.toString(value).emit('finished', {
        scores: {
          you: 0,
          rival: 0
        },
        result: 'win'
      });
    });
  });


  // 途中で切断した
  socket.on('disconnect', function() {
    var roomId   = null;
    var deviceId = null;

    // _players から削除
    Object.keys(_players).forEach(function(value) {
      if (value === socket.id) {
        roomId = _players[value].roomId;
        deviceId = value;
        delete _players[deviceId];
      }
    });

    // 例外処理
    if (roomId == null || deviceId == null) {
      console.log('Failed to dissconnect:', socket.id, 'is not connected.');
      return;
    }

    // _rooms から削除
    var players = _rooms[roomId].players;
    _rooms[roomId].players = players.filter(function(value) {
      return value !== deviceId;
    });
  });
});

var _rivalDeviceId = function(roomId, myDeviceId) {
  var result = null;

  var room = _rooms[roomId];
  var players = room.players;

  players.forEach(function (deviceId) {
    if (deviceId != myDeviceId)
      result = deviceId;
  });

  return result;
}

var _playerDeviceIds = function(roomId) {
  return _rooms[roomId].players;
}

function log(eventName, objects) {
  console.log(colors.bgCyan.black(`LOG`) + ' ' + colors.green(eventName));
  Object.keys(objects).forEach(function(key) {
    console.log(colors.gray(key + ':'), objects[key]);
  });
}
