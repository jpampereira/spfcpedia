const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class City extends General {
  entityName = 'city';
  attributes = {
    name: { value: null, required: true, unique: false },
    country_id: { value: null, required: true, unique: false }
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    try {
      validator.existsOrError(this.attributes.name.value, 'O valor de name é inválido');
      await validator.existsInDbOrError('country', { id: this.attributes.country_id.value }, 'O valor de country_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
