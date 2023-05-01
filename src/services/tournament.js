const tableName = 'tournament';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
    ]).where(filter).orderBy('id');
  };

  const create = (newTournaments) => {
    return app.db(tableName).insert(newTournaments, [
      'id',
      'name',
    ]);
  };

  const update = (tournamentId, updatedTournament) => {
    return app.db(tableName).update(updatedTournament).where({ id: tournamentId });
  };

  const remove = (tournamentId) => {
    return app.db(tableName).del().where({ id: tournamentId });
  };

  return { read, create, update, remove };
};
