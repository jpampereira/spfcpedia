const Player = require('../entities/Player');
const validator = require('../utils/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('player').select(app.db.raw('id, name, nickname, position, to_char(birth, \'YYYY-MM-DD\') as birth, nationality, image')).where(filter);
  };

  const create = async (players) => {
    const newPlayers = [];

    for (const player of players) {
      const newPlayer = new Player(player);

      await newPlayer.allRequiredAttributesAreFilledOrError();
      await newPlayer.validAttributesOrError();
      await newPlayer.uniqueAttributesValuesOrError();
      await newPlayer.instanceDoesntExistOrError();

      newPlayers.push(newPlayer.getObject());
    }
    
    return app.db('player').insert(newPlayers, ['id', 'name', 'nickname', 'position', 'birth', 'image']);
  };

  const update = async (playerId, updatedPlayer) => {
    const [currentPlayer] = await read({ id: playerId });
    let newPlayer = new Player({ ...currentPlayer, ...updatedPlayer });
    
    await newPlayer.validAttributesOrError();
    await newPlayer.allRequiredAttributesAreFilledOrError();
    await newPlayer.uniqueAttributesValuesOrError(playerId);
    await newPlayer.instanceDoesntExistOrError(playerId);
    
    newPlayer = newPlayer.getObject();
    newPlayer.updated_at = 'now';

    return app.db('player').update(newPlayer).where({ id: playerId });
  };

  const remove = async (playerId) => {
    await validator.notExistsInDbOrError('lineup', { player_id: playerId }, 'O jogador possui escalações associadas');

    return app.db('player').del().where({ id: playerId });
  };

  return { read, create, update, remove };
};
