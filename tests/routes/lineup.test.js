const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/lineup';

beforeAll(() => {
  run('05_match_player_lineup');
});

test('Deve listar todas as escalações', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve listar um escalado de uma partida', () => {
  return request(app).get(`${MAIN_ROUTE}/19000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.match_id).toBe(17000);
      expect(res.body.player_id).toBe(18000);
      expect(res.body.shirt_number).toBe(23);
    });
});

test('Deve listar uma escalação por partida', () => {
  return request(app).get(`${MAIN_ROUTE}/byMatch/17000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(11);
    });
});

test('Deve inserir a escalação de uma partida com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { match_id: 17001, player_id: 18000, shirt_number: 23 },
      { match_id: 17001, player_id: 18011, shirt_number: 2 },
      { match_id: 17001, player_id: 18003, shirt_number: 3 },
      { match_id: 17001, player_id: 18016, shirt_number: 28 },
      { match_id: 17001, player_id: 18004, shirt_number: 6 },
      { match_id: 17001, player_id: 18005, shirt_number: 29 },
      { match_id: 17001, player_id: 18006, shirt_number: 27 },
      { match_id: 17001, player_id: 18018, shirt_number: 21 },
      { match_id: 17001, player_id: 18008, shirt_number: 10 },
      { match_id: 17001, player_id: 18017, shirt_number: 22 },
      { match_id: 17001, player_id: 18010, shirt_number: 9 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(11);
      expect(res.body[0]).toHaveProperty('id');
    });
});

test('Deve alterar uma escalação com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/19010`)
    .send({ player_id: 18010, shirt_number: 9 })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Deve remover uma escalação de uma partida com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/byMatch/17000`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
