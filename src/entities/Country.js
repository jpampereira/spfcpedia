const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Country extends General {
  entityName = 'country';
  attributes = {
    name: { value: null, required: true, unique: true }
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    try {
      validator.existsOrError(this.attributes.name.value, 'O valor de name é inválido');

    } catch (error) {
      throw error;
    }
  }
};
