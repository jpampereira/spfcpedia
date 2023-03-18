const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Player extends General {
  entityName = 'player';
  attributes = {
    name: { value: null, required: true, unique: true },
    nickname: { value: null, required: false, unique: true },
    position: { value: null, required: true, unique: false },
    birth: { value: null, required: true, unique: false },
    nationality: { value: null, required: true, unique: false },
    image: { value: null, required: true, unique: false }
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    try {
      validator.existsOrError(this.attributes.name.value, 'O valor de name é inválido');
      validator.isDateFormatOrError(this.attributes.birth.value, 'O valor de birth é inválido');
      validator.isUrlFormatOrError(this.attributes.image.value, 'O valor de image é inválido');
      validator.isInArray(this.attributes.position.value, ['G', 'D', 'M', 'F'], 'O valor de position é inválido');
      await validator.existsInDbOrError('country', { id: this.attributes.nationality.value }, 'O valor de nationality é inválido');

    } catch (error) {
      throw error;
    }
  }
};
