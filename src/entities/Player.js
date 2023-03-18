const General = require('./General');
const exits = require('../configs/exits');
const validator = require('../utils/validator')();

module.exports = class Player extends General {
  entityName = 'player';

  attributes = {
    name: { value: null, required: true, unique: true },
    nickname: { value: null, required: false, unique: true },
    position: { value: null, required: true, unique: false },
    birth: { value: null, required: true, unique: false },
    nationality: { value: null, required: true, unique: false },
    image: { value: null, required: true, unique: false },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    const errorMessage = exits.INVALID_ATTRIBUTE_ERROR;

    validator.existsOrError(this.attributes.name.value, errorMessage.replace(/<ATTR_NAME>/, 'name'));
    validator.isDateFormatOrError(this.attributes.birth.value, errorMessage.replace(/<ATTR_NAME>/, 'birth'));
    validator.isUrlFormatOrError(this.attributes.image.value, errorMessage.replace(/<ATTR_NAME>/, 'image'));
    validator.isInArray(this.attributes.position.value, ['G', 'D', 'M', 'F'], errorMessage.replace(/<ATTR_NAME>/, 'position'));
    await validator.existsInDbOrError('country', { id: this.attributes.nationality.value }, errorMessage.replace(/<ATTR_NAME>/, 'nationality'));
  }
};
