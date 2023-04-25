const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/position';

beforeAll(() => {
  run('10_position');
});

test('Deve listar todas as posições', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma posição pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe('G');
      expect(res.body.name).toBe('Goalkepper');
    });
});

test('Deve inserir novas posições com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { symbol: 'LB', name: 'Left Back' },
      { symbol: 'RB', name: 'Right Back' },
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
    { symbol: 'LW', name: 'Left Wing' },
    { symbol: 'LM', name: 'Left Midfielder' },
    { symbol: 'RM', name: 'Right Midfielder' },
  ];

  test('sem o atributo symbol', () => testTemplate([...newData, { name: 'Right Wing' }], 'O atributo symbol é obrigatório'));
  test('sem o atributo name', () => testTemplate([...newData, { symbol: 'RW' }], 'O atributo name é obrigatório'));
  test('com símbolo duplicado', () => testTemplate([...newData, { symbol: 'RB', name: 'Right Wing' }], 'Já existe um registro com esse symbol'));
  test('com nome duplicado', () => testTemplate([...newData, { symbol: 'RW', name: 'Right Back' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar uma posição com sucesso', () => {
  test('Atualizando a posição', () => {
    return request(app).put(`${MAIN_ROUTE}/10001`)
      .send({ symbol: 'CB', name: 'Center Back' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10001`)
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

  test('com o valor de symbol inválido', () => testTemplate(10000, { symbol: '' }, 'O valor de symbol é inválido'));
  test('com o valor de name inválido', () => testTemplate(10000, { name: '' }, 'O valor de name é inválido'));
  test('com símbolo duplicado', () => testTemplate(10000, { symbol: 'F' }, 'Já existe um registro com esse symbol'));
  test('com nome duplicado', () => testTemplate(10000, { name: 'Midfielder' }, 'Já existe um registro com esse name'));
});

describe('Deve remover uma posição com sucesso', () => {
  test('Removendo a posição', () => {
    return request(app).delete(`${MAIN_ROUTE}/10003`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10003`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover uma posição...', () => {
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

  test('não cadastrada', () => testTemplate(10004, 'Registro não encontrado'));
  test('com escalações associadas', () => testTemplate(18000, 'Existem dados em lineup associados a esse registro', '12_lineup'));
  test('com substituições associadas', () => testTemplate(18004, 'Existem dados em substitution associados a esse registro', '13_substitution'));
});
