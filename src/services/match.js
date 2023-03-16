const validator = require('../configs/validator')();
const Match = require('../entities/Match');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('match').select(app.db.raw('tournament_stage, to_char(datetime, \'YYYY-MM-DD HH24:MI\') as datetime, local, referee, assistant_referee_1, assistant_referee_2, fourth_official, opponent, opponent_goals, highlights')).where(filter);
  };

  const create = async (matches) => {
    const newMatches = [];

    for (const match of matches) {
      let newMatch = new Match(match);

      newMatch.allRequiredFieldsAreFilled();
      validator.isDateTimeFormatOrError(newMatch.datetime.value, 'O valor de datetime é inválido');
      validator.isPositiveOrError(newMatch.opponent_goals.value, 'O valor de opponent_goals é inválido');
      validator.isUrlFormatOrError(newMatch.highlights.value, 'O valor de highlights é inválido');
      await validator.existsInDbOrError('stage', { id: newMatch.tournament_stage.value }, 'O valor de tournament_stage é inválido');
      await validator.existsInDbOrError('stadium', { id: newMatch.local.value }, 'O valor de local é inválido');
      await validator.existsInDbOrError('referee', { id: newMatch.referee.value }, 'O valor de referee é inválido');
      await validator.existsInDbOrError('referee', { id: newMatch.assistant_referee_1.value }, 'O valor de assistant_referee_1 é inválido');
      await validator.existsInDbOrError('referee', { id: newMatch.assistant_referee_2.value }, 'O valor de assistant_referee_2 é inválido');
      await validator.existsInDbOrError('referee', { id: newMatch.fourth_official.value }, 'O valor de fourth_official é inválido');
      await validator.existsInDbOrError('opponent', { id: newMatch.opponent.value }, 'O valor de opponent é inválido');
      await validator.notExistsInDbOrError('match', newMatch.getObject(), 'Partida já cadastrada');

      newMatches.push(newMatch.getObject());
    }

    return app.db('match').insert(newMatches, ['id', 'tournament_stage', 'datetime', 'local', 'referee', 'assistant_referee_1', 'assistant_referee_2', 'fourth_official', 'opponent', 'opponent_goals', 'highlights']);
  };

  const update = async (matchId, updatedMatch) => {
    const [currentMatch] = await read({ id: matchId });
    let newMatch = new Match({ ...currentMatch, ...updatedMatch });
    
    validator.isDateTimeFormatOrError(newMatch.datetime.value, 'O valor de datetime é inválido');
    validator.isPositiveOrError(newMatch.opponent_goals.value, 'O valor de opponent_goals é inválido');
    validator.isUrlFormatOrError(newMatch.highlights.value, 'O valor de highlights é inválido');
    await validator.existsInDbOrError('stage', { id: newMatch.tournament_stage.value }, 'O valor de tournament_stage é inválido');
    await validator.existsInDbOrError('stadium', { id: newMatch.local.value }, 'O valor de local é inválido');
    await validator.existsInDbOrError('referee', { id: newMatch.referee.value }, 'O valor de referee é inválido');
    await validator.existsInDbOrError('referee', { id: newMatch.assistant_referee_1.value }, 'O valor de assistant_referee_1 é inválido');
    await validator.existsInDbOrError('referee', { id: newMatch.assistant_referee_2.value }, 'O valor de assistant_referee_2 é inválido');
    await validator.existsInDbOrError('referee', { id: newMatch.fourth_official.value }, 'O valor de fourth_official é inválido');
    await validator.existsInDbOrError('opponent', { id: newMatch.opponent.value }, 'O valor de opponent é inválido');
    await validator.notExistsInDbOrError('match', newMatch.getObject(), 'Partida já cadastrada');
    
    newMatch = newMatch.getObject();
    newMatch.updated_at = 'now';

    return app.db('match').update(updatedMatch).where({ id: matchId });
  };

  const remove = async (matchId) => {
    await validator.notExistsInDbOrError('lineup', { match_id: matchId }, 'A partida possui uma escalação associada');

    return app.db('match').del().where({ id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
