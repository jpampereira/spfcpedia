const Match = require('../entities/Match');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.match.read(filter);
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

    return app.services.match.create(newMatches);
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

    return app.services.match.update(matchId, newMatch);
  };

  const remove = async (matchId) => {
    let [currentMatch] = await read({ id: matchId });
    currentMatch = new Match(currentMatch);

    await currentMatch.dataIsNotForeignKeyOrError(matchId);

    return app.services.match.remove(matchId);
  };

  return { read, create, update, remove };
};
