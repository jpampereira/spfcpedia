const General = require('./General');

module.exports = class Lineup extends General {
  match_id = { value: null, required: true };
  player_id = { value: null, required: true };
  shirt_number = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
