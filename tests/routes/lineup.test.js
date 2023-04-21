const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/lineup';

beforeAll(() => {
  run('06_match_position_lineup');
});

test('Deve listar todas as escalações', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve listar um escalado de uma partida', () => {
  return request(app).get(`${MAIN_ROUTE}/20000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.match_id).toBe(17000);
      expect(res.body.player_id).toBe(19000);
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
      { match_id: 17001, player_id: 19000, position: 18000, shirt_number: 23 },
      { match_id: 17001, player_id: 19011, position: 18001, shirt_number: 2 },
      { match_id: 17001, player_id: 19003, position: 18001, shirt_number: 3 },
      { match_id: 17001, player_id: 19016, position: 18001, shirt_number: 28 },
      { match_id: 17001, player_id: 19004, position: 18001, shirt_number: 6 },
      { match_id: 17001, player_id: 19005, position: 18002, shirt_number: 29 },
      { match_id: 17001, player_id: 19006, position: 18003, shirt_number: 27 },
      { match_id: 17001, player_id: 19018, position: 18002, shirt_number: 21 },
      { match_id: 17001, player_id: 19008, position: 18002, shirt_number: 10 },
      { match_id: 17001, player_id: 19017, position: 18003, shirt_number: 22 },
      { match_id: 17001, player_id: 19010, position: 18003, shirt_number: 9 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(11);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir uma escalação...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { match_id: 17002, player_id: 19000, position: 18000, shirt_number: 23 },
    { match_id: 17002, player_id: 19001, position: 18001, shirt_number: 13 },
    { match_id: 17002, player_id: 19002, position: 18001, shirt_number: 5 },
    { match_id: 17002, player_id: 19003, position: 18001, shirt_number: 3 },
    { match_id: 17002, player_id: 19004, position: 18001, shirt_number: 6 },
    { match_id: 17002, player_id: 19018, position: 18002, shirt_number: 21 },
    { match_id: 17002, player_id: 19006, position: 18003, shirt_number: 27 },
    { match_id: 17002, player_id: 19008, position: 18002, shirt_number: 10 },
    { match_id: 17002, player_id: 19007, position: 18002, shirt_number: 11 },
    { match_id: 17002, player_id: 19017, position: 18003, shirt_number: 22 },
  ];

  test('sem o atributo match_id', () => testTemplate([...newData, { player_id: 19010, position: 18003, shirt_number: 9 }], 'O atributo match_id é obrigatório'));
  test('sem o atributo player_id', () => testTemplate([...newData, { match_id: 17002, position: 18003, shirt_number: 9 }], 'O atributo player_id é obrigatório'));
  test('sem o atributo position', () => testTemplate([...newData, { match_id: 17002, player_id: 19010, shirt_number: 9 }], 'O atributo position é obrigatório'));
  test('sem o atributo shirt_number', () => testTemplate([...newData, { player_id: 19010, position: 18003, match_id: 17002 }], 'O atributo shirt_number é obrigatório'));
  test('cujo valor de match_id é inválido', () => testTemplate([...newData, { match_id: 17003, player_id: 19010, position: 18003, shirt_number: 9 }], 'O valor de match_id é inválido'));
  test('cujo valor de player_id é inválido', () => testTemplate([...newData, { match_id: 17002, player_id: 19022, position: 18003, shirt_number: 9 }], 'O valor de player_id é inválido'));
  test('cujo valor de position é inválido', () => testTemplate([...newData, { match_id: 17002, player_id: 19010, position: 18005, shirt_number: 9 }], 'O valor de position é inválido'));
  test('cujo valor de shirt_number é inválido', () => testTemplate([...newData, { match_id: 17002, player_id: 19010, position: 18003, shirt_number: -1 }], 'O valor de shirt_number é inválido'));
});

describe('Deve alterar uma escalação com sucesso', () => {
  test('Atualizando a escalação', () => {
    return request(app).put(`${MAIN_ROUTE}/20010`)
      .send({ player_id: 19010, shirt_number: 9 })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/20010`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.player_id).toBe(19010);
        expect(res.body.shirt_number).toBe(9);
      });
  });
});

describe('Não deve alterar uma escalação...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('cujo valor de player_id é inválido', () => testTemplate(20000, { player_id: 19022 }, 'O valor de player_id é inválido'));
  test('cujo valor de position é inválido', () => testTemplate(20000, { position: 18005 }, 'O valor de position é inválido'));
  test('cujo valor de shirt_number é inválido', () => testTemplate(20000, { shirt_number: -1 }, 'O valor de shirt_number é inválido'));
});

describe('Deve remover uma escalação de uma partida com sucesso', () => {
  test('Removendo a escalação', () => {
    return request(app).delete(`${MAIN_ROUTE}/byMatch/17000`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/byMatch/17000`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
      });
  });
});
