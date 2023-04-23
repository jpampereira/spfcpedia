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

test('Deve listar a escalação de uma partida', () => {
  return request(app).get(`${MAIN_ROUTE}/byMatch/17000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(11);
    });
});

test('Deve inserir a escalação de uma partida com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { match_id: 17001, player_id: 19000, position_id: 18000, shirt_number: 23 },
      { match_id: 17001, player_id: 19011, position_id: 18001, shirt_number: 2 },
      { match_id: 17001, player_id: 19003, position_id: 18001, shirt_number: 3 },
      { match_id: 17001, player_id: 19016, position_id: 18001, shirt_number: 28 },
      { match_id: 17001, player_id: 19004, position_id: 18001, shirt_number: 6 },
      { match_id: 17001, player_id: 19005, position_id: 18002, shirt_number: 29 },
      { match_id: 17001, player_id: 19006, position_id: 18003, shirt_number: 27 },
      { match_id: 17001, player_id: 19018, position_id: 18002, shirt_number: 21 },
      { match_id: 17001, player_id: 19008, position_id: 18002, shirt_number: 10 },
      { match_id: 17001, player_id: 19017, position_id: 18003, shirt_number: 22 },
      { match_id: 17001, player_id: 19010, position_id: 18003, shirt_number: 9 },
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
    { match_id: 17002, player_id: 19000, position_id: 18000, shirt_number: 23 },
    { match_id: 17002, player_id: 19001, position_id: 18001, shirt_number: 13 },
    { match_id: 17002, player_id: 19002, position_id: 18001, shirt_number: 5 },
    { match_id: 17002, player_id: 19003, position_id: 18001, shirt_number: 3 },
    { match_id: 17002, player_id: 19004, position_id: 18001, shirt_number: 6 },
    { match_id: 17002, player_id: 19018, position_id: 18002, shirt_number: 21 },
    { match_id: 17002, player_id: 19006, position_id: 18003, shirt_number: 27 },
    { match_id: 17002, player_id: 19008, position_id: 18002, shirt_number: 10 },
    { match_id: 17002, player_id: 19007, position_id: 18002, shirt_number: 11 },
    { match_id: 17002, player_id: 19017, position_id: 18003, shirt_number: 22 },
    { match_id: 17002, player_id: 19010, position_id: 18003, shirt_number: 9 },
  ];

  test('sem o atributo match_id', () => testTemplate([...newData.slice(0, 10), { ...newData[10], match_id: null }], 'O atributo match_id é obrigatório'));
  test('sem o atributo player_id', () => testTemplate([...newData.slice(0, 10), { ...newData[10], player_id: null }], 'O atributo player_id é obrigatório'));
  test('sem o atributo position_id', () => testTemplate([...newData.slice(0, 10), { ...newData[10], position_id: null }], 'O atributo position_id é obrigatório'));
  test('sem o atributo shirt_number', () => testTemplate([...newData.slice(0, 10), { ...newData[10], shirt_number: null }], 'O atributo shirt_number é obrigatório'));
  test('cujo valor de match_id é inválido', () => testTemplate([...newData.slice(0, 10), { ...newData[10], match_id: 17004 }], 'O valor de match_id é inválido'));
  test('cujo valor de player_id é inválido', () => testTemplate([...newData.slice(0, 10), { ...newData[10], player_id: 19022 }], 'O valor de player_id é inválido'));
  test('cujo valor de position_id é inválido', () => testTemplate([...newData.slice(0, 10), { ...newData[10], position_id: 18005 }], 'O valor de position_id é inválido'));
  test('cujo valor de shirt_number é inválido', () => testTemplate([...newData.slice(0, 10), { ...newData[10], shirt_number: -1 }], 'O valor de shirt_number é inválido'));
  test('com menos de 11 jogadores', () => testTemplate(newData.slice(0, 10), 'O número de itens em lineup é inválido'));
  test('com mais de 11 jogadores', () => testTemplate([...newData, { match_id: 17002, player_id: 19012, position_id: 18002, shirt_number: 14 }], 'O número de itens em lineup é inválido'));
  test('com jogadores duplicados', () => testTemplate([...newData.slice(0, 10), { ...newData[10], player_id: 19002 }], 'Todos os player_id de um mesmo lineup devem possuir valores diferentes'));
  test('com números de camisa duplicados', () => testTemplate([...newData.slice(0, 10), { ...newData[10], shirt_number: 5 }], 'Todos os shirt_number de um mesmo lineup devem possuir valores diferentes'));
  test('para mais de uma partida', () => testTemplate([...newData.slice(0, 10), { ...newData[10], match_id: 17003 }], 'Todos os match_id de um mesmo lineup devem possuir o mesmo valor'));

  test('se a partida já possuir uma cadastrada', () => testTemplate([
    { match_id: 17001, player_id: 19000, position_id: 18000, shirt_number: 23 },
    { match_id: 17001, player_id: 19011, position_id: 18001, shirt_number: 2 },
    { match_id: 17001, player_id: 19003, position_id: 18001, shirt_number: 3 },
    { match_id: 17001, player_id: 19016, position_id: 18001, shirt_number: 28 },
    { match_id: 17001, player_id: 19004, position_id: 18001, shirt_number: 6 },
    { match_id: 17001, player_id: 19005, position_id: 18002, shirt_number: 29 },
    { match_id: 17001, player_id: 19006, position_id: 18003, shirt_number: 27 },
    { match_id: 17001, player_id: 19018, position_id: 18002, shirt_number: 21 },
    { match_id: 17001, player_id: 19008, position_id: 18002, shirt_number: 10 },
    { match_id: 17001, player_id: 19017, position_id: 18003, shirt_number: 22 },
    { match_id: 17001, player_id: 19010, position_id: 18003, shirt_number: 9 },
  ], 'Registro já cadastrado'));
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
  test('cujo valor de position_id é inválido', () => testTemplate(20000, { position_id: 18005 }, 'O valor de position_id é inválido'));
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

describe('Não deve remover uma escalação...', () => {
  const testTemplate = (seedScript, id, errorMessage) => {
    run(seedScript);

    return request(app).delete(`${MAIN_ROUTE}/byMatch/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrada', () => testTemplate('06_match_position_lineup', 17004, 'Registro não encontrado'));
  test('com substituições associadas', () => testTemplate('07_period_substitution', 17000, 'Existem dados em substitution associados a esse registro'));
});
