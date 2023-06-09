const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/stage';

beforeAll(() => {
  run('02_stage');
});

test('Deve retornar todas as fases', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma fase pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/11000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Primeira Fase');
      expect(res.body.tournament_id).toBe(10000);
    });
});

test('Deve inserir as fases de um campeonato com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Primeira Fase', tournament_id: 10003 },
      { name: 'Fase de Grupos', tournament_id: 10003 },
      { name: 'Playoffs de Oitavas de Final', tournament_id: 10003 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir uma fase...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Oitavas de Final', tournament_id: 10003 },
    { name: 'Quartas de Final', tournament_id: 10003 },
    { name: 'Semi Final', tournament_id: 10003 },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { tournament_id: 10003 }], 'O atributo name é obrigatório'));
  test('sem o atributo tournament_id', () => testTemplate([...newData, { name: 'Final' }], 'O atributo tournament_id é obrigatório'));
  test('com o valor de tournament_id inválido', () => testTemplate([...newData, { name: 'Final', tournament_id: 10004 }], 'O valor de tournament_id é inválido'));
  test('duplicada', () => testTemplate([...newData, { name: 'Playoffs de Oitavas de Final', tournament_id: 10003 }], 'Registro já cadastrado'));
});

describe('Deve atualizar uma fase com sucesso', () => {
  test('Atualizando a fase', () => {
    return request(app).put(`${MAIN_ROUTE}/11000`)
      .send({ name: 'Fase de Grupos' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/11000`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Fase de Grupos');
      });
  });
});

describe('Não deve atualizar a fase...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('com o valor de name inválido', () => testTemplate(11011, { name: '' }, 'O valor de name é inválido'));
  test('com o valor de tournament_id inválido', () => testTemplate(11011, { tournament_id: 10004 }, 'O valor de tournament_id é inválido'));
  test('duplicada', () => testTemplate(11011, { name: 'Semi Final' }, 'Registro já cadastrado'));
});

describe('Deve remover uma fase com sucesso', () => {
  test('Removendo a fase', () => {
    return request(app).delete(`${MAIN_ROUTE}/11000`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/11000`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover uma fase...', () => {
  const testTemplate = (id, errorMessage, seedScript) => {
    if (seedScript !== undefined) {
      run(seedScript);
    }

    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate(11012, 'Registro não encontrado'));
  test('com partidas associadas', () => testTemplate(16000, 'Existem dados em match associados a esse registro', '08_match'));
});
