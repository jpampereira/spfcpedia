const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Stadium extends General {
  name = { value: null, required: true };
  nickname = { value: null, required: false };
  city_id = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
  
  async attributesValidation() {
    try {
      validator.existsOrError(this.name.value, 'O valor de name é inválido');
      await validator.existsInDbOrError('city', { id: this.city_id.value }, 'O valor de city_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
