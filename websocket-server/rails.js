var request = require("request");
var Users = require("./users");
var Items = require('./items');
var END_POINT = `https://best-summer-api.herokuapp.com/`;

module.exports = class Rails {
  constructor() {
    this.items = new Items();
  }

  static signup(props, callback) {
    var options = {
      url: END_POINT + `signup`,
      headers: { "Content-type": "application/json" },
      json: {
        name: props.user_name,
        device_id: props.device_id
      }
    };
    request.post(options, function (error, response, body) {
      console.log(body);
      callback(body, new Users(body.user_name, body.login_key));
    });
  }

  // Rails.users();
  // Rails.users(`Nenecchi`).status.get();
  // Rails.users(`Nenecchi`).items.get();
  // Rails.users(`Nenecchi`).items.add({ name: `SuperBall` });
  // Rails.users(`Nenecchi`).results.get();
  // Rails.users(`Nenecchi`).results.set({ score: 200, vs: `win` });
  static users(user_name, login_key) {
    console.log(Users);
    if (user_name && login_key)
      return new Users(user_name, login_key);
    else
      return (new Users()).list();
  }

  // Rails.items();
  static items() {
    return (new Items()).list();
  }
}
