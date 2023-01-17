exports.up = (knex) => {
  return knex.schema.createTable('referee', (table) => {
    table.increments('id').primary();
    table.string('name').notNull().unique();
    table.timestamp('inserted_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('referee');
};
