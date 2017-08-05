var request = require("request");
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Rails {
  constructor() {
    this.items = new Items();
  }

  static signup(props, callback) {
    var options = {
      url: END_POINT + `signup`,
      headers: { "Content-type": "application/json" },
      json: {
        name: props.name,
        device_id: props.device_id
      }
    };
    request.post(options, function (error, response, body) {
      console.log(body);
      callback(new Users(body.user_name, body.login_key));
    });
  }

  // Rails.users();
  // Rails.users(`Nenecchi`).status();
  // Rails.users(`Nenecchi`).items(null);
  // Rails.users(`Nenecchi`).items({ name: `SuperBall` });
  // Rails.users(`Nenecchi`).results(null);
  // Rails.users(`Nenecchi`).results({ score: 200, vs: `win` });
  static users(user_name, login_key) {
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


class Users {
  constructor(user_name, login_key) {
    this.user_name = user_name;
    this.login_key = login_key;
    this.items = new Items(user_name, login_key);
  }

  list(callback) {
    var options = {
      url: END_POINT + `users`,
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }

  status(callback) {
    var options = {
      url: END_POINT +
           `users/` + this.user_name +
           `/status?login_key=` + this.login_key,
    };
    console.log(this.login_key);
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }

  results(new_props, callback) {
    var self = this;
    var get = function(callback) {
      var options = {
        url: END_POINT +
             `users/` + self.user_name +
             `/results?login_key=` + self.login_key,
      };
      request.get(options, function (error, response, body) {
        callback(body);
      });
    }
    var set = function(new_props, callback) {
      var options = {
        url: END_POINT + `users/` + self.user_name + `/results`,
        json: {
          score: new_props.score,
          vs: new_props.vs,
          login_key: new_props.login_key
        }
      };
      request.patch(options, function (error, response, body) {
        callback(body);
      });
    }
    if (new_props)
      set(new_props, callback);
    else
      get(callback);
  }
}


class Items {
  constructor(user_name, login_key) {
    this.user_name = user_name;
    this.login_key = login_key;
  }

  get(callback) {
    var options = {
      url: END_POINT +
           `users/` + this.user_name +
           `/items?login_key=` + this.login_key,
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }

  add(new_props, callback) {
    var options = {
      url: END_POINT + 
           `users/` + this.user_name +
           `/items?login_key=` + this.login_key,
      json: {
        name: new_props.name,
        login_key: new_props.login_key,
        value: new_props.value,
        number: new_props.number
      }
    };
    request.post(options, function (error, response, body) {
      callback(body);
    });
  }

  list(callback) {
    var options = {
      url: END_POINT + `/items`,
      json: new_props
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }
}
