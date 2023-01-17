exports.up = (knex) => {
  return knex.schema.createTable('city', (table) => {
    table.increments('id').primary();
    table.string('name').notNull().unique();
    table.integer('country_id').references('id').inTable('country');
    table.timestamp('inserted_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('city');
};
