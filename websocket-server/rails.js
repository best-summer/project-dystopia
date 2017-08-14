var request = require("request");
var Users = require("./users");
var Items = require('./items');
var END_POINT = `https://best-summer-api.herokuapp.com/`;

module.exports = class Rails {
  constructor() {
    this.items = new Items();
  }

  static async signup(props) {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT + `signup`,
        headers: { "Content-type": "application/json" },
        json: {
          name: props.user_name,
          device_id: props.device_id
        }
      };
      request.post(options, function (error, response, body) {
        resolve(body, new Users(body.user_name, body.login_key));
      });
    });
  }

  static async signin(props) {
    return new Promise((resolve) => {
      Rails.users().list(function (body) {
        var result_user = null;
        body = JSON.parse(body);
        body.forEach(function (user) {
          if (user.name === props.user_name)
            result_user = user;
        });
        if (result_user)
          resolve({ status: 'ok' }, result_user);
        else
          resolve({ status: 'ng', message: 'Not exist user.' });
      });
    });
  }

  // Rails.users().list();
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
      return new Users();
  }

  // Rails.items();
  static items() {
    return (new Items()).list();
  }
}
