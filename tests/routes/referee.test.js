const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/referee';

beforeAll(() => {
  run('03_referee');
});

test('Deve retornar todos os árbitros', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um árbitro pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/10000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Vinícius Gonçalves Dias Araújo');
    });
});

test('Deve inserir novos árbitros com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      { name: 'Edina Alves Batista' },
      { name: 'Neuza Ines Back' },
      { name: 'Fabrini Bevilaqua Costa' },
      { name: 'Marianna Nanni Batalha' },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(4);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um novo árbitro...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    { name: 'Salim Fende Chavez' },
    { name: 'Alex Ang Ribeiro' },
    { name: 'Rafael Tadeu Alves de Souza' },
    { name: 'Adeli Mara Monteiro' },
  ];

  test('sem o atributo name', () => testTemplate([...newData, { name: '' }], 'O atributo name é obrigatório'));
  test('duplicado', () => testTemplate([...newData, { name: 'Edina Alves Batista' }], 'Já existe um registro com esse name'));
});

describe('Deve atualizar um árbitro com sucesso', () => {
  test('Atualizando o árbitro', () => {
    return request(app).put(`${MAIN_ROUTE}/10001`)
      .send({ name: 'Danilo Ricardo Simon Manis' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10001`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Danilo Ricardo Simon Manis');
      });
  });
});

describe('Não deve atualizar um árbitro...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('com o valor de name inválido', () => testTemplate(10007, { name: '' }, 'O valor de name é inválido'));
  test('duplicado', () => testTemplate(10007, { name: 'Flavio Rodrigues de Souza' }, 'Já existe um registro com esse name'));
});

describe('Deve remover um árbitro com sucesso', () => {
  test('Removendo o árbitro', () => {
    return request(app).delete(`${MAIN_ROUTE}/10005`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/10005`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um árbitro...', () => {
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

  test('não cadastrado', () => testTemplate(10008, 'Registro não encontrado'));
  test('com partidas associadas', () => testTemplate(14000, 'Existem dados em match associados a esse registro', '08_match'));
});
