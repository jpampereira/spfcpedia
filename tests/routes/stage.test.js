const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/stage';

beforeAll(() => {
  run('01_tournament_stage');
});

test('Deve listar todas as fases', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma fase por Id', () => {
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
  test('cujo valor de tournament_id é inválido', () => testTemplate([...newData, { name: 'Final', tournament_id: 10004 }], 'O valor de tournament_id é inválido'));
  test('cujo campeonato já possui outra fase com o mesmo nome', () => testTemplate([...newData, { name: 'Playoffs de Oitavas de Final', tournament_id: 10003 }], 'Registro já cadastrado'));
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

  test('cujo valor de name é inválido', () => testTemplate(11011, { name: '' }, 'O valor de name é inválido'));
  test('cujo valor de tournament_id é inválido', () => testTemplate(11011, { tournament_id: 10004 }, 'O valor de tournament_id é inválido'));
  test('cujo campeonato já possui outra fase com o mesmo nome', () => testTemplate(11011, { name: 'Semi Final' }, 'Registro já cadastrado'));
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
  beforeAll(() => {
    run('06_match_lineup');
  });

  const testTemplate = (id, errorMessage) => {
    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('que possui partidas associadas', () => testTemplate(16000, 'A fase possui partidas associadas'));
});
