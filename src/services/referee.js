module.exports = (app) => {
  const { existsOrError, notExistsInDbOrError } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('referee').select().where(filter);
  };

  const create = async (newReferees) => {
    for (const referee of newReferees) {
      existsOrError(referee.name, 'Nome é um atributo obrigatório');
      await notExistsInDbOrError('referee', { name: referee.name }, 'Árbitro já cadastrado');
    }

    return app.db('referee').insert(newReferees, ['id', 'name']);
  };

  const update = async (refereeId, refereeUpdated) => {
    await notExistsInDbOrError('referee', { name: refereeUpdated.name }, 'Árbitro já cadastrado');

    return app.db('referee').update(refereeUpdated).where({ id: refereeId });
  };

  const remove = (refereeId) => {
    return app.db('referee').del().where({ id: refereeId });
  };

  return {
    read, create, update, remove,
  };
};
