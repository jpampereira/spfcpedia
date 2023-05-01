const tableName = 'goal';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'lineup_id',
      'substitution_id',
      'period_id',
      'time',
    ]).where(filter).orderBy('id');
  };

  const create = (newGoals) => {
    return app.db(tableName).insert(newGoals, [
      'id',
      'lineup_id',
      'substitution_id',
      'period_id',
      'time',
    ]);
  };

  const update = (goalId, updatedGoal) => {
    return app.db(tableName).update(updatedGoal).where({ id: goalId });
  };

  const remove = (goalId) => {
    return app.db(tableName).del().where({ id: goalId });
  };

  return { read, create, update, remove };
};
