const IndividualEntity = require('./IndividualEntity');

module.exports = class Stage extends IndividualEntity {
  entityName = 'tournament';

  attributes = {
    name: {
      value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null,
    },
  };

  dependentEntities = ['stage'];

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
