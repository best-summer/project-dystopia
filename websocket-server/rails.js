var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Rails {
  constructor() {
    this.items = new Items();
  }

  signup(props) {
    var options = {
      uri: END_POINT + `signup`,
      headers: { "Content-type": "application/json" },
      json: props
    };
    request.post(options, function (error, response, body) {
      console.log(body);
    });
  }

  // Rails.users();
  // Rails.users(`Nenecchi`).status();
  // Rails.users(`Nenecchi`).items();
  // Rails.users(`Nenecchi`).items({ name: `SuperBall` });
  // Rails.users(`Nenecchi`).results();
  // Rails.users(`Nenecchi`).results({ score: 200, vs: `win` });
  users(user_name) {
    if (user_name)
      return new Users(user_name);
    else
      return (new Users()).list();
  }

  // Rails.items();
  items() {
    return (new Items()).list();
  }
}


class Users {
  constructor(user_name) {
    this.user_name = user_name
    this.items = new Items(user_name);
  }

  list(callback) {
    var options = {
      uri: END_POINT + `users`,
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }

  status(callback) {
    var options = {
      uri: END_POINT + `users/` + this.user_name + `/status`,
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }

  items(new_props, callback) {
    if (new_props)
      this.items.set(new_props, callback);
    else
      this.items.get(callback);
  }

  results(new_props, callback) {
    var get = function(callback) {
      var options = {
        uri: END_POINT + `users/` + this.user_name + `/results`,
      };
      request.get(options, function (error, response, body) {
        callback(body);
      });
    }
    var set = function(new_props, callback) {
      var options = {
        uri: END_POINT + `users/` + this.user_name + `/results`,
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
  constructor(user_name) {
    this.user_name = user_name;
  }

  get(callback) {
    var options = {
      uri: END_POINT + `users/` + this.user_name + `/items`,
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }

  set(new_props, callback) {
    var options = {
      uri: END_POINT + `users/` + this.user_name + `items`,
      json: new_props
    };
    request.post(options, function (error, response, body) {
      callback(body);
    });
  }

  list(callback) {
    var options = {
      uri: END_POINT + `items`,
      json: new_props
    };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }
}
