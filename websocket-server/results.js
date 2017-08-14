var request = require("request");
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Results {
  constructor(user_name, login_key) {
    this.user_name = user_name;
    this.login_key = login_key;
  }

  async get() {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT +
        `users/` + this.user_name +
        `/results?login_key=` + this.login_key,
      };
      request.get(options, function (error, response, body) {
        resolve(body);
        // callback(body);
      });
    });
  }

  async set(new_props) {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT + `users/` + this.user_name + `/results`,
        json: {
          score: new_props.score,
          vs: new_props.vs,
          login_key: new_props.login_key
        }
      };
      request.patch(options, function (error, response, body) {
        resolve(body);
        // callback(body);
      });
    });
  }
}
