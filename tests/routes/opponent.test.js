const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/opponent';

beforeAll(() => {
  run('03_opponent');
});

test('Deve retornar todos os adversários', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um adversário pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Ituano Futebol Clube');
    });
});

test('Deve inserir novos adversários com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Esporte Clube Santo André' },
      { name: 'Red Bull Bragantino' },
      { name: 'Santos Futebol Clube' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um novo adversário...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Inter de Limeira' },
    { name: 'São Bento' },
    { name: 'São Bernardo' },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'O atributo name é obrigatório'));
  test('duplicado', () => testTemplate([...newData, { name: 'Ituano Futebol Clube' }], 'Adversário já cadastrado'));
});

test('Deve atualizar um adversário com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/10002`)
    .send({ name: 'Sociedade Esportiva Palmeiras' })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

describe('Não deve atualizar um adversário...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('para um já existente', () => testTemplate(10002, { name: 'Sport Club Corinthians Paulista' }, 'Adversário já cadastrado'));
  test('cujo valor de name é inválido', () => testTemplate(10002, { name: '' }, 'O valor de name é inválido'));
});

test('Deve remover um adversário com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/10004`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

describe('Não deve remover um adversário...', () => {
  beforeAll(() => {
    run('06_match_player_lineup');
  });

  test('que possui partidas associadas', () => {
    return request(app).delete(`${MAIN_ROUTE}/13000`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('O adversário possui partidas associadas');
      });
  });
});
