var uuid = require('node-uuid');

class Rooms {
  constructor() {
    this.self = {};
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

  /**
   * Get a room.
   * @param {Object} socket A socket of socket.io.
   * @param {Object} props Properties from a client.
   * @return {String} Room id.
   */
  get(room_id) {
    return this.self[room_id];
  }

  /**
   * Get a room_id of waiting room.
   * @param {Object} socket A socket of socket.io.
   * @param {Object} props Properties from a client.
   * @return {String} Room id.
   */
  waiting() {
    var room_id = null;
    var rooms = this.self;
    Object.keys(rooms).forEach(function(room_id_) {
      if (rooms[room_id_].players.length === 1)
        room_id = room_id_;
    });
    return room_id;
  }
}

module.exports = new Rooms();
