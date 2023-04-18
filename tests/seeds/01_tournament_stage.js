exports.seed = (knex) => {
  return knex('lineup').del()
    .then(() => knex('player').del())
    .then(() => knex('position').del())
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
    ]))
    .then(() => knex('stage').insert([
      { id: 11000, name: 'Primeira Fase', tournament_id: 10000 },
      { id: 11001, name: 'Quartas de Final', tournament_id: 10000 },
      { id: 11002, name: 'Semi Final', tournament_id: 10000 },
      { id: 11003, name: 'Final', tournament_id: 10000 },
      { id: 11004, name: 'Fase Única', tournament_id: 10001 },
      { id: 11005, name: 'Primeira Fase', tournament_id: 10002 },
      { id: 11006, name: 'Segunda Fase', tournament_id: 10002 },
      { id: 11007, name: 'Terceira Fase', tournament_id: 10002 },
      { id: 11008, name: 'Oitavas de Final', tournament_id: 10002 },
      { id: 11009, name: 'Quartas de Final', tournament_id: 10002 },
      { id: 11010, name: 'Semi Final', tournament_id: 10002 },
      { id: 11011, name: 'Final', tournament_id: 10002 },
    ]));
};
