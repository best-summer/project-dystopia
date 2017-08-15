var request = require("request");
var Status = require('./status');
var Items = require('./items');
var Results = require('./results');
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Users {
  constructor(device_id, login_key) {
    this.device_id = device_id;
    this.login_key = login_key;
    this.status = new Status(device_id, login_key);
    this.items = new Items(device_id, login_key);
    this.results = new Results(device_id, login_key);
  }

  list() {
    return new Promise((resolve) => {
      var options = { url: END_POINT + `debug` };
      request.get(options, function (error, response, body) {
        resolve(body);
        // callback(body);
      });
    });
  }
}
