const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/city';

beforeAll(() => {
  run('06_city');
});

test('Deve retornar todas as cidades', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma cidade pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(11000);
      expect(res.body.name).toBe('São Paulo');
      expect(res.body.country_id).toBe(10000);
    });
});

test('Deve inserir cidades com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Belo Horizonte', country_id: 10000 },
      { name: 'Rosário', country_id: 10001 },
      { name: 'La Paz', country_id: 10003 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir uma cidade...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Porto Alegre', country_id: 10000 },
    { name: 'Cusco', country_id: 10004 },
    { name: 'Cali', country_id: 10005 },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { country_id: 10003 }], 'O atributo name é obrigatório'));
  test('sem o atributo country_id', () => testTemplate([...newData, { name: 'Potosí' }], 'O atributo country_id é obrigatório'));
  test('com o valor de country_id inválido', () => testTemplate([...newData, { name: 'Potosí', country_id: 10006 }], 'O valor de country_id é inválido'));
  test('duplicada', () => testTemplate([...newData, { name: 'São Paulo', country_id: 10000 }], 'Registro já cadastrado'));
});

describe('Deve atualizar uma cidade com sucesso', () => {
  test('Atualizando a cidade', () => {
    return request(app).put(`${MAIN_ROUTE}/11002`)
      .send({ name: 'Curitiba' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/11002`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Curitiba');
      });
  });
});

describe('Não deve atualizar uma cidade...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('com o valor de name inválido', () => testTemplate(11000, { name: '' }, 'O valor de name é inválido'));
  test('com o valor de country_id inválido', () => testTemplate(11000, { country_id: 10006 }, 'O valor de country_id é inválido'));
  test('duplicada', () => testTemplate(11000, { name: 'Curitiba' }, 'Registro já cadastrado'));
});

describe('Deve remover uma cidade com sucesso', () => {
  test('Removendo a cidade', () => {
    return request(app).delete(`${MAIN_ROUTE}/11008`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/11008`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover uma cidade...', () => {
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

  test('não cadastrada', () => testTemplate(11009, 'Registro não encontrado'));
  test('com estádios associados', () => testTemplate(11000, 'Existem dados em stadium associados a esse registro', '07_stadium'));
});
