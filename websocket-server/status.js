var request = require("request");
const params = require('./params');

module.exports = class Status {
  constructor(device_id, login_key) {
    this.device_id = device_id;
    this.login_key = login_key;
  }

  async get() {
    return new Promise((resolve) => {
      var options = {
        url: params.rails_endpoint +
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
