const tableName = 'stage';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'name',
      'tournament_id',
    ]).where(filter).orderBy('id');
  };

  const create = (newStages) => {
    return app.db(tableName).insert(newStages, [
      'id',
      'name',
      'tournament_id',
    ]);
  };

  const update = (stageId, updatedStage) => {
    return app.db(tableName).update(updatedStage).where({ id: stageId });
  };

  const remove = (stageId) => {
    return app.db(tableName).del().where({ id: stageId });
  };

  return { read, create, update, remove };
};
