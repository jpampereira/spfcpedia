const General = require('./General');

module.exports = class Player extends General {
  name = { value: null, required: true };
  nickname = { value: null, required: false };
  position = { value: null, required: true };
  birth = { value: null, required: true };
  nationality = { value: null, required: true };
  image = { value: null, required: true };

  constructor(obj) {
    super();
    this.setFields(obj);
  }
};
