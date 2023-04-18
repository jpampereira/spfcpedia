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
    .then(() => knex('opponent').insert([
      { id: 10000, name: 'Ituano Futebol Clube' },
      { id: 10001, name: 'Associação Ferroviária de Esportes' },
      { id: 10002, name: 'Palmeiras Futebol Clube' },
      { id: 10003, name: 'Associação Portuguesa de Desportos' },
      { id: 10004, name: 'Sport Club Corinthians Paulista' },
    ]));
};
