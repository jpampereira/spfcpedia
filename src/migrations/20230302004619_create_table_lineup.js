exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('lineup', (table) => {
    table.increments('id').primary();
    table.integer('match_id').references('id').inTable('match').notNull();
    table.integer('player_id').references('id').inTable('player').notNull();
    table.integer('shirt_number').unsigned().notNull();
    table.timestamp('created_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('lineup');
};
