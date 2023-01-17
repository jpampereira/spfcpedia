exports.up = (knex) => {
  return knex.schema.createTable('stage', (table) => {
    table.increments('id').primary();
    table.string('name').notNull().unique();
    table.integer('tournament_id').references('id').inTable('tournament');
    table.timestamp('inserted_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('stage');
};
