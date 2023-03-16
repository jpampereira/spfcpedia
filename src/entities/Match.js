const General = require('./General');

module.exports = class Match extends General {
  tournament_stage = { value: null, required: true };
  datetime = { value: null, required: true };
  local = { value: null, required: true };
  referee = { value: null, required: true };
  assistant_referee_1 = { value: null, required: true };
  assistant_referee_2 = { value: null, required: true };
  fourth_official = { value: null, required: true };
  opponent = { value: null, required: true };
  opponent_goals = { value: null, required: true };
  highlights = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
