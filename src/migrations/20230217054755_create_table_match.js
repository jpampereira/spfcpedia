exports.up = (knex) => {
  const CURRENT_TIMESTAMP = knex.fn.now();

  return knex.schema.createTable('match', (table) => {
    table.increments('id').primary();
    table.integer('tournament_stage').references('id').inTable('stage').notNull();
    table.timestamp('datetime').notNull();
    table.integer('local').references('id').inTable('stadium').notNull();
    table.integer('referee').references('id').inTable('referee').notNull();
    table.integer('assistant_referee_1').references('id').inTable('referee').notNull();
    table.integer('assistant_referee_2').references('id').inTable('referee').notNull();
    table.integer('fourth_official').references('id').inTable('referee').notNull();
    table.integer('opponent').references('id').inTable('opponent').notNull();
    table.integer('opponent_goals').notNull();
    table.string('highlights').notNull();
    table.timestamp('inserted_at').defaultTo(CURRENT_TIMESTAMP);
    table.timestamp('updated_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('match');
};
