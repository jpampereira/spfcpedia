const IndividualEntity = require('./IndividualEntity');

module.exports = class Stadium extends IndividualEntity {
  entityName = 'stadium';

  attributes = {
    name: {
      value: null,
      required: true,
      unique: true,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },

    nickname: {
      value: null,
      required: false,
      unique: true,
      validations: [],
      relatedEntity: null,
      xor: false,
    },

    city_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'city',
      xor: false,
    },
  };

  dependentEntities = ['match'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
