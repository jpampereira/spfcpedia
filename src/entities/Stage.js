const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Stage extends General {
  entityName = 'stage';
  attributes = {
    name: { value: null, required: true, unique: false },
    tournament_id: { value: null, required: true, unique: false }
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
  
  async validAttributesOrError() {
    try {
      validator.existsOrError(this.attributes.name.value, 'O valor de name é inválido');
      await validator.existsInDbOrError('tournament', { id: this.attributes.tournament_id.value }, 'O valor de tournament_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
