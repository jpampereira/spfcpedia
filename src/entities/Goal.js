const IndividualEntity = require('./IndividualEntity');

module.exports = class Goal extends IndividualEntity {
  entityName = 'goal';

  attributes = {
    lineup_id: {
      value: null,
      required: false,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'lineup',
      xor: true,
    },

    substitution_id: {
      value: null,
      required: false,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'substitution',
      xor: true,
    },

    period_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'period',
      xor: false,
    },

    time: {
      value: null,
      required: true,
      unique: false,
      validations: ['isPositive'],
      relatedEntity: null,
      xor: false,
    },
  };

  dependentEntities = [];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
