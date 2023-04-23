const SelectedPlayer = require('../entities/SelectedPlayer');
const Lineup = require('../entities/Lineup');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('lineup').select(['id', 'match_id', 'player_id', 'position_id', 'shirt_number']).where(filter);
  };

  const create = async (lineup) => {
    let newLineup = [];

    for (const player of lineup) {
      const selectedPlayer = new SelectedPlayer(player);

      await selectedPlayer.requiredAttributesAreFilledOrError();
      await selectedPlayer.attributesValueAreValidOrError();
      await selectedPlayer.uniqueConstraintInviolatedOrError();
      await selectedPlayer.instanceDoesntExistInDbOrError();

      newLineup.push(selectedPlayer.getAttributes());
    }

    newLineup = new Lineup(newLineup);

    await newLineup.collectionSizeIntoBoundaryOrError();
    await newLineup.sharedAttributesConstraintOrError();
    await newLineup.uniqueAttributesConstraintOrError();
    await newLineup.instanceIsNotInDbOrError();

    newLineup = newLineup.getCollection();

    return app.db('lineup').insert(newLineup, ['id', 'match_id', 'player_id', 'position_id', 'shirt_number']);
  };

  const update = async (selectedPlayerId, updatedSelectedPlayer) => {
    const [currentselectedPlayer] = await read({ id: selectedPlayerId });
    let selectedPlayer = new SelectedPlayer(currentselectedPlayer);
    selectedPlayer.setAttributes(updatedSelectedPlayer);

    await selectedPlayer.attributesValueAreValidOrError();
    await selectedPlayer.requiredAttributesAreFilledOrError();
    await selectedPlayer.uniqueConstraintInviolatedOrError(selectedPlayerId);
    await selectedPlayer.instanceDoesntExistInDbOrError(selectedPlayerId);

    selectedPlayer = selectedPlayer.getAttributes();
    selectedPlayer.updated_at = 'now';

    return app.db('lineup').update(selectedPlayer).where({ id: selectedPlayerId });
  };

  const remove = async (matchId) => {
    let currentLineup = await read({ match_id: matchId });
    currentLineup = new Lineup(currentLineup);
    currentLineup = currentLineup.getCollection();

    for (let currentselectedPlayer of currentLineup) {
      const { id } = currentselectedPlayer;
      currentselectedPlayer = new SelectedPlayer(currentselectedPlayer);

      await currentselectedPlayer.dependentEntitiesDoesntHaveDataOrError(id);
    }

    return app.db('lineup').del().where({ match_id: matchId });
  };

  return {
    read, create, update, remove,
  };
};
