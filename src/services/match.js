const {
  existsOrError,
  existsInDbOrError,
  notExistsInDbOrError,
  isPositiveOrError,
  isDateTimeFormatOrError,
  isUrlFormatOrError,
  removeTableControlFields,
} = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('match').select(app.db.raw('tournament_stage, to_char(datetime, \'YYYY-MM-DD HH24:MI\') as datetime, local, referee, assistant_referee_1, assistant_referee_2, fourth_official, opponent, opponent_goals, highlights')).where(filter);
  };

  const create = async (newMatches) => {
    for (const match of newMatches) {
      existsOrError(match.datetime, 'O atributo datetime é obrigatório');
      existsOrError(match.opponent_goals, 'O atributo opponent_goals é obrigatório');
      existsOrError(match.highlights, 'O atributo highlights é obrigatório');
      existsOrError(match.tournament_stage, 'O atributo tournament_stage é obrigatório');
      existsOrError(match.local, 'O atributo local é obrigatório');
      existsOrError(match.referee, 'O atributo referee é obrigatório');
      existsOrError(match.assistant_referee_1, 'O atributo assistant_referee_1 é obrigatório');
      existsOrError(match.assistant_referee_2, 'O atributo assistant_referee_2 é obrigatório');
      existsOrError(match.fourth_official, 'O atributo fourth_official é obrigatório');
      existsOrError(match.opponent, 'O atributo opponent é obrigatório');
      isDateTimeFormatOrError(match.datetime, 'O valor de datetime é inválido');
      isPositiveOrError(match.opponent_goals, 'O valor de opponent_goals é inválido');
      isUrlFormatOrError(match.highlights, 'O valor de highlights é inválido');
      await existsInDbOrError('stage', { id: match.tournament_stage }, 'O valor de tournament_stage é inválido');
      await existsInDbOrError('stadium', { id: match.local }, 'O valor de local é inválido');
      await existsInDbOrError('referee', { id: match.referee }, 'O valor de referee é inválido');
      await existsInDbOrError('referee', { id: match.assistant_referee_1 }, 'O valor de assistant_referee_1 é inválido');
      await existsInDbOrError('referee', { id: match.assistant_referee_2 }, 'O valor de assistant_referee_2 é inválido');
      await existsInDbOrError('referee', { id: match.fourth_official }, 'O valor de fourth_official é inválido');
      await existsInDbOrError('opponent', { id: match.opponent }, 'O valor de opponent é inválido');
      await notExistsInDbOrError('match', match, 'Partida já cadastrada');

      removeTableControlFields(match);
    }

    return app.db('match').insert(newMatches, ['id', 'tournament_stage', 'datetime', 'local', 'referee', 'assistant_referee_1', 'assistant_referee_2', 'fourth_official', 'opponent', 'opponent_goals', 'highlights']);
  };

  const update = async (matchId, updatedMatch) => {
    const [matchInDb] = await read({ id: matchId });
    const newMatch = { ...matchInDb, ...updatedMatch };
    removeTableControlFields(newMatch);

    isDateTimeFormatOrError(newMatch.datetime, 'O valor de datetime é inválido');
    isPositiveOrError(newMatch.opponent_goals, 'O valor de opponent_goals é inválido');
    isUrlFormatOrError(newMatch.highlights, 'O valor de highlights é inválido');
    await existsInDbOrError('stage', { id: newMatch.tournament_stage }, 'O valor de tournament_stage é inválido');
    await existsInDbOrError('stadium', { id: newMatch.local }, 'O valor de local é inválido');
    await existsInDbOrError('referee', { id: newMatch.referee }, 'O valor de referee é inválido');
    await existsInDbOrError('referee', { id: newMatch.assistant_referee_1 }, 'O valor de assistant_referee_1 é inválido');
    await existsInDbOrError('referee', { id: newMatch.assistant_referee_2 }, 'O valor de assistant_referee_2 é inválido');
    await existsInDbOrError('referee', { id: newMatch.fourth_official }, 'O valor de fourth_official é inválido');
    await existsInDbOrError('opponent', { id: newMatch.opponent }, 'O valor de opponent é inválido');
    await notExistsInDbOrError('match', newMatch, 'Partida já cadastrada');

    newMatch.updated_at = 'now';

    return app.db('match').update(updatedMatch).where({ id: matchId });
  };

  const remove = (matchId) => {
    return app.db('match').del().where({ id: matchId });
  };

  return { create, update, remove };
};
