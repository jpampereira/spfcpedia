const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('tournament').select().where(filter);
  };

  const create = async (tournament) => {
    if (!tournament.name) throw new ValidationError('Nome é um atributo obrigatório');

    const tournamentInDb = await read({ name: tournament.name });
    if (tournamentInDb.length > 0) throw new ValidationError('Já existe um campeonato com esse nome');

    const newTournament = { name: tournament.name };

    return app.db('tournament').insert(newTournament);
  };

  const update = (id, tournament = {}) => {
    const updatedTournament = { ...tournament, updated_at: 'now' };
    return app.db('tournament').update(updatedTournament).where({ id });
  };

  const remove = (id) => {
    return app.db('tournament').del().where({ id });
  };

  return {
    read, create, update, remove,
  };
};
