exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('stadium', (table) => {
    table.increments('id').primary();
    table.string('name').notNull().unique();
    table.integer('city_id').references('id').inTable('city').notNull();
    table.timestamp('inserted_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('stadium');
};
