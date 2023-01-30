module.exports = (app) => {
  const { existsOrError, existsInDbOrError, notExistsInDbOrError } = app.errors.validator;

  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter);
  };

  const create = async (newTournaments) => {
    for (const tournament of newTournaments) {
      existsOrError(tournament.name, 'Nome é um atributo obrigatório');
      await notExistsInDbOrError('tournament', tournament, 'Já existe um campeonato com esse nome');
    }

    return app.db('tournament').insert(newTournaments, ['id', 'name']);
  };

  const update = async (tournamentId, updatedTournament) => {
    await existsInDbOrError('tournament', { id: tournamentId }, 'Campeonato não cadastrado');
    await notExistsInDbOrError('tournament', { name: updatedTournament.name }, 'Já existe um campeonato com esse nome');

    const newTournament = { ...updatedTournament, updated_at: 'now' };

    return app.db('tournament').update(newTournament).where({ id: tournamentId });
  };

  const remove = async (tournamentId) => {
    await notExistsInDbOrError('stage', { tournament_id: tournamentId }, 'O campeonato possui fases cadastradas');

    return app.db('tournament').del().where({ id: tournamentId });
  };

  return {
    read, create, update, remove,
  };
};
