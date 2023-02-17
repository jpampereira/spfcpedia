module.exports = (app) => {
  const { existsOrError, notExistsInDbOrError, removeTableControlFields } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('referee').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (newReferees) => {
    for (const referee of newReferees) {
      existsOrError(referee.name, 'O atributo name é obrigatório');
      await notExistsInDbOrError('referee', { name: referee.name }, 'Árbitro já cadastrado');

      removeTableControlFields(referee);
    }

    return app.db('referee').insert(newReferees, ['id', 'name']);
  };

  const update = async (refereeId, updatedReferee) => {
    const [refereeInDb] = await read({ id: refereeId });
    const newReferee = { ...refereeInDb, ...updatedReferee };
    removeTableControlFields(newReferee);

    existsOrError(newReferee.name, 'O atributo name deve ser preenchido');
    await notExistsInDbOrError('referee', ['name = ? and id <> ?', [newReferee.name, refereeId]], 'Árbitro já cadastrado');

    newReferee.updated_at = 'now';

    return app.db('referee').update(newReferee).where({ id: refereeId });
  };

  const remove = async (refereeId) => {
    await notExistsInDbOrError('match', ['referee = ? or assistant_referee_1 = ? or assistant_referee_2 = ? or fourth_official = ?', refereeId], 'O árbitro possui partidas associadas');

    return app.db('referee').del().where({ id: refereeId });
  };

  return {
    read, create, update, remove,
  };
};
