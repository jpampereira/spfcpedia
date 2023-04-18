const DbEntity = require('./DbEntity');

module.exports = class Match extends DbEntity {
  entityName = 'match';

  attributes = {
    tournament_stage: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'stage',
    },
    datetime: {
      value: null, required: true, unique: false, validations: ['datetime'], relatedTable: null,
    },
    local: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'stadium',
    },
    referee: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'referee',
    },
    assistant_referee_1: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'referee',
    },
    assistant_referee_2: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'referee',
    },
    fourth_official: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'referee',
    },
    opponent: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedTable: 'opponent',
    },
    opponent_goals: {
      value: null, required: true, unique: false, validations: ['isPositive'], relatedTable: null,
    },
    highlights: {
      value: null, required: true, unique: false, validations: [], relatedTable: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
