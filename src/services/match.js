const Match = require('../entities/Match');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('match').select(app.db.raw('id, stage_id, to_char(datetime, \'YYYY-MM-DD HH24:MI\') as datetime, stadium_id, referee, assistant_referee_1, assistant_referee_2, fourth_official, opponent_id, opponent_goals, highlights')).where(filter).orderBy('id');
  };

  const create = async (matches) => {
    const newMatches = [];

    for (const match of matches) {
      const newMatch = new Match(match);

      await newMatch.requiredAttrsAreFilledOrError();
      await newMatch.attrsValuesAreValidOrError();
      await newMatch.attrsWithUniqueValueOrError();
      await newMatch.oneXorAttrIsFilledOrError();
      await newMatch.instanceIsNotInDbOrError();

      newMatches.push(newMatch.getAttributes());
    }

    return app.db('match').insert(newMatches, ['id', 'stage_id', 'datetime', 'stadium_id', 'referee', 'assistant_referee_1', 'assistant_referee_2', 'fourth_official', 'opponent_id', 'opponent_goals', 'highlights']);
  };

  const update = async (matchId, updatedMatch) => {
    const [currentMatch] = await read({ id: matchId });
    let newMatch = new Match(currentMatch);
    newMatch.setAttributes(updatedMatch);

    await newMatch.attrsValuesAreValidOrError();
    await newMatch.requiredAttrsAreFilledOrError();
    await newMatch.attrsWithUniqueValueOrError(matchId);
    await newMatch.oneXorAttrIsFilledOrError();
    await newMatch.instanceIsNotInDbOrError(matchId);

    newMatch = newMatch.getAttributes();
    newMatch.updated_at = 'now';

    return app.db('match').update(updatedMatch).where({ id: matchId });
  };

  const remove = async (matchId) => {
    let [currentMatch] = await read({ id: matchId });
    currentMatch = new Match(currentMatch);

    await currentMatch.dataIsNotForeignKeyOrError(matchId);

    return app.db('match').del().where({ id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
