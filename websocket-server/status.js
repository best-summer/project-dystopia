var request = require("request");
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Status {
  constructor(device_id, login_key) {
    this.device_id = device_id;
    this.login_key = login_key;
  }

  async get() {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT +
        `users/` + this.device_id +
        `/status?login_key=` + this.login_key,
      };
      request.get(options, function (error, response, body) {
        resolve(body);
        // callback(body);
      });
    });
  }
}
