const request = require('supertest');

const app = require('../../src/app');
const execCommandInTerminal = require('../executeCommandInTerminal');

const MAIN_ROUTE = '/tournament';

beforeAll(() => {
  execCommandInTerminal('.\\node_modules\\.bin\\knex seed:run --specific=01_tournament.js');
});

test('Deve listar todos os campeonatos', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve retornar um campeonato pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(10000);
      expect(res.body[0].name).toBe('Paulistinha');
    });
});

test('Deve inserir um campeonato com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Copa Sul-Americana' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(1);
    });
});

test('Não deve inserir dois campeonatos com o mesmo nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Copa Sul-Americana' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe um campeonato com esse nome');
    });
});

test('Deve atualizar um campeonato com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10000`)
    .send({ name: 'Campeonato Paulista' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve atualizar um campeonato para um nome já existente', () => {
  return request(app).put(`${MAIN_ROUTE}/10001`)
    .send({ name: 'Campeonato Paulista' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe um campeonato com esse nome');
    });
});

test('Deve remover um campeonato com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve remover um campeonato que possui fases cadastradas', () => {
  return request(app).delete(`${MAIN_ROUTE}/10001`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('O campeonato possui fases cadastradas');
    });
});
