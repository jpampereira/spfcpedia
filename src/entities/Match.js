const General = require('./General');
const exits = require('../configs/exits');
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
    highlights: { value: null, required: true, unique: false },
  };

  constructor(obj) {
    super();
    this.setAttributes(obj);
  }

  async validAttributesOrError() {
    const errorMessage = exits.INVALID_ATTRIBUTE_ERROR;

    validator.isDateTimeFormatOrError(this.attributes.datetime.value, errorMessage.replace(/<ATTR_NAME>/, 'datetime'));
    validator.isPositiveOrError(this.attributes.opponent_goals.value, errorMessage.replace(/<ATTR_NAME>/, 'opponent_goals'));
    validator.isUrlFormatOrError(this.attributes.highlights.value, errorMessage.replace(/<ATTR_NAME>/, 'highlights'));
    await validator.existsInDbOrError('stage', { id: this.attributes.tournament_stage.value }, errorMessage.replace(/<ATTR_NAME>/, 'tournament_stage'));
    await validator.existsInDbOrError('stadium', { id: this.attributes.local.value }, errorMessage.replace(/<ATTR_NAME>/, 'local'));
    await validator.existsInDbOrError('referee', { id: this.attributes.referee.value }, errorMessage.replace(/<ATTR_NAME>/, 'referee'));
    await validator.existsInDbOrError('referee', { id: this.attributes.assistant_referee_1.value }, errorMessage.replace(/<ATTR_NAME>/, 'assistant_referee_1'));
    await validator.existsInDbOrError('referee', { id: this.attributes.assistant_referee_2.value }, errorMessage.replace(/<ATTR_NAME>/, 'assistant_referee_2'));
    await validator.existsInDbOrError('referee', { id: this.attributes.fourth_official.value }, errorMessage.replace(/<ATTR_NAME>/, 'fourth_official'));
    await validator.existsInDbOrError('opponent', { id: this.attributes.opponent.value }, errorMessage.replace(/<ATTR_NAME>/, 'opponent'));
  }
};
