// RingBuffer
module.exports = class Rooms {
  constructor() {
    this.self = new Array(100);
    this.count = 0;
    this.maxCount = 100;
  }

  add(socket, props) {
    var assign_room_id = this.count;
    this.self[this.count] = {
      room_id: assign_room_id,
      players: [{
        socket_id: socket.id,
        device_id: props.device_id,
        user_name: props.user_name
      }]
    };
    this.count = (this.count + 1) % this.maxCount;
    return assign_room_id;
  }

  remove(room_id) {
    this.self[room_id] = {
      room_id: room_id,
      players: []
    };
  }

  join(room_id, socket, props) {
    
  }

  leave(room_id, socket, props) {

  }

  get(room_id) {
    return this.self[room_id];
  }

  waiting() {
    var room_id = null;
    this.self.forEach(function(room) {
      if (room.players.length > 1)
        room_id = room.room_id;
    });
    return room_id;
  }

  count() {
    return this.count;
  }
}
