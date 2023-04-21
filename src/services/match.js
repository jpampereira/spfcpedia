const Match = require('../entities/Match');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('match').select(app.db.raw('tournament_stage, to_char(datetime, \'YYYY-MM-DD HH24:MI\') as datetime, local, referee, assistant_referee_1, assistant_referee_2, fourth_official, opponent, opponent_goals, highlights')).where(filter);
  };

  const create = async (matches) => {
    const newMatches = [];

    for (const match of matches) {
      const newMatch = new Match(match);

      await newMatch.requiredAttributesAreFilledOrError();
      await newMatch.attributesValueAreValidOrError();
      await newMatch.uniqueConstraintInviolatedOrError();
      await newMatch.instanceDoesntExistInDbOrError();

      newMatches.push(newMatch.getAttributes());
    }

    return app.db('match').insert(newMatches, ['id', 'tournament_stage', 'datetime', 'local', 'referee', 'assistant_referee_1', 'assistant_referee_2', 'fourth_official', 'opponent', 'opponent_goals', 'highlights']);
  };

  const update = async (matchId, updatedMatch) => {
    const [currentMatch] = await read({ id: matchId });
    let newMatch = new Match({ ...currentMatch, ...updatedMatch });

    await newMatch.attributesValueAreValidOrError();
    await newMatch.requiredAttributesAreFilledOrError();
    await newMatch.uniqueConstraintInviolatedOrError(matchId);
    await newMatch.instanceDoesntExistInDbOrError(matchId);

    newMatch = newMatch.getAttributes();
    newMatch.updated_at = 'now';

    return app.db('match').update(updatedMatch).where({ id: matchId });
  };

  const remove = async (matchId) => {
    let [currentMatch] = await read({ id: matchId });
    currentMatch = new Match(currentMatch);

    await currentMatch.dependentEntitiesDoesntHaveDataOrError(matchId);

    return app.db('match').del().where({ id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
