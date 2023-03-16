exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('player', (table) => {
    table.increments('id').primary();
    table.string('name').unique().notNull();
    table.string('nickname').defaultTo('');
    table.enu('position', ['G', 'D', 'M', 'F']).notNull();
    table.date('birth').notNull();
    table.integer('nationality').references('id').inTable('country').notNull();
    table.string('image').notNull();
    table.timestamp('created_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('player');
};
