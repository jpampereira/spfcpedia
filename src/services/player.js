const {
  existsOrError,
  existsInDbOrError,
  notExistsInDbOrError,
  isDateFormatOrError,
  isUrlFormatOrError,
  isInArray,
  removeTableControlFields,
} = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('player').select(app.db.raw('id, name, nickname, position, to_char(birth, \'YYYY-MM-DD\') as birth, nationality, image')).where(filter);
  };

  const create = async (newPlayers) => {
    for (const player of newPlayers) {
      existsOrError(player.name, 'O atributo name é obrigatório');
      existsOrError(player.birth, 'O atributo birth é obrigatório');
      existsOrError(player.image, 'O atributo image é obrigatório');
      existsOrError(player.position, 'O atributo position é obrigatório');
      existsOrError(player.nationality, 'O atributo nationality é obrigatório');
      isDateFormatOrError(player.birth, 'O valor de birth é inválido');
      isUrlFormatOrError(player.image, 'O valor de image é inválido');
      isInArray(player.position, ['G', 'D', 'M', 'F'], 'O valor de position é inválido');
      await existsInDbOrError('country', { id: player.nationality }, 'O valor de nationality é inválido');
      await notExistsInDbOrError('player', { name: player.name }, 'Jogador já cadastrado');
      if (player.nickname) await notExistsInDbOrError('player', { nickname: player.nickname }, 'Apelido já utilizado por outro jogador');

      removeTableControlFields(player);
    }

    return app.db('player').insert(newPlayers, ['id', 'name', 'nickname', 'position', 'birth', 'image']);
  };

  const update = async (playerId, updatedPlayer) => {
    const [playerInDb] = await read({ id: playerId });
    const newPlayer = { ...playerInDb, ...updatedPlayer };
    removeTableControlFields(newPlayer);

    isDateFormatOrError(newPlayer.birth, 'O valor de birth é inválido');
    isUrlFormatOrError(newPlayer.image, 'O valor de image é inválido');
    isInArray(newPlayer.position, ['G', 'D', 'M', 'F'], 'O valor de position é inválido');
    await existsInDbOrError('country', { id: newPlayer.nationality }, 'O valor de nationality é inválido');
    await notExistsInDbOrError('player', ['name = ? and id <> ?', [newPlayer.name, playerId]], 'Jogador já cadastrado');
    if (newPlayer.nickname) await notExistsInDbOrError('player', ['nickname = ? and id <> ?', [newPlayer.nickname, playerId]], 'Apelido já utilizado por outro jogador');

    newPlayer.updated_at = 'now';

    return app.db('player').update(newPlayer).where({ id: playerId });
  };

  const remove = async (playerId) => {
    await notExistsInDbOrError('lineup', { player_id: playerId }, 'O jogador possui escalações associadas');

    return app.db('player').del().where({ id: playerId });
  };

  return {
    read, create, update, remove,
  };
};
