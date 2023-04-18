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
    .then(() => knex('referee').insert([
      { id: 10000, name: 'Vinícius Gonçalves Dias Araújo' },
      { id: 10001, name: 'Danilu Rikardu Simone Manos' },
      { id: 10002, name: 'Robson Ferreira Oliveira' },
      { id: 10003, name: 'Ilbert Estevam da Silva' },
      { id: 10004, name: 'Flavio Rodrigues de Souza' },
      { id: 10005, name: 'Marcelo Carvalho Van Gasse' },
      { id: 10006, name: 'Diego Morelli de Oliveira' },
      { id: 10007, name: 'Paulo Cesar Francisco' },
    ]));
};
