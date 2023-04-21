const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/position';

beforeAll(() => {
  run('06_match_position_lineup');
});

test('Deve retornar todas as posições', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma posição pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/18000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe('G');
      expect(res.body.name).toBe('Goalkepper');
    });
});

test('Deve inserir novas posições com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { symbol: 'RB', name: 'Right Back' },
      { symbol: 'LW', name: 'Left Wing' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir uma posição...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { symbol: 'RW', name: 'Right Wing' },
    { symbol: 'LM', name: 'Left Midfielder' },
    { symbol: 'RM', name: 'Right Midfielder' },
  ];

  test('sem o atributo symbol', () => testTemplate([...newData, { name: 'Center Midfielder' }], 'O atributo symbol é obrigatório'));
  test('sem o atributo name', () => testTemplate([...newData, { symbol: 'CM' }], 'O atributo name é obrigatório'));
  test('com símbolo duplicado', () => testTemplate([...newData, { symbol: 'RB', name: 'Lateral Direito' }], 'Já existe um registro com esse symbol'));
  test('com nome duplicado', () => testTemplate([...newData, { symbol: 'PE', name: 'Left Wing' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar uma posição com sucesso', () => {
  test('Atualizando a posição', () => {
    return request(app).put(`${MAIN_ROUTE}/18001`)
      .send({ symbol: 'CB', name: 'Center Back' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/18001`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.symbol).toBe('CB');
        expect(res.body.name).toBe('Center Back');
      });
  });
});

describe('Não deve atualizar uma posição...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('cujo valor de symbol é inválido', () => testTemplate(18000, { symbol: '' }, 'O valor de symbol é inválido'));
  test('cujo valor de name é inválido', () => testTemplate(18000, { name: '' }, 'O valor de name é inválido'));
  test('para um símbolo já cadastrado', () => testTemplate(18000, { symbol: 'F' }, 'Já existe um registro com esse symbol'));
  test('para um nome já cadastrado', () => testTemplate(18000, { name: 'Midfielder' }, 'Já existe um registro com esse name'));
});

describe('Deve remover uma posição com sucesso', () => {
  test('Removendo a posição', () => {
    return request(app).delete(`${MAIN_ROUTE}/18004`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/18004`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover uma posição...', () => {
  const testTemplate = (id, errorMessage) => {
    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('com escalações associadas', () => testTemplate(18000, 'Existem dados em lineup associados a esse registro'));
});
