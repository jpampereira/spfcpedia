const {
  existsOrError,
  existsInDbOrError,
  notExistsInDbOrError,
  removeTableControlFields,
} = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stadium').select(['id', 'name', 'nickname', 'city_id']).where(filter).orderBy('id');
  };

  const create = async (newStadiums) => {
    for (const stadium of newStadiums) {
      existsOrError(stadium.name, 'O atributo name é obrigatório');
      existsOrError(stadium.city_id, 'O atributo city_id é obrigatório');
      await existsInDbOrError('city', { id: stadium.city_id }, 'O valor de city_id é inválido');
      await notExistsInDbOrError('stadium', { name: stadium.name }, 'Estádio já cadastrado');
      if (stadium.nickname) await notExistsInDbOrError('stadium', { nickname: stadium.nickname }, 'Apelido já utilizado por outro estádio');

      removeTableControlFields(stadium);
    }

    return app.db('stadium').insert(newStadiums, ['id', 'name', 'nickname', 'city_id']);
  };

  const update = async (stadiumId, updatedStadium) => {
    const [stadiumInDb] = await read({ id: stadiumId });
    const newStadium = { ...stadiumInDb, ...updatedStadium };
    removeTableControlFields(newStadium);

    existsOrError(newStadium.name, 'O valor de name é inválido');
    await existsInDbOrError('city', { id: newStadium.city_id }, 'O valor de city_id é inválido');
    await notExistsInDbOrError('stadium', ['name = ? and id <> ?', [newStadium.name, stadiumId]], 'Estádio já cadastrado');
    if (newStadium.nickname) await notExistsInDbOrError('stadium', ['nickname = ? and id <> ?', [newStadium.nickname, stadiumId]], 'Apelido já utilizado por outro estádio');

    newStadium.updated_at = 'now';

    return app.db('stadium').update(newStadium).where({ id: stadiumId });
  };

  const remove = async (stadiumId) => {
    await notExistsInDbOrError('match', { local: stadiumId }, 'O estádio possui partidas associadas');

    return app.db('stadium').del().where({ id: stadiumId });
  };

  return {
    read, create, update, remove,
  };
};
