const LineupPlayer = require('../entities/LineupPlayer');
const Lineup = require('../entities/Lineup');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'position_id', 'shirt_number']).where(filter);
  };

  const create = async (lineup) => {
    let newLineup = [];

    for (const player of lineup) {
      const lineupPlayer = new LineupPlayer(player);

      await lineupPlayer.requiredAttributesAreFilledOrError();
      await lineupPlayer.attributesValueAreValidOrError();
      await lineupPlayer.uniqueConstraintInviolatedOrError();
      await lineupPlayer.instanceDoesntExistInDbOrError();

      newLineup.push(lineupPlayer.getAttributes());
    }

    newLineup = new Lineup(newLineup);

    await newLineup.collectionSizeIntoBoundaryOrError();
    await newLineup.sharedAttributesConstraintOrError();
    await newLineup.uniqueAttributesConstraintOrError();
    await newLineup.instanceIsNotInDbOrError();

    newLineup = newLineup.getCollection();

    return app.db('lineup').insert(newLineup, ['id', 'match_id', 'player_id', 'position_id', 'shirt_number']);
  };

  const update = async (lineupPlayerId, updatedLineupPlayer) => {
    const [currentLineupPlayer] = await read({ id: lineupPlayerId });
    let lineupPlayer = new LineupPlayer(currentLineupPlayer);
    lineupPlayer.setAttributes(updatedLineupPlayer);

    await lineupPlayer.attributesValueAreValidOrError();
    await lineupPlayer.requiredAttributesAreFilledOrError();
    await lineupPlayer.uniqueConstraintInviolatedOrError(lineupPlayerId);
    await lineupPlayer.instanceDoesntExistInDbOrError(lineupPlayerId);

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

      await currentLineupPlayer.dependentEntitiesDoesntHaveDataOrError(id);
    }

    return app.db('lineup').del().where({ match_id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
