const tableName = 'match';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select(app.db.raw(`
      id,
      stage_id, 
      to_char(datetime, 'YYYY-MM-DD HH24:MI') as datetime,
      stadium_id,
      referee,
      assistant_referee_1,
      assistant_referee_2,
      fourth_official,
      opponent_id,
      opponent_goals,
      highlights
    `)).where(filter).orderBy('id');
  };

  const create = (newMatches) => {
    return app.db(tableName).insert(newMatches, [
      'id',
      'stage_id',
      'datetime',
      'stadium_id',
      'referee',
      'assistant_referee_1',
      'assistant_referee_2',
      'fourth_official',
      'opponent_id',
      'opponent_goals',
      'highlights',
    ]);
  };

  const update = (matchId, updatedMatch) => {
    return app.db(tableName).update(updatedMatch).where({ id: matchId });
  };

  const remove = (matchId) => {
    return app.db(tableName).del().where({ id: matchId });
  };

  return { read, create, update, remove };
};
