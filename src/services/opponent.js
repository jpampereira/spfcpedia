const { existsOrError, notExistsInDbOrError, removeTableControlFields } = require('../configs/validator')();

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('opponent').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (newOpponents) => {
    for (const opponent of newOpponents) {
      existsOrError(opponent.name, 'O atributo name é obrigatório');
      await notExistsInDbOrError('opponent', { name: opponent.name }, 'Adversário já cadastrado');

      removeTableControlFields(opponent);
    }

    return app.db('opponent').insert(newOpponents, ['id', 'name']);
  };

  const update = async (opponentId, updatedOpponent) => {
    const [opponentInDb] = await read({ id: opponentId });
    const newOpponent = { ...opponentInDb, ...updatedOpponent };
    removeTableControlFields(newOpponent);

    existsOrError(newOpponent.name, 'O valor de name é inválido');
    await notExistsInDbOrError('opponent', ['name = ? and id <> ?', [newOpponent.name, opponentId]], 'Adversário já cadastrado');

    newOpponent.updated_at = 'now';

    return app.db('opponent').update(newOpponent).where({ id: opponentId });
  };

  const remove = async (opponentId) => {
    await notExistsInDbOrError('match', { opponent: opponentId }, 'O adversário possui partidas associadas');

    return app.db('opponent').del().where({ id: opponentId });
  };

  return {
    read, create, update, remove,
  };
};
