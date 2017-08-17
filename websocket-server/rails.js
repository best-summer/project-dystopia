var request = require("request");
var Users = require("./users");
var Items = require('./items');
const params = require('./params');

module.exports = class Rails {
  constructor() {
    this.items = new Items();
  }

  static signup(props) {
    return new Promise((resolve) => {
      var options = {
        url: params.rails_endpoint + `signup`,
        headers: { "Content-type": "application/json" },
        json: {
          name: props.user_name,
          device_id: props.device_id
        }
      };
      request.post(options, function (error, response, body) {
        if (body.status == 'ng')
          resolve(null);
        else
          resolve(new Users(props.device_id, body.login_key));
      });
    });
  }
  

  static async signin(props) {
    return new Promise(function(resolve) {
      Rails.users().list().then(function(body) {
        var result_user = null;
        body = JSON.parse(body);
        body.forEach(function (user) {
          if (user.name === props.user_name)
            result_user = user;
        });
        if (result_user) {
          const user = new Users(result_user.device_id, result_user.login_key);
          resolve({ status: 'ok', user: user });
        } else {
          resolve({ status: 'ng', message: 'Not exist user.' });
        }
      });
    });
  }

  // Rails.users().list();
  // Rails.users(`Nenecchi`).status.get();
  // Rails.users(`Nenecchi`).items.get();
  // Rails.users(`Nenecchi`).items.add({ name: `SuperBall` });
  // Rails.users(`Nenecchi`).results.get();
  // Rails.users(`Nenecchi`).results.set({ score: 200, vs: `win` });
  static users(device_id, login_key) {
    if (device_id && login_key)
      return new Users(device_id, login_key);
    else
      return new Users();
  }

  // Rails.items();
  static items() {
    return (new Items()).list();
  }
}
