const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/substitution';

beforeAll(() => {
  run('13_substitution');
});

test('Deve retornar todas as substituições', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma substituição pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/22000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.match_id).toBe(17000);
      expect(res.body.player_id).toBe(19011);
      expect(res.body.position_id).toBe(18001);
      expect(res.body.shirt_number).toBe(2);
      expect(res.body.lineup_id).toBe(20001);
      expect(res.body.period_id).toBe(21001);
      expect(res.body.time).toBe(15);
    });
});

test('Deve retornar as substituições de uma partida', () => {
  return request(app).get(`${MAIN_ROUTE}/byMatch/17000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(5);
    });
});

test('Deve inserir as substituições de uma partida com sucesso', () => {
  return request(app).post(`${MAIN_ROUTE}/byMatch`)
    .send([
      { match_id: 17002, player_id: 19020, position_id: 18001, shirt_number: 17, lineup_id: 20023, period_id: 21001, time: 21 },
      { match_id: 17002, player_id: 19021, position_id: 18001, shirt_number: 35, lineup_id: 20025, period_id: 21001, time: 37 },
      { match_id: 17002, player_id: 19019, position_id: 18002, shirt_number: 8, lineup_id: 20027, period_id: 21001, time: 45 },
      { match_id: 17002, player_id: 19009, position_id: 18003, shirt_number: 12, lineup_id: 20028, period_id: 21001, time: 37 },
      { match_id: 17002, player_id: 19015, position_id: 18003, shirt_number: 32, lineup_id: 20031, period_id: 21001, time: 45 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(5);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir as substituições...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(`${MAIN_ROUTE}/byMatch`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { match_id: 17003, player_id: 19013, position_id: 18001, shirt_number: 19, lineup_id: 20037, period_id: 21001, time: 34 },
    { match_id: 17003, player_id: 19015, position_id: 18003, shirt_number: 32, lineup_id: 20039, period_id: 21001, time: 34 },
    { match_id: 17003, player_id: 19014, position_id: 18003, shirt_number: 31, lineup_id: 20041, period_id: 21001, time: 34 },
    { match_id: 17003, player_id: 19019, position_id: 18002, shirt_number: 8, lineup_id: 20040, period_id: 21001, time: 23 },
    { match_id: 17003, player_id: 19009, position_id: 18003, shirt_number: 12, lineup_id: 20042, period_id: 21001, time: 23 },
  ];

  test('sem o atributo match_id', () => testTemplate([...newData.slice(0, 4), { ...newData[4], match_id: null }], 'O atributo match_id é obrigatório'));
  test('sem o atributo player_id', () => testTemplate([...newData.slice(0, 4), { ...newData[4], player_id: null }], 'O atributo player_id é obrigatório'));
  test('sem o atributo position_id', () => testTemplate([...newData.slice(0, 4), { ...newData[4], position_id: null }], 'O atributo position_id é obrigatório'));
  test('sem o atributo shirt_number', () => testTemplate([...newData.slice(0, 4), { ...newData[4], shirt_number: null }], 'O atributo shirt_number é obrigatório'));
  test('sem o atributo lineup_id', () => testTemplate([...newData.slice(0, 4), { ...newData[4], lineup_id: null }], 'O atributo lineup_id é obrigatório'));
  test('sem o atributo period_id', () => testTemplate([...newData.slice(0, 4), { ...newData[4], period_id: null }], 'O atributo period_id é obrigatório'));
  test('sem o atributo time', () => testTemplate([...newData.slice(0, 4), { ...newData[4], time: null }], 'O atributo time é obrigatório'));
  test('com o valor de match_id inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], match_id: 17004 }], 'O valor de match_id é inválido'));
  test('com o valor de player_id inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], player_id: 19022 }], 'O valor de player_id é inválido'));
  test('com o valor de position_id inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], position_id: 18005 }], 'O valor de position_id é inválido'));
  test('com o valor de shirt_number inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], shirt_number: -1 }], 'O valor de shirt_number é inválido'));
  test('com o valor de lineup_id inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], lineup_id: 20044 }], 'O valor de lineup_id é inválido'));
  test('com o valor de period_id inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], period_id: 21003 }], 'O valor de period_id é inválido'));
  test('com o valor de time inválido', () => testTemplate([...newData.slice(0, 4), { ...newData[4], time: -1 }], 'O valor de time é inválido'));
  test('com mais de 5 jogadores', () => testTemplate([...newData, { match_id: 17003, player_id: 19012, position_id: 18002, shirt_number: 37, lineup_id: 20033, period_id: 21001, time: 28 }], 'O número de itens em substitution é inválido'));
  test('com jogadores duplicados', () => testTemplate([...newData.slice(0, 4), { ...newData[4], player_id: 19013 }], 'Todos os player_id de um mesmo substitution devem possuir valores diferentes'));
  test('com substitutos duplicados', () => testTemplate([...newData.slice(0, 4), { ...newData[4], lineup_id: 20037 }], 'Todos os lineup_id de um mesmo substitution devem possuir valores diferentes'));
  test('com números de camisa duplicados', () => testTemplate([...newData.slice(0, 4), { ...newData[4], shirt_number: 8 }], 'Todos os shirt_number de um mesmo substitution devem possuir valores diferentes'));
  test('para mais de uma partida', () => testTemplate([...newData.slice(0, 4), { ...newData[4], match_id: 17002 }], 'Todos os match_id de um mesmo substitution devem possuir o mesmo valor'));

  test('de uma partida já cadastrada', () => testTemplate([
    { match_id: 17000, player_id: 19011, position_id: 18001, shirt_number: 2, lineup_id: 20001, period_id: 21001, time: 15 },
    { match_id: 17000, player_id: 19013, position_id: 18001, shirt_number: 19, lineup_id: 20004, period_id: 21001, time: 44 },
    { match_id: 17000, player_id: 19012, position_id: 18002, shirt_number: 14, lineup_id: 20007, period_id: 21001, time: 35 },
    { match_id: 17000, player_id: 19015, position_id: 18002, shirt_number: 32, lineup_id: 20008, period_id: 21001, time: 35 },
    { match_id: 17000, player_id: 19014, position_id: 18003, shirt_number: 31, lineup_id: 20009, period_id: 21001, time: 15 },
  ], 'Registro já cadastrado'));
});

describe('Deve alterar uma substituição com sucesso', () => {
  test('Atualizando a substituição', () => {
    return request(app).put(`${MAIN_ROUTE}/22009`)
      .send({ lineup_id: 20020, period_id: 21001, time: 23 })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/22009`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.lineup_id).toBe(20020);
        expect(res.body.period_id).toBe(21001);
        expect(res.body.time).toBe(23);
      });
  });
});

