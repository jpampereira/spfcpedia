const General = require('./General');
const validator = require('../utils/validator')();

module.exports = class Match extends General {
  tournament_stage = { value: null, required: true };
  datetime = { value: null, required: true };
  local = { value: null, required: true };
  referee = { value: null, required: true };
  assistant_referee_1 = { value: null, required: true };
  assistant_referee_2 = { value: null, required: true };
  fourth_official = { value: null, required: true };
  opponent = { value: null, required: true };
  opponent_goals = { value: null, required: true };
  highlights = { value: null, required: true };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async attributesValidation() {
    try {
      validator.isDateTimeFormatOrError(this.datetime.value, 'O valor de datetime é inválido');
      validator.isPositiveOrError(this.opponent_goals.value, 'O valor de opponent_goals é inválido');
      validator.isUrlFormatOrError(this.highlights.value, 'O valor de highlights é inválido');
      await validator.existsInDbOrError('stage', { id: this.tournament_stage.value }, 'O valor de tournament_stage é inválido');
      await validator.existsInDbOrError('stadium', { id: this.local.value }, 'O valor de local é inválido');
      await validator.existsInDbOrError('referee', { id: this.referee.value }, 'O valor de referee é inválido');
      await validator.existsInDbOrError('referee', { id: this.assistant_referee_1.value }, 'O valor de assistant_referee_1 é inválido');
      await validator.existsInDbOrError('referee', { id: this.assistant_referee_2.value }, 'O valor de assistant_referee_2 é inválido');
      await validator.existsInDbOrError('referee', { id: this.fourth_official.value }, 'O valor de fourth_official é inválido');
      await validator.existsInDbOrError('opponent', { id: this.opponent.value }, 'O valor de opponent é inválido');

    } catch (error) {
      throw error;
    }
  }
};
