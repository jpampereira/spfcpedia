const IndividualEntity = require('./IndividualEntity');

module.exports = class Player extends IndividualEntity {
  entityName = 'player';

  attributes = {
    name: { value: null, required: true, unique: true, validations: ['exists'], relatedEntity: null },
    nickname: { value: null, required: false, unique: true, validations: [], relatedEntity: null },
    birth: { value: null, required: true, unique: false, validations: ['date'], relatedEntity: null },
    country_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'country' },
    image: { value: null, required: true, unique: false, validations: [], relatedEntity: null },
  };

  dependentEntities = ['lineup', 'substitution'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
