// RingBuffer
module.exports = class Rooms {
  constructor() {
    this.self = new Array(100);
    this.count = 0;
    this.maxCount = 100;
  }

  /**
   * Add a room.
   * @param {Object} socket A socket of socket.io.
   * @param {Object} props Properties from a client.
   * @return {String} Room id.
   */
  add(socket, props) {
    var room_id = uuid.v1();
    var room = {
      room_id: room_id,
      players: [{
        socket_id: socket.id,
        device_id: props.device_id,
        user_name: props.user_name
      }]
    };
    this.self[room_id] = room;
    return room_id;
  }

  /**
   * Remove a room.
   * @param {Object} socket A socket of socket.io.
   * @param {Object} props Properties from a client.
   * @return {String} Room id.
   */
  remove(room_id) {
    delete this.self[room_id];
  }

  /**
   * Join into a room.
   * @param {String} room_id Room id.
   * @param {Object} socket A socket of socket.io.
   * @param {Object} props Properties from a client.
   */
  join(room_id, socket, props) {
    var player = {
      socket_id: socket.id,
      device_id: props.device_id,
      user_name: props.user_name
    };
    var room = this.self[room_id];
    room.players.push(player);
  }

  /**
   * Leave a room.
   * @param {Object} socket A socket of socket.io.
   * @param {Object} props Properties from a client.
   * @return {String} Room id.
   */
  leave(room_id, socket, props) {
    var room = this.self[room_id];
    var players = room.players;
    players.forEach(function(player, index) {
      if (player.device_id === props.device_id)
        players.splice(index, 1);
    });
    if (players.length === 0)
      this.remove(room_id);
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
