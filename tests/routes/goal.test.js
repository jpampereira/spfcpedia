const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/goal';

beforeAll(() => {
  run('08_goal_card');
});

test('Deve listar todos os gols', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve listar um gol pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/23000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.lineup_id).toBe(20020);
      expect(res.body.substitution_id).toBe(null);
      expect(res.body.period_id).toBe(21001);
      expect(res.body.time).toBe(4);
    });
});

test('Deve inserir novos gols com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { lineup_id: 20041, substitution_id: null, period_id: 21000, time: 36 },
      { lineup_id: 20043, substitution_id: null, period_id: 21001, time: 12 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um gol...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { lineup_id: 20043, substitution_id: null, period_id: 21001, time: 29 },
    { lineup_id: null, substitution_id: 22019, period_id: 21001, time: 43 },
  ];

  test('sem o atributo period_id', () => testTemplate([...newData.slice(0, 1), { ...newData[1], period_id: null }], 'O atributo period_id é obrigatório'));
  test('sem o atributo time', () => testTemplate([...newData.slice(0, 1), { ...newData[1], time: null }], 'O atributo time é obrigatório'));
  test('sem lineup_id ou substitution_id estarem preenchidos', () => testTemplate([...newData.slice(0, 1), { ...newData[1], substitution_id: null }], 'Apenas um desses atributos deve ser preenchido: lineup_id, substitution_id'));
  test('com lineup_id e substitution_id preenchidos', () => testTemplate([...newData.slice(0, 1), { ...newData[1], lineup_id: 20043 }], 'Apenas um desses atributos deve ser preenchido: lineup_id, substitution_id'));
  test('cujo valor de lineup_id é inválido', () => testTemplate([...newData.slice(0, 1), { ...newData[1], lineup_id: 20044 }], 'O valor de lineup_id é inválido'));
  test('cujo valor de substitution_id é inválido', () => testTemplate([...newData.slice(0, 1), { ...newData[1], substitution_id: 22020 }], 'O valor de substitution_id é inválido'));
  test('cujo valor de period_id é inválido', () => testTemplate([...newData.slice(0, 1), { ...newData[1], period_id: 21002 }], 'O valor de period_id é inválido'));
  test('cujo valor de time é inválido', () => testTemplate([...newData.slice(0, 1), { ...newData[1], time: -1 }], 'O valor de time é inválido'));
  test('duplicado', () => testTemplate([...newData.slice(0, 1), { lineup_id: 20043, substitution_id: null, period_id: 21001, time: 12 }], 'Registro já cadastrado'));
});

describe('Deve alterar um gol com sucesso', () => {
  test('Atualizando o gol', () => {
    return request(app).put(`${MAIN_ROUTE}/23001`)
      .send({ lineup_id: null, substitution_id: 22005, period_id: 21001, time: 43 })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/23001`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.lineup_id).toBe(null);
        expect(res.body.substitution_id).toBe(22005);
        expect(res.body.period_id).toBe(21001);
        expect(res.body.time).toBe(43);
      });
  });
});

describe('Não deve alterar um adversário...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('sem lineup_id ou substitution_id estarem preenchidos', () => testTemplate(23000, { lineup_id: null }, 'Apenas um desses atributos deve ser preenchido: lineup_id, substitution_id'));
  test('com lineup_id e substitution_id preenchidos', () => testTemplate(23000, { substitution_id: 22019 }, 'Apenas um desses atributos deve ser preenchido: lineup_id, substitution_id'));
  test('cujo valor de lineup_id é inválido', () => testTemplate(23000, { lineup_id: 20044 }, 'O valor de lineup_id é inválido'));
  test('cujo valor de substitution_id é inválido', () => testTemplate(23000, { substitution_id: 22020 }, 'O valor de substitution_id é inválido'));
  test('cujo valor de period_id é inválido', () => testTemplate(23000, { period_id: 21002 }, 'O valor de period_id é inválido'));
  test('cujo valor de time é inválido', () => testTemplate(23000, { time: -1 }, 'O valor de time é inválido'));
  test('duplicado', () => testTemplate(23000, { lineup_id: 20043, substitution_id: null, period_id: 21001, time: 12 }, 'Registro já cadastrado'));
});

describe('Deve remover um gol com sucesso', () => {
  test('Removendo o gol', () => {
    return request(app).delete(`${MAIN_ROUTE}/23001`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/23001`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um gol...', () => {
  const testTemplate = (seedScript, id, errorMessage) => {
    run(seedScript);

    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate('08_goal_card', 23002, 'Registro não encontrado'));
});
