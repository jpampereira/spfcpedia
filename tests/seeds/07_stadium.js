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
      { id: 11002, name: 'Curitiba', country_id: 10000 },
      { id: 11003, name: 'Córdoba', country_id: 10001 },
      { id: 11004, name: 'Buenos Aires', country_id: 10001 },
      { id: 11005, name: 'Santiago', country_id: 10002 },
      { id: 11006, name: 'Lima', country_id: 10004 },
      { id: 11007, name: 'Bogotá', country_id: 10005 },
      { id: 11008, name: 'Medelín', country_id: 10005 },
    ]))
    .then(() => knex('stadium').insert([
      { id: 12000, name: 'Estádio Cícero Pompeu de Toledo', nickname: 'Morumbi', city_id: 11000 },
      { id: 12001, name: 'Allianz Parque', city_id: 11000 },
      { id: 12002, name: 'Arena Corinthians', city_id: 11000 },
      { id: 12003, name: 'Estádio Municipal Paulo Machado de Carvalho', nickname: 'Pacaembu', city_id: 11000 },
      { id: 12004, name: 'Estádio Jornalista Mário Filho', nickname: 'Maracanã', city_id: 11001 },
      { id: 12005, name: 'Estádio Nilton Santos', nickname: 'Engenhão', city_id: 11001 },
      { id: 12006, name: 'Estádio Joaquim Américo Guimarães', nickname: 'Arena da Baixada', city_id: 11002 },
      { id: 12007, name: 'Estádio Mario Alberto Kempes', city_id: 11003 },
      { id: 12008, name: 'Estádio Alberto José Armando', nickname: 'La Bombonera', city_id: 11004 },
      { id: 12009, name: 'Estádio Monumental Antonio Vespucio Liberti', nickname: 'Monumental de Núñez', city_id: 11004 },
    ]));
};
