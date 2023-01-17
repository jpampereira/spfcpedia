const { db } = require('./.env');

module.exports = {
  client: 'pg',
  version: '14.1',
  connection: db,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: 'src/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: 'src/seeds',
  },
};
