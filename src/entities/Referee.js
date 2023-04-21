const IndividualEntity = require('./IndividualEntity');

module.exports = class Referee extends IndividualEntity {
  entityName = 'referee';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null,
    },
  };

  dependentEntities = [];

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
