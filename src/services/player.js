const validator = require('../configs/validator')();
const Player = require('../entities/Player');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('player').select(app.db.raw('id, name, nickname, position, to_char(birth, \'YYYY-MM-DD\') as birth, nationality, image')).where(filter);
  };

  const create = async (players) => {
    const newPlayers = [];

    for (const player of players) {
      let newPlayer = new Player(player);

      newPlayer.allRequiredFieldsAreFilled();
      validator.isDateFormatOrError(newPlayer.birth.value, 'O valor de birth é inválido');
      validator.isUrlFormatOrError(newPlayer.image.value, 'O valor de image é inválido');
      validator.isInArray(newPlayer.position.value, ['G', 'D', 'M', 'F'], 'O valor de position é inválido');
      await validator.existsInDbOrError('country', { id: newPlayer.nationality.value }, 'O valor de nationality é inválido');
      await validator.notExistsInDbOrError('player', { name: newPlayer.name.value }, 'Jogador já cadastrado');
      if (newPlayer.nickname.value) await validator.notExistsInDbOrError('player', { nickname: newPlayer.nickname.value }, 'Apelido já utilizado por outro jogador');

      newPlayers.push(newPlayer.getObject());
    }

    return app.db('player').insert(newPlayers, ['id', 'name', 'nickname', 'position', 'birth', 'image']);
  };

  const update = async (playerId, updatedPlayer) => {
    const [currentPlayer] = await read({ id: playerId });
    let newPlayer = new Player({ ...currentPlayer, ...updatedPlayer });
    
    validator.isDateFormatOrError(newPlayer.birth.value, 'O valor de birth é inválido');
    validator.isUrlFormatOrError(newPlayer.image.value, 'O valor de image é inválido');
    validator.isInArray(newPlayer.position.value, ['G', 'D', 'M', 'F'], 'O valor de position é inválido');
    await validator.existsInDbOrError('country', { id: newPlayer.nationality.value }, 'O valor de nationality é inválido');
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

  return {
    read, create, update, remove,
  };
};
