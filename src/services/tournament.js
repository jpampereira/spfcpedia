const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const checkTournamentAttrs = (tournament) => {
    if (!tournament.name) throw new ValidationError('Nome é um atributo obrigatório');
  };

  const searchForTournamentInDb = async (tournament) => {
    const result = await app.db('tournament').select().where({ name: tournament.name });
    if (result.length > 0) throw new ValidationError('Já existe um campeonato com esse nome');
  };

  const searchForRelatedStagesInDb = async (tournamentId) => {
    const result = await app.db('stage').select().where({ tournament_id: tournamentId });
    if (result.length > 0) throw new ValidationError('O campeonato possui fases cadastradas');
  };

  const read = (filter = {}) => {
    return app.db('tournament').select(['id', 'name']).where(filter);
  };

  const create = async (newTournament) => {
    checkTournamentAttrs(newTournament);
    await searchForTournamentInDb(newTournament);

    return app.db('tournament').insert(newTournament, ['id', 'name']);
  };

  const update = async (tournamentId, tournamentUpdated = {}) => {
    await searchForTournamentInDb(tournamentUpdated);

    const updatedTournament = { ...tournamentUpdated, updated_at: 'now' };

    return app.db('tournament').update(updatedTournament).where({ id: tournamentId });
  };

  const remove = async (tournamentId) => {
    await searchForRelatedStagesInDb(tournamentId);
    return app.db('tournament').del().where({ id: tournamentId });
  };

  return {
    read, create, update, remove,
  };
};
