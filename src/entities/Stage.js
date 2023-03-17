const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Stage extends General {
  name = { value: null, required: true };
  tournament_id = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
  
  async attributesValidation() {
    try {
      validator.existsOrError(this.name.value, 'O valor de name é inválido');
      await validator.existsInDbOrError('tournament', { id: this.tournament_id.value }, 'O valor de tournament_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
