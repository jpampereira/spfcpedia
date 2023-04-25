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
    .then(() => knex('tournament').insert([
      { id: 10000, name: 'Paulistinha' },
      { id: 10001, name: 'Campeonato Brasileiro' },
      { id: 10002, name: 'Copa do Brasil' },
      { id: 10003, name: 'Copa Sul-Americana' },
    ]));
};
