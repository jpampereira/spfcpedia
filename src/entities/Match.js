const IndividualEntity = require('./IndividualEntity');

module.exports = class Match extends IndividualEntity {
  entityName = 'match';

  attributes = {
    stage_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'stage' },
    datetime: { value: null, required: true, unique: false, validations: ['datetime'], relatedEntity: null },
    stadium_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'stadium' },
    referee: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee' },
    assistant_referee_1: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee' },
    assistant_referee_2: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee' },
    fourth_official: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'referee' },
    opponent_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'opponent' },
    opponent_goals: { value: null, required: true, unique: false, validations: ['isPositive'], relatedEntity: null },
    highlights: { value: null, required: true, unique: false, validations: [], relatedEntity: null },
  };

  dependentEntities = ['lineup'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
