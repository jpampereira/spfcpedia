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
    .send([
      { name: 'Copa Sul-Americana' },
      { name: 'Copa Libertadores da América' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(2);
    });
});

describe('Não deve inserir um campeonato...', () => {
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

  test('sem o atributo name', () => testTemplate([...newData, {}], 'Nome é um atributo obrigatório'));
  test('se o mesmo já estiver cadastrado', () => testTemplate([...newData, { name: 'Campeonato Brasileiro' }], 'Já existe um campeonato com esse nome'));
});

test('Deve atualizar um campeonato com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10000`)
    .send({ name: 'Campeonato Paulista' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

describe('Não deve atualizar um campeonato...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('de ID não encontrado', () => testTemplate(10004, { name: 'Copa do Brasil' }, 'Campeonato não cadastrado'));
  test('se o mesmo já estiver cadastrado', () => testTemplate(10001, { name: 'Copa do Brasil' }, 'Já existe um campeonato com esse nome'));
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
