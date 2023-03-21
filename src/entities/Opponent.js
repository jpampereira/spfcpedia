const DbEntity = require('./DbEntity');
const exits = require('../configs/exits');
const validator = require('../utils/validator')();

module.exports = class Opponent extends DbEntity {
  entityName = 'opponent';

  attributes = {
    name: { value: null, required: true, unique: true },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    const errorMessage = exits.INVALID_ATTRIBUTE_ERROR;

    validator.existsOrError(this.attributes.name.value, errorMessage.replace(/<ATTR_NAME>/, 'name'));
  }
};
