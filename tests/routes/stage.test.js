const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/stage';

beforeAll(() => {
  run('02_stage');
});

test('Deve listar todas as fases de todos os campeonatos', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma fase por Id', () => {
  return request(app).get(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Primeira Fase');
      expect(res.body.tournament_id).toBe(10000);
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
      { name: 'Primeira Fase', tournament_id: 10003 },
      { name: 'Fase de Grupos', tournament_id: 10003 },
      { name: 'Playoffs de Oitavas de Final', tournament_id: 10003 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir uma fase...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Oitavas de Final', tournament_id: 10003 },
    { name: 'Quartas de Final', tournament_id: 10003 },
    { name: 'Semi Final', tournament_id: 10003 },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { tournament_id: 10003 }], 'Nome é um atributo obrigatório'));
  test('sem o atributo tournament_id', () => testTemplate([...newData, { name: 'Final' }], 'ID do campeonato é um atributo obrigatório'));
  test('de um campeonato não cadastrado', () => testTemplate([...newData, { name: 'Final', tournament_id: 10004 }], 'ID do campeonato inexistente'));
  test('cujo campeonato já possui outra fase com esse nome cadastrado', () => testTemplate([...newData, { name: 'Playoffs de Oitavas de Final', tournament_id: 10003 }], 'O campeonato já possui uma fase com esse nome'));
});

test('Deve atualizar uma fase com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/11000`)
    .send({ name: 'Fase de Grupos' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

describe('Não deve atualizar a fase...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('para um campeonato inexistente', () => testTemplate(11011, { tournament_id: 10004 }, 'ID do campeonato inexistente'));
  test('cujo campeonato já possui outra fase com esse nome cadastrado', () => testTemplate(11011, { name: 'Semi Final' }, 'O campeonato já possui uma fase com esse nome'));
});

test('Deve remover uma fase com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
