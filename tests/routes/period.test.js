const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/period';

beforeAll(() => {
  run('07_period_substitution');
});

test('Deve retornar todos os períodos', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um período pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/21000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe('FT');
      expect(res.body.name).toBe('First Time');
    });
});

test('Deve inserir novos períodos com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { symbol: 'FEXT', name: 'First Extra Time' },
      { symbol: 'SEXT', name: 'Second Extra Time' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um período...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { symbol: 'INT', name: 'Interval' },
    { symbol: 'PEN', name: 'Penalty' },
  ];

  test('sem o atributo symbol', () => testTemplate([...newData, { name: 'New Time' }], 'O atributo symbol é obrigatório'));
  test('sem o atributo name', () => testTemplate([...newData, { symbol: 'NT' }], 'O atributo name é obrigatório'));
  test('com símbolo duplicado', () => testTemplate([...newData, { symbol: 'FT', name: 'New Time' }], 'Já existe um registro com esse symbol'));
  test('com nome duplicado', () => testTemplate([...newData, { symbol: 'TT', name: 'Third Time' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar um período com sucesso', () => {
  test('Atualizando o período', () => {
    return request(app).put(`${MAIN_ROUTE}/21001`)
      .send({ name: 'Second Time' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/21001`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.symbol).toBe('ST');
        expect(res.body.name).toBe('Second Time');
      });
  });
});

describe('Não deve atualizar um período...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('cujo valor de symbol é inválido', () => testTemplate(21000, { symbol: '' }, 'O valor de symbol é inválido'));
  test('cujo valor de name é inválido', () => testTemplate(21000, { name: '' }, 'O valor de name é inválido'));
  test('para um símbolo já cadastrado', () => testTemplate(21000, { symbol: 'ST' }, 'Já existe um registro com esse symbol'));
  test('para um nome já cadastrado', () => testTemplate(21000, { name: 'Second Time' }, 'Já existe um registro com esse name'));
});

describe('Deve remover um período com sucesso', () => {
  test('Removendo o período', () => {
    return request(app).delete(`${MAIN_ROUTE}/21002`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/21002`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um período...', () => {
  const testTemplate = (id, errorMessage) => {
    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate(21003, 'Registro não encontrado'));
  test('com substituições associadas', () => testTemplate(21001, 'Existem dados em substitution associados a esse registro'));
});
