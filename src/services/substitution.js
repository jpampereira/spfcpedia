const tableName = 'substitution';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select([
      'id',
      'match_id',
      'player_id',
      'position_id',
      'shirt_number',
      'lineup_id',
      'period_id',
      'time',
    ]).where(filter).orderBy('id');
  };

  const create = (newSubstitutions) => {
    return app.db(tableName).insert(newSubstitutions, [
      'id',
      'match_id',
      'player_id',
      'position_id',
      'shirt_number',
      'lineup_id',
      'period_id',
      'time',
    ]);
  };

  const update = (substitutionPlayerId, updatedSubstitutionPlayer) => {
    return app.db(tableName).update(updatedSubstitutionPlayer).where({ id: substitutionPlayerId });
  };

  const remove = (matchId) => {
    return app.db(tableName).del().where({ match_id: matchId });
  };

  return { read, create, update, remove };
};
