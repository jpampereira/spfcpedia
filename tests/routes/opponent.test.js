const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/opponent';

beforeAll(() => {
  run('04_opponent');
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
  test('duplicado', () => testTemplate([...newData, { name: 'Ituano Futebol Clube' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar um adversário com sucesso...', () => {
  test('Atualizando o adversário', () => {
    return request(app).put(`${MAIN_ROUTE}/10002`)
      .send({ name: 'Sociedade Esportiva Palmeiras' })
      .then(async (res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10002`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Sociedade Esportiva Palmeiras');
      });
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

  test('com o valor de name inválido', () => testTemplate(10002, { name: '' }, 'O valor de name é inválido'));
  test('duplicado', () => testTemplate(10002, { name: 'Sport Club Corinthians Paulista' }, 'Já existe um registro com esse name'));
});

describe('Deve remover um adversário com sucesso...', () => {
  test('Removendo o adversário', () => {
    return request(app).delete(`${MAIN_ROUTE}/10004`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10004`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um adversário...', () => {
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

  test('não cadastrado', () => testTemplate(10005, 'Registro não encontrado'));
  test('com partidas associadas', () => testTemplate(13000, 'Existem dados em match associados a esse registro', '08_match'));
});
