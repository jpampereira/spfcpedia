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

      newPlayer.allRequiredAttributesAreFilled();
      await newPlayer.attributesValidation();
      await validator.notExistsInDbOrError('player', { name: newPlayer.name.value }, 'Jogador já cadastrado');
      if (newPlayer.nickname.value) await validator.notExistsInDbOrError('player', { nickname: newPlayer.nickname.value }, 'Apelido já utilizado por outro jogador');

      newPlayers.push(newPlayer.getObject());
    }
    
    return app.db('player').insert(newPlayers, ['id', 'name', 'nickname', 'position', 'birth', 'image']);
  };

  const update = async (playerId, updatedPlayer) => {
    const [currentPlayer] = await read({ id: playerId });
    let newPlayer = new Player({ ...currentPlayer, ...updatedPlayer });
    
    await newPlayer.attributesValidation();
    await validator.notExistsInDbOrError('player', ['name = ? and id <> ?', [newPlayer.name.value, playerId]], 'Jogador já cadastrado');
    if (newPlayer.nickname.value) await validator.notExistsInDbOrError('player', ['nickname = ? and id <> ?', [newPlayer.nickname.value, playerId]], 'Apelido já utilizado por outro jogador');
    
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
