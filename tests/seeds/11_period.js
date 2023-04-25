exports.seed = (knex) => {
  return knex('card').del()
    .then(() => knex('goal').del())
    .then(() => knex('substitution').del())
    .then(() => knex('period').del())
    .then(() => knex('lineup').del())
    .then(() => knex('position').del())
    .then(() => knex('player').del())
    .then(() => knex('match').del())
    .then(() => knex('stage').del())
    .then(() => knex('tournament').del())
    .then(() => knex('referee').del())
    .then(() => knex('opponent').del())
    .then(() => knex('stadium').del())
    .then(() => knex('city').del())
    .then(() => knex('country').del())
    .then(() => knex('period').insert([
      { id: 10000, symbol: 'FT', name: 'First Time' },
      { id: 10001, symbol: 'ST', name: 'Second Time' },
      { id: 10002, symbol: 'FEXT', name: 'Third Time' },
      { id: 10003, symbol: 'SEXT', name: 'Second Extra Time' },
    ]));
};
