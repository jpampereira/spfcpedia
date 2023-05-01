const LineupPlayer = require('../entities/LineupPlayer');
const Lineup = require('../entities/Lineup');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.lineup.read(filter);
  };

  const create = async (lineup) => {
    let newLineup = [];

    for (const player of lineup) {
      const lineupPlayer = new LineupPlayer(player);

      await lineupPlayer.requiredAttrsAreFilledOrError();
      await lineupPlayer.attrsValuesAreValidOrError();
      await lineupPlayer.attrsWithUniqueValueOrError();
      await lineupPlayer.oneXorAttrIsFilledOrError();
      await lineupPlayer.instanceIsNotInDbOrError();

      newLineup.push(lineupPlayer.getAttributes());
    }

    newLineup = new Lineup(newLineup);

    await newLineup.collectionSizeIntoBoundaryOrError();
    await newLineup.attrsWithSameValueOrError();
    await newLineup.attrsWithDiffValueOrError();
    await newLineup.instanceIsNotInDbOrError();

    newLineup = newLineup.getCollection();

    return app.services.lineup.create(newLineup);
  };

  const update = async (lineupPlayerId, updatedLineupPlayer) => {
    const [currentLineupPlayer] = await read({ id: lineupPlayerId });
    let newLineupPlayer = new LineupPlayer(currentLineupPlayer);
    newLineupPlayer.setAttributes(updatedLineupPlayer);

    await newLineupPlayer.attrsValuesAreValidOrError();
    await newLineupPlayer.requiredAttrsAreFilledOrError();
    await newLineupPlayer.attrsWithUniqueValueOrError(lineupPlayerId);
    await newLineupPlayer.oneXorAttrIsFilledOrError();
    await newLineupPlayer.instanceIsNotInDbOrError(lineupPlayerId);

    newLineupPlayer = newLineupPlayer.getAttributes();
    newLineupPlayer.updated_at = 'now';

    return app.services.lineup.update(lineupPlayerId, newLineupPlayer);
  };

  const remove = async (matchId) => {
    let currentLineup = await read({ match_id: matchId });
    currentLineup = new Lineup(currentLineup);
    currentLineup = currentLineup.getCollection();

    for (let currentLineupPlayer of currentLineup) {
      const { id } = currentLineupPlayer;
      currentLineupPlayer = new LineupPlayer(currentLineupPlayer);

      await currentLineupPlayer.dataIsNotForeignKeyOrError(id);
    }

    return app.services.lineup.remove(matchId);
  };

  return { read, create, update, remove };
};
