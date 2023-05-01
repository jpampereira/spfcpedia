const Player = require('../entities/Player');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.services.player.read(filter);
  };

  const create = async (players) => {
    const newPlayers = [];

    for (const player of players) {
      const newPlayer = new Player(player);

      await newPlayer.requiredAttrsAreFilledOrError();
      await newPlayer.attrsValuesAreValidOrError();
      await newPlayer.attrsWithUniqueValueOrError();
      await newPlayer.oneXorAttrIsFilledOrError();
      await newPlayer.instanceIsNotInDbOrError();

      newPlayers.push(newPlayer.getAttributes());
    }

    return app.services.player.create(newPlayers);
  };

  const update = async (playerId, updatedPlayer) => {
    const [currentPlayer] = await read({ id: playerId });
    let newPlayer = new Player(currentPlayer);
    newPlayer.setAttributes(updatedPlayer);

    await newPlayer.attrsValuesAreValidOrError();
    await newPlayer.requiredAttrsAreFilledOrError();
    await newPlayer.attrsWithUniqueValueOrError(playerId);
    await newPlayer.oneXorAttrIsFilledOrError();
    await newPlayer.instanceIsNotInDbOrError(playerId);

    newPlayer = newPlayer.getAttributes();
    newPlayer.updated_at = 'now';

    return app.services.player.update(playerId, newPlayer);
  };

  const remove = async (playerId) => {
    let [currentPlayer] = await read({ id: playerId });
    currentPlayer = new Player(currentPlayer);

    await currentPlayer.dataIsNotForeignKeyOrError(playerId);

    return app.services.player.remove(playerId);
  };

  return { read, create, update, remove };
};
