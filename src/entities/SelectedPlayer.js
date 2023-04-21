const IndividualEntity = require('./IndividualEntity');

module.exports = class SelectedPlayer extends IndividualEntity {
  entityName = 'lineup';

  attributes = {
    match_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'match',
    },
    player_id: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'player',
    },
    position: {
      value: null, required: true, unique: false, validations: ['inDb'], relatedEntity: 'position',
    },
    shirt_number: {
      value: null, required: true, unique: false, validations: ['isPositive'], relatedEntity: null,
    },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }
};
