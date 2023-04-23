const IndividualEntity = require('./IndividualEntity');

module.exports = class Stadium extends IndividualEntity {
  entityName = 'stadium';

  attributes = {
    name: { value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null },
    nickname: { value: null, required: false, unique: true, validations: [], relatedEntity: null },
    city_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'city' },
  };

  dependentEntities = ['match'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
