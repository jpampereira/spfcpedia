const DbEntity = require('./DbEntity');

module.exports = class Match extends DbEntity {
  entityName = 'match';

  attributes = {
    tournament_stage: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'stage',
    },
    datetime: {
      value: null, required: true, unique: false, validations: ['datetime'], relatedEntity: null,
    },
    local: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'stadium',
    },
    referee: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee',
    },
    assistant_referee_1: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee',
    },
    assistant_referee_2: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee',
    },
    fourth_official: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee',
    },
    opponent: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'opponent',
    },
    opponent_goals: {
      value: null, required: true, unique: false, validations: ['isPositive'], relatedEntity: null,
    },
    highlights: {
      value: null, required: true, unique: false, validations: [], relatedEntity: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
