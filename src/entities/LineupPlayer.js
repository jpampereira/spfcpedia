const IndividualEntity = require('./IndividualEntity');

module.exports = class LineupPlayer extends IndividualEntity {
  entityName = 'lineup';

  attributes = {
    match_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'match' },
    player_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'player' },
    position_id: { value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'position' },
    shirt_number: { value: null, required: true, unique: false, validations: ['isPositive'], relatedEntity: null },
  };

  dependentEntities = ['substitution'];

  constructor(obj) {
    super(obj);
    this.setAttributes(obj);
  }
};
