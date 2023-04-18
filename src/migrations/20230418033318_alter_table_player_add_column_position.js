exports.up = (knex) => {
  return knex.schema.alterTable('player', (table) => {
    table.integer('position').references('id').inTable('position').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.alterTable('player', (table) => {
    table.dropColumn('position');
  });
};
