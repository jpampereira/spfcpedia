const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/country';

beforeAll(() => {
  run('04_country_city_stadium');
});

test('Deve listar todos os países', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um país pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Brazil');
    });
});

test('Deve inserir novos países com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Venezuela' },
      { name: 'Paraguai' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um novo país...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Equador' },
    { name: 'Uruguai' },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'O atributo name é obrigatório'));
  test('duplicado', () => testTemplate([...newData, { name: 'Argentina' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar um país com sucesso', () => {
  test('Atualizando o país', () => {
    return request(app).put(`${MAIN_ROUTE}/10000`)
      .send({ name: 'Brasil' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10000`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Brasil');
      });
  });
});

describe('Não deve atualizar um país...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('cujo valor de name é inválido', () => testTemplate(10005, { name: '' }, 'O valor de name é inválido'));
  test('duplicado', () => testTemplate(10005, { name: 'Argentina' }, 'Já existe um registro com esse name'));
});

describe('Deve remover um país com sucesso', () => {
  test('Removendo o país', () => {
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

describe('Não deve remover um país...', () => {
  const testTemplate = (seedScript, id, errorMessage) => {
    run(seedScript);

    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate('04_country_city_stadium', 10006, 'Registro não encontrado'));
  test('que possui cidades associadas', () => testTemplate('04_country_city_stadium', 10000, 'Existem dados em city associados a esse registro'));
  test('que possui jogadores associados', () => testTemplate('05_player', 10001, 'Existem dados em player associados a esse registro'));
});
