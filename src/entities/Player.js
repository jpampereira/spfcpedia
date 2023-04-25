const IndividualEntity = require('./IndividualEntity');

module.exports = class Player extends IndividualEntity {
  entityName = 'player';

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

    birth: {
      value: null,
      required: true,
      unique: false,
      validations: ['date'],
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

    image: {
      value: null,
      required: true,
      unique: false,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },
  };

  dependentEntities = ['lineup', 'substitution'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
