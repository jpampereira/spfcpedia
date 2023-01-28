module.exports = (app) => {
  const read = (filter = {}) => {
    return app.db('stage').select().where(filter);
  };

  const readByTournament = (tournamentId) => {
    return app.db('stage').select('stage.id', 'stage.name')
      .leftJoin('tournament', 'tournament.id', 'stage.tournament_id')
      .where({ 'tournament.id': tournamentId });
  };

  const create = (newStages) => {
    return app.db('stage').insert(newStages, ['id', 'name', 'tournament_id', 'inserted_at']);
  };

  const update = async (stageId, stageUpdated) => {
    return app.db('stage').update(stageUpdated).where({ id: stageId });
  };

  const remove = (stageId) => {
    return app.db('stage').del().where({ id: stageId });
  };

  return {
    read, readByTournament, create, update, remove,
  };
};
