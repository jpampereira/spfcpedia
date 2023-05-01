const tableName = 'player';

module.exports = (app) => {
  const read = (filter) => {
    return app.db(tableName).select(app.db.raw(`
      id,
      name,
      nickname,
      to_char(birth, 'YYYY-MM-DD') as birth,
      country_id,
      image
    `)).where(filter).orderBy('id');
  };

  const create = (newPlayers) => {
    return app.db(tableName).insert(newPlayers, [
      'id',
      'name',
      'nickname',
      'birth',
      'country_id',
      'image',
    ]);
  };

  const update = (playerId, updatedPlayer) => {
    return app.db(tableName).update(updatedPlayer).where({ id: playerId });
  };

  const remove = (playerId) => {
    return app.db(tableName).del().where({ id: playerId });
  };

  return { read, create, update, remove };
};
