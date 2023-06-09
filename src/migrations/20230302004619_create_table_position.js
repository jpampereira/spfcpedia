exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('position', (table) => {
    table.increments('id').primary();
    table.string('symbol').unique().notNull();
    table.string('name').unique().notNull();
    table.timestamp('created_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('position');
};
