const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/tournament';

beforeAll(() => {
  run('01_tournament_stage');
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
      { name: 'Copa Libertadores da América' },
      { name: 'Mundial de Clubes' },
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
    { name: 'Supercopa do Brasil' },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'O atributo name é obrigatório'));
  test('duplicado', () => testTemplate([...newData, { name: 'Campeonato Brasileiro' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar um campeonato com sucesso', () => {
  test('Atualizando o campeonato', () => {
    return request(app).put(`${MAIN_ROUTE}/10000`)
      .send({ name: 'Campeonato Paulista' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10000`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Campeonato Paulista');
      });
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

  test('cujo valor de name é inválido', () => testTemplate(10001, { name: '' }, 'O valor de name é inválido'));
  test('duplicado', () => testTemplate(10001, { name: 'Copa do Brasil' }, 'Já existe um registro com esse name'));
});

describe('Deve remover um campeonato com sucesso', () => {
  test('Removendo o campeonato', () => {
    return request(app).delete(`${MAIN_ROUTE}/10003`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10003`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um campeonato...', () => {
  const testTemplate = (id, errorMessage) => {
    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate(10004, 'Registro não encontrado'));
  test('com fases associadas', () => testTemplate(10000, 'Existem dados em stage associados a esse registro'));
});
