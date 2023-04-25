const LineupPlayer = require('../entities/LineupPlayer');
const Lineup = require('../entities/Lineup');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'position_id', 'shirt_number']).where(filter).orderBy('id');
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

    return app.db('lineup').insert(newLineup, ['id', 'match_id', 'player_id', 'position_id', 'shirt_number']);
  };

  const update = async (lineupPlayerId, updatedLineupPlayer) => {
    const [currentLineupPlayer] = await read({ id: lineupPlayerId });
    let lineupPlayer = new LineupPlayer(currentLineupPlayer);
    lineupPlayer.setAttributes(updatedLineupPlayer);

    await lineupPlayer.attrsValuesAreValidOrError();
    await lineupPlayer.requiredAttrsAreFilledOrError();
    await lineupPlayer.attrsWithUniqueValueOrError(lineupPlayerId);
    await lineupPlayer.oneXorAttrIsFilledOrError();
    await lineupPlayer.instanceIsNotInDbOrError(lineupPlayerId);

    lineupPlayer = lineupPlayer.getAttributes();
    lineupPlayer.updated_at = 'now';

    return app.db('lineup').update(lineupPlayer).where({ id: lineupPlayerId });
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

    return app.db('lineup').del().where({ match_id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
