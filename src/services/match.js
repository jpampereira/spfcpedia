const Match = require('../entities/Match');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('match').select(app.db.raw('tournament_stage, to_char(datetime, \'YYYY-MM-DD HH24:MI\') as datetime, local, referee, assistant_referee_1, assistant_referee_2, fourth_official, opponent, opponent_goals, highlights')).where(filter);
  };

  const create = async (matches) => {
    const newMatches = [];

    for (const match of matches) {
      const newMatch = new Match(match);

      await newMatch.allRequiredAttributesAreFilledOrError();
      await newMatch.validAttributesOrError();
      await newMatch.uniqueAttributesValuesOrError();
      await newMatch.instanceDoesntExistOrError();

      newMatches.push(newMatch.getObject());
    }

    return app.db('match').insert(newMatches, ['id', 'tournament_stage', 'datetime', 'local', 'referee', 'assistant_referee_1', 'assistant_referee_2', 'fourth_official', 'opponent', 'opponent_goals', 'highlights']);
  };

  const update = async (matchId, updatedMatch) => {
    const [currentMatch] = await read({ id: matchId });
    let newMatch = new Match({ ...currentMatch, ...updatedMatch });

    await newMatch.validAttributesOrError();
    await newMatch.allRequiredAttributesAreFilledOrError();
    await newMatch.uniqueAttributesValuesOrError(matchId);
    await newMatch.instanceDoesntExistOrError(matchId);
    
    newMatch = newMatch.getObject();
    newMatch.updated_at = 'now';

    return app.db('match').update(updatedMatch).where({ id: matchId });
  };

  const remove = async (matchId) => {
    await validator.notExistsInDbOrError('lineup', { match_id: matchId }, 'A partida possui uma escalação associada');

    return app.db('match').del().where({ id: matchId });
  };

  return { read, create, update, remove };
};
