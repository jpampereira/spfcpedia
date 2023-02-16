module.exports = (app) => {
  const { existsOrError, notExistsInDbOrError, removeTableControlFields } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('opponent').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (newOpponents) => {
    for (const opponent of newOpponents) {
      existsOrError(opponent.name, 'Nome é um atributo obrigatório');
      await notExistsInDbOrError('opponent', { name: opponent.name }, 'Adversário já cadastrado');

      removeTableControlFields(opponent);
    }

    return app.db('opponent').insert(newOpponents, ['id', 'name']);
  };

  const update = async (opponentId, updatedOpponent) => {
    await notExistsInDbOrError('opponent', { name: updatedOpponent.name }, 'Adversário já cadastrado');

    removeTableControlFields(updatedOpponent);
    const newOpponent = { ...updatedOpponent, updated_at: 'now' };

    return app.db('opponent').update(newOpponent).where({ id: opponentId });
  };

  const remove = (opponentId) => {
    return app.db('opponent').del().where({ id: opponentId });
  };

  return {
    read, create, update, remove,
  };
};
