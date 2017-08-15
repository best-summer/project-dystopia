var request = require("request");
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Results {
  constructor(device_id, login_key) {
    this.device_id = device_id;
    this.login_key = login_key;
  }

  async get() {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT +
        `users/` + this.device_id +
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
        url: END_POINT + `users/` + this.device_id + `/results`,
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
