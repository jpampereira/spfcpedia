const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/stadium';

beforeAll(() => {
  run('04_country_city_stadium');
});

test('Deve listar todos os estádios', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um estádio por Id', () => {
  return request(app).get(`${MAIN_ROUTE}/12000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(12000);
      expect(res.body.name).toBe('Estádio Cícero Pompeu de Toledo');
      expect(res.body.nickname).toBe('Morumbi');
      expect(res.body.city_id).toBe(11000);
    });
});

test('Deve inserir estádios com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Estádio San Carlos de Apoquindo', city_id: 11005 },
      { name: 'Estadio Monumental del Club Universitario de Deportes', nickname: 'Coloso de Ate', city_id: 11006 },
      { name: 'Estadio Atanasio Girardot', city_id: 11008 },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um estádio...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Estádio Major Antônio Couto Pereira', nickname: 'Couto Pereira', city_id: 11002 },
    { name: 'Estadio Diego Armando Maradona', city_id: 11004 },
    { name: 'Estádio Nacional de Chile', city_id: 11005 },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { city_id: 11002 }], 'O atributo name é obrigatório'));
  test('sem o atributo city_id', () => testTemplate([...newData, { name: 'Estádio Durival Britto e Silva', nickname: 'Vila Capanema' }], 'O atributo city_id é obrigatório'));
  test('cujo valor de city_id é inválido', () => testTemplate([...newData, { name: 'Estádio Durival Britto e Silva', nickname: 'Vila Capanema', city_id: 11011 }], 'O valor de city_id é inválido'));
  test('com nome duplicado', () => testTemplate([...newData, { name: 'Estádio Cícero Pompeu de Toledo', city_id: 11000 }], 'Já existe um registro com esse name'));
  test('com apelido duplicado', () => testTemplate([...newData, { name: 'Cícero Pompeu de Toledo', nickname: 'Morumbi', city_id: 11000 }], 'Já existe um registro com esse nickname'));
});

describe('Deve atualizar um estádio com sucesso', () => {
  test('Atualizando o estádio', () => {
    return request(app).put(`${MAIN_ROUTE}/12002`)
      .send({ name: 'Neo Química Arena' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/12002`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Neo Química Arena');
      });
  });
});

describe('Não deve atualizar um estádio...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('cujo valor de name é inválido', () => testTemplate(12002, { name: '' }, 'O valor de name é inválido'));
  test('cujo valor de city_id é inválido', () => testTemplate(12000, { city_id: 11012 }, 'O valor de city_id é inválido'));
  test('para um nome já cadastrado', () => testTemplate(12001, { name: 'Neo Química Arena' }, 'Já existe um registro com esse name'));
  test('para um apelido já cadastrado', () => testTemplate(12002, { nickname: 'Morumbi' }, 'Já existe um registro com esse nickname'));
});

describe('Deve remover um estádio com sucesso', () => {
  test('Removendo o estádio', () => {
    return request(app).delete(`${MAIN_ROUTE}/12007`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/12007`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um estádio...', () => {
  const testTemplate = (seedScript, id, errorMessage) => {
    run(seedScript);

    return request(app).delete(`${MAIN_ROUTE}/${id}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('não cadastrado', () => testTemplate('04_country_city_stadium', 12010, 'Registro não encontrado'));
  test('com partidas associadas', () => testTemplate('06_match_position_lineup', 12000, 'Existem dados em match associados a esse registro'));
});
