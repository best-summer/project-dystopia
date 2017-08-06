var request = require("request");
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Status {
  constructor(user_name, login_key) {
    this.user_name = user_name;
    this.login_key = login_key;
  }

  get(callback) {
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
}