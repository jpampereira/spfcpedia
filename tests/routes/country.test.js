const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/country';

beforeAll(() => {
  run('05_country_city');
});

test('Deve retornar todos os países', () => {
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

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'Nome é um atributo obrigatório'));
  test('se o mesmo já estiver cadastrado', () => testTemplate([...newData, { name: 'Argentina' }], 'País já cadastrado'));
});

test('Deve atualizar um país com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10000`)
    .send({ name: 'Brasil' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve alterar o nome do país para um já existente', () => {
  return request(app).put(`${MAIN_ROUTE}/10005`)
    .send({ name: 'Argentina' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('País já cadastrado');
    });
});

test('Deve remover um país com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/10003`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve remover um país que possui cidades cadastradas', () => {
  return request(app).delete(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('O país possui cidades associadas');
    });
});
