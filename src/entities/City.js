const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class City extends General {
  name = { value: null, required: true };
  country_id = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async attributesValidation() {
    try {
      validator.existsOrError(this.name.value, 'O valor de name é inválido');
      validator.existsOrError(this.country_id.value, 'O valor de country_id é inválido');
      await validator.existsInDbOrError('country', { id: this.country_id.value }, 'O valor de country_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
