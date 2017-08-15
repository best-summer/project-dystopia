var request = require("request");
var END_POINT = `https://best-summer-api.herokuapp.com/`

module.exports = class Items {
  constructor(user_name, login_key) {
    this.user_name = user_name;
    this.login_key = login_key;
  }

  async get() {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT +
        `users/` + this.user_name +
        `/items?login_key=` + this.login_key,
      };
      request.get(options, function (error, response, body) {
        resolve(body);
      });
    });
  }

  async add(new_props) {
    return new Promise((resolve) => {
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
        resolve(body);
      });
    });
  }

  async list() {
    return new Promise((resolve) => {
      var options = {
        url: END_POINT + `/items`,
        json: new_props
      };
      request.get(options, function (error, response, body) {
        resolve(body);
      });
    });
  }
}
