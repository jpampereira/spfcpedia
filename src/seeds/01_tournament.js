exports.seed = (knex) => {
  return knex('stage').del()
    .then(() => knex('tournament').del())
    .then(() => knex('referee').del())
    .then(() => knex('opponent').del())
    .then(() => knex('stadium').del())
    .then(() => knex('city').del())
    .then(() => knex('country').del())
    .then(() => knex('tournament').insert([
      { id: 10000, name: 'Paulistinha' },
    ]));
};
