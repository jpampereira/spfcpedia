const request = require('supertest');

const app = require('../../src/app');
const execCommandInTerminal = require('../executeCommandInTerminal');

const MAIN_ROUTE = '/stage';

beforeAll(() => {
  execCommandInTerminal('.\\node_modules\\.bin\\knex seed:run --specific=02_stage.js');
});

test('Deve listar todas as fases de todos os campeonatos', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve retornar uma fase por Id', () => {
  return request(app).get(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Primeira Fase');
      expect(res.body[0].tournament_id).toBe(10000);
    });
});

test('Deve retornar todas as fases de um campeonato', () => {
  return request(app).get(`${MAIN_ROUTE}/byTournament/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
      expect(res.body[0].id).toBe(11000);
      expect(res.body[0].name).toBe('Primeira Fase');
      expect(res.body[res.body.length - 1].id).toBe(11003);
      expect(res.body[res.body.length - 1].name).toBe('Final');
    });
});

test('Deve inserir as fases de um campeonato com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Primeira Fase', tournament_id: 10002 },
      { name: 'Segunda Fase', tournament_id: 10002 },
      { name: 'Terceira Fase', tournament_id: 10002 },
      { name: 'Oitavas de Final', tournament_id: 10002 },
      { name: 'Quartas de Final', tournament_id: 10002 },
      { name: 'Semi Final', tournament_id: 10002 },
      { name: 'Final', tournament_id: 10002 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(7);
    });
});

test('Deve atualizar uma fase com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/11000`)
    .send({ name: 'Fase de Grupos' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Deve remover uma fase com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
