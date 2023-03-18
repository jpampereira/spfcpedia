const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Stadium extends General {
  entityName = 'stadium';
  attributes = {
    name: { value: null, required: true, unique: true },
    nickname: { value: null, required: false, unique: true  },
    city_id: { value: null, required: true, unique: false }
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
  
  async validAttributesOrError() {
    try {
      validator.existsOrError(this.attributes.name.value, 'O valor de name é inválido');
      await validator.existsInDbOrError('city', { id: this.attributes.city_id.value }, 'O valor de city_id é inválido');

    } catch (error) {
      throw error;
    }
  }
};
