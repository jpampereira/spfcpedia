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
    .then(() => knex('country').insert([
      { id: 10000, name: 'Brasil' },
      { id: 10001, name: 'Argentina' },
      { id: 10002, name: 'Chile' },
      { id: 10003, name: 'Bolívia' },
      { id: 10004, name: 'Peru' },
      { id: 10005, name: 'Colômbia' },
    ]))
    .then(() => knex('city').insert([
      { id: 11000, name: 'São Paulo', country_id: 10000 },
      { id: 11001, name: 'Rio de Janeiro', country_id: 10000 },
      { id: 11002, name: 'Coritiba', country_id: 10000 },
      { id: 11003, name: 'Córdoba', country_id: 10001 },
      { id: 11004, name: 'Buenos Aires', country_id: 10001 },
      { id: 11005, name: 'Santiago', country_id: 10002 },
      { id: 11006, name: 'Lima', country_id: 10004 },
      { id: 11007, name: 'Bogotá', country_id: 10005 },
      { id: 11008, name: 'Medelín', country_id: 10005 },
    ]));
};
