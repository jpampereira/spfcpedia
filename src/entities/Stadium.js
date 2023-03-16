const General = require('./General');

module.exports = class Stadium extends General {
  name = { value: null, required: true };
  nickname = { value: null, required: false };
  city_id = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