describe('Não deve alterar uma substituição...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('com o valor de player_id inválido', () => testTemplate(22000, { player_id: 19022 }, 'O valor de player_id é inválido'));
  test('com o valor de position_id inválido', () => testTemplate(22000, { position_id: 18005 }, 'O valor de position_id é inválido'));
  test('com o valor de shirt_number inválido', () => testTemplate(22000, { shirt_number: -1 }, 'O valor de shirt_number é inválido'));
  test('com o valor de lineup_id inválido', () => testTemplate(22000, { lineup_id: 20044 }, 'O valor de lineup_id é inválido'));
  test('com o valor de period_id inválido', () => testTemplate(22000, { period_id: 21003 }, 'O valor de period_id é inválido'));
  test('com o valor de time inválido', () => testTemplate(22000, { time: -1 }, 'O valor de time é inválido'));
});

describe('Deve remover as substituições de uma partida com sucesso', () => {
  test('Removendo as substituições', () => {
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
  const testTemplate = (id, errorMessage, seedScript) => {
    if (seedScript !== undefined) {
      run(seedScript);
    }

    return request(app).delete(`${MAIN_ROUTE}/byMatch/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrada', () => testTemplate(17004, 'Registro não encontrado'));
  test('com gols associados', () => testTemplate(17002, 'Existem dados em goal associados a esse registro', '14_goal'));
});
