var request = require("request");
const params = require('./params');

module.exports = class Items {
  constructor(device_id, login_key) {
    this.device_id = device_id;
    this.login_key = login_key;
  }

  async get() {
    return new Promise((resolve) => {
      var options = {
        url: params.rails_endpoint +
        `users/` + this.device_id +
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
        url: params.rails_endpoint +
        `users/` + this.device_id +
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
        url: params.rails_endpoint + `/items`,
        json: new_props
      };
      request.get(options, function (error, response, body) {
        resolve(body);
      });
    });
  }
}
