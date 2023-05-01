const tableName = 'lineup';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'match_id',
      'player_id',
      'position_id',
      'shirt_number',
    ]).where(filter).orderBy('id');
  };

  const create = (newLineup) => {
    return app.db(tableName).insert(newLineup, [
      'id',
      'match_id',
      'player_id',
      'position_id',
      'shirt_number',
    ]);
  };

  const update = (lineupPlayerId, updatedLineupPlayer) => {
    return app.db(tableName).update(updatedLineupPlayer).where({ id: lineupPlayerId });
  };

  const remove = (matchId) => {
    return app.db(tableName).del().where({ match_id: matchId });
  };

  return { read, create, update, remove };
};
