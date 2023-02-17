exports.seed = (knex) => {
  return knex('match').del()
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
    ]))
    .then(() => knex('stage').insert([
      { id: 11000, name: 'Fase Única', tournament_id: 10001 },
    ]));
};
