exports.up = (knex) => {
  return knex.schema.createTable('stadium', (table) => {
    table.increments('id').primary();
    table.string('name').notNull().unique();
    table.integer('city_id').references('id').inTable('city');
    table.timestamp('inserted_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('stadium');
};
