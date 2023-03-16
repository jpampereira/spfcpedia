const General = require('./General');

module.exports = class Referee extends General {
  name = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
