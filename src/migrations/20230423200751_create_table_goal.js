exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('goal', (table) => {
    table.increments('id').primary();
    table.integer('lineup_id').references('id').inTable('lineup');
    table.integer('substitution_id').references('id').inTable('substitution');
    table.integer('period_id').references('id').inTable('period').notNull();
    table.integer('time').unsigned().notNull();
    table.timestamp('created_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('goal');
};
