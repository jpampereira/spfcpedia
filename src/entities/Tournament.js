const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Stage extends General {
  name = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
  
  async attributesValidation() {
    try {
      validator.existsOrError(this.name.value, 'O valor de name é inválido');

    } catch (error) {
      throw error;
    }
  }
};
