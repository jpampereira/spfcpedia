const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/referee';

beforeAll(() => {
  run('04_referee');
});

test('Deve retornar todos os árbitros', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um árbitro pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Vinícius Gonçalves Dias Araújo');
    });
});

test('Deve inserir novos árbitros com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Edina Alves Batista' },
      { name: 'Neuza Ines Back' },
      { name: 'Fabrini Bevilaqua Costa' },
      { name: 'Marianna Nanni Batalha' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(4);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um novo árbitro...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Salim Fende Chavez' },
    { name: 'Alex Ang Ribeiro' },
    { name: 'Rafael Tadeu Alves de Souza' },
    { name: 'Adeli Mara Monteiro' },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'Nome é um atributo obrigatório'));
  test('se o mesmo já estiver cadastrado', () => testTemplate([...newData, { name: 'Edina Alves Batista' }], 'Árbitro já cadastrado'));
});

test('Deve atualizar um árbitro com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10001`)
    .send({ name: 'Danilo Ricardo Simon Manis' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve alterar o nome do árbitro para um já existente', () => {
  return request(app).put(`${MAIN_ROUTE}/10007`)
    .send({ name: 'Flavio Rodrigues de Souza' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Árbitro já cadastrado');
    });
});

test('Deve remover um árbitro com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/10005`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
