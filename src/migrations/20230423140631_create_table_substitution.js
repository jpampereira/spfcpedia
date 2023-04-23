exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('substitution', (table) => {
    table.increments('id').primary();
    table.integer('match_id').references('id').inTable('match').notNull();
    table.integer('player_id').references('id').inTable('player').notNull();
    table.integer('position_id').references('id').inTable('position').notNull();
    table.integer('shirt_number').unsigned().notNull();
    table.integer('lineup_id').references('id').inTable('lineup').notNull();
    table.integer('period_id').references('id').inTable('period').notNull();
    table.integer('time').unsigned().notNull();
    table.timestamp('created_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('substitution');
};
