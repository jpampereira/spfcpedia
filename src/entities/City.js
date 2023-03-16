const General = require('./General');

module.exports = class City extends General {
  name = { value: null, required: true };
  country_id = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
