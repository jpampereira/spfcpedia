exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('stage', (table) => {
    table.increments('id').primary();
    table.string('name').notNull();
    table.integer('tournament_id').references('id').inTable('tournament').notNull();
    table.timestamp('created_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('stage');
};
