const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Lineup extends General {
  match_id = { value: null, required: true };
  player_id = { value: null, required: true };
  shirt_number = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async attributesValidation() {
    try {
      validator.isPositiveOrError(this.shirt_number.value, 'O valor de shirt_number é inválido');
      await validator.existsInDbOrError('match', { id: this.match_id.value }, 'O valor de match_id é inválido');
      await validator.existsInDbOrError('player', { id: this.player_id.value }, 'O valor de player_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
