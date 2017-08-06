class Players {
  constructor() {
    this.self = [];
  }

  add(props) {
    var user = {
      user_name: props.user_name,
      room_id: props.room_id,
      device_id: props.device_id,
      socket_id: props.socket_id,
      summer_vacation_days: props.summer_vacation_days,
      rank: props.rank
    }
    this.self.push(user);
  }

  remove(device_id) {
    this.self.forEach(function(player, index) {
      if (player.device_id === device_id)
        this.self.splice(index, 1);
    });
  }

  get(device_id) {
    var result = null;
    this.self.forEach(function(player) {
      if (player.device_id === device_id)
        result = player;
    });
    return result;
  }

  rivalOf(device_id) {
    var result = null;
    var room_id = null;
    this.self.forEach(function(player) {
      if (player.device_id === device_id)
        room_id = player.room_id;
    });
    this.self.forEach(function(player) {
      if (player.room_id === room_id && player.device_id !== device_id)
        result = player;
    });
    return result;
  }
}

module.exports = new Players();