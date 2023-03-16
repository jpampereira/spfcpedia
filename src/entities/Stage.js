const General = require('./General');

module.exports = class Stage extends General {
  name = { value: null, required: true };
  tournament_id = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
