const IndividualEntity = require('./IndividualEntity');

module.exports = class City extends IndividualEntity {
  entityName = 'city';

  attributes = {
    name: {
      value: null,
      required: true,
      unique: false,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },

    country_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'country',
      xor: false,
    },
  };

  dependentEntities = ['stadium'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
