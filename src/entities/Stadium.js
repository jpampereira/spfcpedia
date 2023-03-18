const General = require('./General');
const exits = require('../configs/exits');
const validator = require('../utils/validator')();

module.exports = class Stadium extends General {
  entityName = 'stadium';

  attributes = {
    name: { value: null, required: true, unique: true },
    nickname: { value: null, required: false, unique: true },
    city_id: { value: null, required: true, unique: false },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    const errorMessage = exits.INVALID_ATTRIBUTE_ERROR;

    validator.existsOrError(this.attributes.name.value, errorMessage.replace(/<ATTR_NAME>/, 'name'));
    await validator.existsInDbOrError('city', { id: this.attributes.city_id.value }, errorMessage.replace(/<ATTR_NAME>/, 'city_id'));
  }
};
