const General = require('./General');
const exits = require('../configs/exits');
const validator = require('../utils/validator')();

module.exports = class City extends General {
  entityName = 'city';

  attributes = {
    name: { value: null, required: true, unique: false },
    country_id: { value: null, required: true, unique: false },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    const errorMessage = exits.INVALID_ATTRIBUTE_ERROR;

    validator.existsOrError(this.attributes.name.value, errorMessage.replace(/<ATTR_NAME>/, 'name'));
    await validator.existsInDbOrError('country', { id: this.attributes.country_id.value }, errorMessage.replace(/<ATTR_NAME>/, 'country_id'));
  }
};
