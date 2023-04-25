const IndividualEntity = require('./IndividualEntity');

module.exports = class Match extends IndividualEntity {
  entityName = 'match';

  attributes = {
    stage_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'stage',
      xor: false,
    },

    datetime: {
      value: null,
      required: true,
      unique: false,
      validations: ['datetime'],
      relatedEntity: null,
      xor: false,
    },

    stadium_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'stadium',
      xor: false,
    },

    referee: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'referee',
      xor: false,
    },

    assistant_referee_1: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'referee',
      xor: false,
    },

    assistant_referee_2: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'referee',
      xor: false,
    },

    fourth_official: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'referee',
      xor: false,
    },

    opponent_id: {
      value: null,
      required: true,
      unique: false,
      validations: ['inDb'],
      relatedEntity: 'opponent',
      xor: false,
    },

    opponent_goals: {
      value: null,
      required: true,
      unique: false,
      validations: ['isPositive'],
      relatedEntity: null,
      xor: false,
    },

    highlights: {
      value: null,
      required: true,
      unique: false,
      validations: ['exists'],
      relatedEntity: null,
      xor: false,
    },
  };

  dependentEntities = ['lineup'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
