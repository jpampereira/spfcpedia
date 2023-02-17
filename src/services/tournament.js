module.exports = (app) => {
  const { existsOrError, notExistsInDbOrError, removeTableControlFields } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (newTournaments) => {
    for (const tournament of newTournaments) {
      existsOrError(tournament.name, 'O atributo name é obrigatório');
      await notExistsInDbOrError('tournament', { name: tournament.name }, 'Campeonato já cadastrado');

      removeTableControlFields(tournament);
    }

    return app.db('tournament').insert(newTournaments, ['id', 'name']);
  };

  const update = async (tournamentId, updatedTournament) => {
    const [tournamentInDb] = await read({ id: tournamentId });
    const newTournament = { ...tournamentInDb, ...updatedTournament };
    removeTableControlFields(newTournament);

    existsOrError(newTournament.name, 'O atributo name deve ser preenchido');
    await notExistsInDbOrError('tournament', ['name = ? and id <> ?', [newTournament.name, tournamentId]], 'Campeonato já cadastrado');

    newTournament.updated_at = 'now';

    return app.db('tournament').update(newTournament).where({ id: tournamentId });
  };

  const remove = async (tournamentId) => {
    await notExistsInDbOrError('stage', { tournament_id: tournamentId }, 'O campeonato possui fases associadas');

    return app.db('tournament').del().where({ id: tournamentId });
  };

  return {
    read, create, update, remove,
  };
};
