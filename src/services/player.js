const Player = require('../entities/Player');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('player').select(app.db.raw('id, name, nickname, to_char(birth, \'YYYY-MM-DD\') as birth, nationality, image')).where(filter);
  };

  const create = async (players) => {
    const newPlayers = [];

    for (const player of players) {
      const newPlayer = new Player(player);

      await newPlayer.requiredAttributesAreFilledOrError();
      await newPlayer.attributesValueAreValidOrError();
      await newPlayer.uniqueConstraintInviolatedOrError();
      await newPlayer.instanceDoesntExistInDbOrError();

      newPlayers.push(newPlayer.getAttributes());
    }

    return app.db('player').insert(newPlayers, ['id', 'name', 'nickname', 'birth', 'image']);
  };

  const update = async (playerId, updatedPlayer) => {
    const [currentPlayer] = await read({ id: playerId });
    let newPlayer = new Player({ ...currentPlayer, ...updatedPlayer });

    await newPlayer.attributesValueAreValidOrError();
    await newPlayer.requiredAttributesAreFilledOrError();
    await newPlayer.uniqueConstraintInviolatedOrError(playerId);
    await newPlayer.instanceDoesntExistInDbOrError(playerId);

    newPlayer = newPlayer.getAttributes();
    newPlayer.updated_at = 'now';

    return app.db('player').update(newPlayer).where({ id: playerId });
  };

  const remove = async (playerId) => {
    await validator.notExistsInDbOrError('lineup', { player_id: playerId }, 'O jogador possui escalações associadas');

    return app.db('player').del().where({ id: playerId });
  };

  return {
    read, create, update, remove,
  };
};
