const IndividualEntity = require('./IndividualEntity');
const validator = require('../utils/validator')();
const exits = require('../configs/exits');

module.exports = class Referee extends IndividualEntity {
  entityName = 'referee';

  attributes = {
    name: {
      value: null,
      required: true,
      unique: true,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },
  };

  dependentEntities = [];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }

  async dependentEntitiesDoesntHaveDataOrError(refereeId) {
    super.dependentEntitiesDoesntHaveDataOrError();

    const errorMsg = exits.DATA_DEPENDENCY_ERROR.replace(/<ENTITY_NAME>/, 'match');

    await validator.notExistsInDbOrError('match', [
      'referee = ? or assistant_referee_1 = ? or assistant_referee_2 = ? or fourth_official = ?',
      refereeId,
    ], errorMsg);
  }
};
