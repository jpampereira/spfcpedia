const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/city';

beforeAll(() => {
  run('05_country_city_stadium');
});

test('Deve listar todas as cidades', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma cidade por Id', () => {
  return request(app).get(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(11000);
      expect(res.body.name).toBe('São Paulo');
      expect(res.body.country_id).toBe(10000);
    });
});

test('Deve retornar todas as cidades de um país', () => {
  return request(app).get(`${MAIN_ROUTE}/byCountry/10000`)
    .then((res) => {
      const lastPos = res.body.length - 1;

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].id).toBe(11000);
      expect(res.body[0].name).toBe('São Paulo');
      expect(res.body[lastPos].id).toBe(11002);
      expect(res.body[lastPos].name).toBe('Coritiba');
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
  test('cujo valor de country_id é inválido', () => testTemplate([...newData, { name: 'Potosí', country_id: 10006 }], 'O valor de country_id é inválido'));
  test('cujo país já possui outra cidade com o mesmo nome', () => testTemplate([...newData, { name: 'São Paulo', country_id: 10000 }], 'O país já possui uma cidade com esse nome'));
});

test('Deve atualizar uma cidade com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/11002`)
    .send({ name: 'Curitiba' })
    .then((res) => {
      expect(res.status).toBe(204);
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

  test('cujo valor de country_id é inválido', () => testTemplate(11000, { country_id: 10006 }, 'O valor de country_id é inválido'));
  test('cujo país já possui outra cidade com o mesmo nome', () => testTemplate(11000, { name: 'Curitiba' }, 'O país já possui uma cidade com esse nome'));
  test('cujo valor de name é inválido', () => testTemplate(11000, { name: '' }, 'O valor de name é inválido'));
});

test('Deve remover uma cidade com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/11008`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve remover uma cidade que possui estádios associados', () => {
  return request(app).delete(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A cidade possuí estádios associados');
    });
});
