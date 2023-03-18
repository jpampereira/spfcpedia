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

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'O atributo name é obrigatório'));
  test('duplicado', () => testTemplate([...newData, { name: 'Edina Alves Batista' }], 'Já existe uma instância com esse name'));
});

test('Deve atualizar um árbitro com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10001`)
    .send({ name: 'Danilo Ricardo Simon Manis' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

describe('Não deve atualizar um árbitro...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('cujo valor de name é inválido', () => testTemplate(10007, { name: '' }, 'O valor de name é inválido'));
  test('para um já existente', () => testTemplate(10007, { name: 'Flavio Rodrigues de Souza' }, 'Já existe uma instância com esse name'));
});

test('Deve remover um árbitro com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/10005`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

describe('Não deve remover um árbitro...', () => {
  beforeAll(() => {
    run('06_match_player_lineup');
  });

  test('que possui partidas associadas', () => {
    return request(app).delete(`${MAIN_ROUTE}/14000`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('O árbitro possui partidas associadas');
      });
  });
});
