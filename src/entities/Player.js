const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Player extends General {
  name = { value: null, required: true };
  nickname = { value: null, required: false };
  position = { value: null, required: true };
  birth = { value: null, required: true };
  nationality = { value: null, required: true };
  image = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async attributesValidation() {
    try {
      validator.isDateFormatOrError(this.birth.value, 'O valor de birth é inválido');
      validator.isUrlFormatOrError(this.image.value, 'O valor de image é inválido');
      validator.isInArray(this.position.value, ['G', 'D', 'M', 'F'], 'O valor de position é inválido');
      await validator.existsInDbOrError('country', { id: this.nationality.value }, 'O valor de nationality é inválido');

    } catch (error) {
      throw error;
    }
  }
};
