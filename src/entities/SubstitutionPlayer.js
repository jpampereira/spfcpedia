const IndividualEntity = require('./IndividualEntity');

module.exports = class LineupPlayer extends IndividualEntity {
  entityName = 'substitution';

  attributes = {
    match_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'match',
      xor: false,
    },

    player_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'player',
      xor: false,
    },

    position_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'position',
      xor: false,
    },

    shirt_number: {
      value: null,
      required: true,
      unique: false,
      validations: ['isPositive'],
      relatedEntity: null,
      xor: false,
    },

    lineup_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'lineup',
      xor: false,
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

  dependentEntities = ['goal'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
