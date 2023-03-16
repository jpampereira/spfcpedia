const General = require('./General');

module.exports = class Country extends General {
  name = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
