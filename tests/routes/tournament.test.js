const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/tournament';

beforeAll(() => {
  run('01_tournament');
});

test('Deve listar todos os campeonatos', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um campeonato pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Paulistinha');
    });
});

test('Deve inserir novos campeonatos com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Copa Sul-Americana' },
      { name: 'Copa Libertadores da América' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um novo campeonato...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Mundial de Clubes' },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'Nome é um atributo obrigatório'));
  test('se o mesmo já estiver cadastrado', () => testTemplate([...newData, { name: 'Campeonato Brasileiro' }], 'Campeonato já cadastrado'));
});

test('Deve atualizar um campeonato com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10000`)
    .send({ name: 'Campeonato Paulista' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve atualizar o nome campeonato para um já existente', () => {
  return request(app).put(`${MAIN_ROUTE}/10001`)
    .send({ name: 'Copa do Brasil' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Campeonato já cadastrado');
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
      expect(res.body.error).toBe('O campeonato possui fases associadas');
    });
});
