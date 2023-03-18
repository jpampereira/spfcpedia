const General = require('./General');
const exits = require('../configs/exits');
const validator = require('../utils/validator')();

module.exports = class Stage extends General {
  entityName = 'stage';

  attributes = {
    name: { value: null, required: true, unique: false },
    tournament_id: { value: null, required: true, unique: false },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    const errorMessage = exits.INVALID_ATTRIBUTE_ERROR;

    validator.existsOrError(this.attributes.name.value, errorMessage.replace(/<ATTR_NAME>/, 'name'));
    await validator.existsInDbOrError('tournament', { id: this.attributes.tournament_id.value }, errorMessage.replace(/<ATTR_NAME>/, 'tournament_id'));
  }
};
