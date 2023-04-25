exports.seed = (knex) => {
  return knex('card').del()
    .then(() => knex('goal').del())
    .then(() => knex('substitution').del())
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
    .then(() => knex('position').insert([
      { id: 10000, symbol: 'G', name: 'Goalkepper' },
      { id: 10001, symbol: 'D', name: 'Defense' },
      { id: 10002, symbol: 'M', name: 'Midfielder' },
      { id: 10003, symbol: 'F', name: 'Forward' },
    ]));
};
