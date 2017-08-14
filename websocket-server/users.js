var request = require("request");
var Status = require('./status');
var Items = require('./items');
var Results = require('./results');
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Users {
  constructor(user_name, login_key) {
    this.user_name = user_name;
    this.login_key = login_key;
    this.status = new Status(user_name, login_key);
    this.items = new Items(user_name, login_key);
    this.results = new Results(user_name, login_key);
  }

  list(callback) {
    var options = { url: END_POINT + `users` };
    request.get(options, function (error, response, body) {
      callback(body);
    });
  }
}
