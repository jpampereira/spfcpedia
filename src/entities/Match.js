const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Match extends General {
  entityName = 'match';
  attributes = {
    tournament_stage: { value: null, required: true, unique: false },
    datetime: { value: null, required: true, unique: false },
    local: { value: null, required: true, unique: false },
    referee: { value: null, required: true, unique: false },
    assistant_referee_1: { value: null, required: true, unique: false },
    assistant_referee_2: { value: null, required: true, unique: false },
    fourth_official: { value: null, required: true, unique: false },
    opponent: { value: null, required: true, unique: false },
    opponent_goals: { value: null, required: true, unique: false },
    highlights: { value: null, required: true, unique: false }
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    try {
      validator.isDateTimeFormatOrError(this.attributes.datetime.value, 'O valor de datetime é inválido');
      validator.isPositiveOrError(this.attributes.opponent_goals.value, 'O valor de opponent_goals é inválido');
      validator.isUrlFormatOrError(this.attributes.highlights.value, 'O valor de highlights é inválido');
      await validator.existsInDbOrError('stage', { id: this.attributes.tournament_stage.value }, 'O valor de tournament_stage é inválido');
      await validator.existsInDbOrError('stadium', { id: this.attributes.local.value }, 'O valor de local é inválido');
      await validator.existsInDbOrError('referee', { id: this.attributes.referee.value }, 'O valor de referee é inválido');
      await validator.existsInDbOrError('referee', { id: this.attributes.assistant_referee_1.value }, 'O valor de assistant_referee_1 é inválido');
      await validator.existsInDbOrError('referee', { id: this.attributes.assistant_referee_2.value }, 'O valor de assistant_referee_2 é inválido');
      await validator.existsInDbOrError('referee', { id: this.attributes.fourth_official.value }, 'O valor de fourth_official é inválido');
      await validator.existsInDbOrError('opponent', { id: this.attributes.opponent.value }, 'O valor de opponent é inválido');

    } catch (error) {
      throw error;
    }
  }
};
