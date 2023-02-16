module.exports = (app) => {
  const { existsOrError, notExistsInDbOrError, removeTableControlFields } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter).orderBy('id');
  };

  const create = async (newTournaments) => {
    for (const tournament of newTournaments) {
      existsOrError(tournament.name, 'Nome é um atributo obrigatório');
      await notExistsInDbOrError('tournament', { name: tournament.name }, 'Campeonato já cadastrado');

      removeTableControlFields(tournament);
    }

    return app.db('tournament').insert(newTournaments, ['id', 'name']);
  };

  const update = async (tournamentId, updatedTournament) => {
    await notExistsInDbOrError('tournament', { name: updatedTournament.name }, 'Campeonato já cadastrado');

    removeTableControlFields(updatedTournament);
    const newTournament = { ...updatedTournament, updated_at: 'now' };

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
