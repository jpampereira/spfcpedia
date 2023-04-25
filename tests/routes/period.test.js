const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/period';

beforeAll(() => {
  run('11_period');
});

test('Deve listar todos os períodos', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um período pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe('FT');
      expect(res.body.name).toBe('First Time');
    });
});

test('Deve inserir novos períodos com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { symbol: 'PEN', name: 'Penalty' },
      { symbol: 'INT', name: 'Interval' },
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
    { symbol: 'P1', name: 'Period 1' },
    { symbol: 'P2', name: 'Period 2' },
  ];

  test('sem o atributo symbol', () => testTemplate([...newData, { name: 'New Time' }], 'O atributo symbol é obrigatório'));
  test('sem o atributo name', () => testTemplate([...newData, { symbol: 'NT' }], 'O atributo name é obrigatório'));
  test('com símbolo duplicado', () => testTemplate([...newData, { symbol: 'FT', name: 'New Time' }], 'Já existe um registro com esse symbol'));
  test('com nome duplicado', () => testTemplate([...newData, { symbol: 'NT', name: 'Third Time' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar um período com sucesso', () => {
  test('Atualizando o período', () => {
    return request(app).put(`${MAIN_ROUTE}/10002`)
      .send({ name: 'First Extra Time' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10002`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.symbol).toBe('FEXT');
        expect(res.body.name).toBe('First Extra Time');
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

  test('com o valor de symbol é inválido', () => testTemplate(10000, { symbol: '' }, 'O valor de symbol é inválido'));
  test('com o valor de name é inválido', () => testTemplate(10000, { name: '' }, 'O valor de name é inválido'));
  test('com símbolo duplicado', () => testTemplate(10000, { symbol: 'ST' }, 'Já existe um registro com esse symbol'));
  test('com nome duplicado', () => testTemplate(10000, { name: 'Second Time' }, 'Já existe um registro com esse name'));
});

describe('Deve remover um período com sucesso', () => {
  test('Removendo o período', () => {
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

describe('Não deve remover um período...', () => {
  const testTemplate = (id, errorMessage, seedScript) => {
    if (seedScript !== undefined) {
      run(seedScript);
    }

    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate(10004, 'Registro não encontrado'));
  test('com substituições associadas', () => testTemplate(21001, 'Existem dados em substitution associados a esse registro', '13_substitution'));
  test('com gols associados', () => testTemplate(21000, 'Existem dados em goal associados a esse registro', '14_goal'));
});
