const Player = require('../entities/Player');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('player').select(app.db.raw('id, name, nickname, to_char(birth, \'YYYY-MM-DD\') as birth, country_id, image')).where(filter).orderBy('id');
  };

  const create = async (players) => {
    const newPlayers = [];

    for (const player of players) {
      const newPlayer = new Player(player);

      await newPlayer.requiredAttributesAreFilledOrError();
      await newPlayer.attributesValueAreValidOrError();
      await newPlayer.uniqueConstraintInviolatedOrError();
      await newPlayer.onlyOneXorAttributeIsFilledOrError();
      await newPlayer.instanceDoesntExistInDbOrError();

      newPlayers.push(newPlayer.getAttributes());
    }

    return app.db('player').insert(newPlayers, ['id', 'name', 'nickname', 'birth', 'country_id', 'image']);
  };

  const update = async (playerId, updatedPlayer) => {
    const [currentPlayer] = await read({ id: playerId });
    let newPlayer = new Player(currentPlayer);
    newPlayer.setAttributes(updatedPlayer);

    await newPlayer.attributesValueAreValidOrError();
    await newPlayer.requiredAttributesAreFilledOrError();
    await newPlayer.uniqueConstraintInviolatedOrError(playerId);
    await newPlayer.onlyOneXorAttributeIsFilledOrError();
    await newPlayer.instanceDoesntExistInDbOrError(playerId);

    newPlayer = newPlayer.getAttributes();
    newPlayer.updated_at = 'now';

    return app.db('player').update(newPlayer).where({ id: playerId });
  };

  const remove = async (playerId) => {
    let [currentPlayer] = await read({ id: playerId });
    currentPlayer = new Player(currentPlayer);

    await currentPlayer.dependentEntitiesDoesntHaveDataOrError(playerId);

    return app.db('player').del().where({ id: playerId });
  };

  return {
    read, create, update, remove,
  };
};
