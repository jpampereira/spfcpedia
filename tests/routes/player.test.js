const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/player';

beforeAll(() => {
  run('09_player');
});

test('Deve listar todos os jogadores', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar um jogador pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/11010`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Jonathan Calleri');
    });
});

test('Deve inserir novos jogadores com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      {
        name: 'Caio Fernando de Oliveira',
        nickname: 'Caio Paulista',
        birth: '1998-05-11',
        country_id: 10000,
        image: 'https://s2.glbimg.com/xDgiIaQ7lAaVJQYvm5gqq3DMdWE=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/I/z/F4axytRAWVBdbmmdvG4g/caio-paulista.jpg',
      },
      {
        name: 'Talles Macedo Toledo Costa',
        birth: '2002-08-02',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/2002/08/Talles-Costa-SPFC.jpg',
      },
      {
        name: 'Gabriel Neves Perdomo',
        birth: '1997-08-11',
        country_id: 10002,
        image: 'https://s2.glbimg.com/Y2ahbmZQXeWK_fAlWWucKXw0PrU=/0x0:1634x2048/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2021/7/O/QOQrVKSSe0A4NFzbBBhg/gabriel-neves.jpg',
      },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(3);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir um jogador...', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const newData = [
    {
      name: 'Erison Danilo de Souza',
      birth: '1999-04-13',
      country_id: 10000,
      image: 'https://s2.glbimg.com/5zYL9xS0hqcUIqCnRC-G-031Juc=/0x0:1100x1600/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/s/S/4bbi0QR8aSSDLZRwMW7Q/whatsapp-image-2023-02-02-at-13.39.28.jpeg',
    },
    {
      name: 'Nathan Gabriel de Souza Mendes',
      birth: '2002-08-19',
      country_id: 10000,
      image: 'https://pbs.twimg.com/media/FoZal_LWcAI_JlG.jpg:large',
    },
  ];

  const wrongData = {
    name: 'Diego Henrique Costa Barbosa',
    birth: '1999-07-21',
    country_id: 10000,
    image: 'https://pbs.twimg.com/media/FYN_7XYXoAIbFpR.jpg',
  };

  test('sem o atributo name', () => testTemplate([...newData, { ...wrongData, name: null }], 'O atributo name é obrigatório'));
  test('sem o atributo birth', () => testTemplate([...newData, { ...wrongData, birth: null }], 'O atributo birth é obrigatório'));
  test('sem o atributo country_id', () => testTemplate([...newData, { ...wrongData, country_id: null }], 'O atributo country_id é obrigatório'));
  test('sem o atributo image', () => testTemplate([...newData, { ...wrongData, image: null }], 'O atributo image é obrigatório'));
  test('com o valor de birth inválido', () => testTemplate([...newData, { ...wrongData, birth: '21-07-1999' }], 'O valor de birth é inválido'));
  test('com o valor de country_id inválido', () => testTemplate([...newData, { ...wrongData, country_id: 10007 }], 'O valor de country_id é inválido'));
  test('com nome duplicado', () => testTemplate([...newData, { ...wrongData, name: 'Jonathan Calleri' }], 'Já existe um registro com esse name'));
  test('com apelido duplicado', () => testTemplate([...newData, { ...wrongData, nickname: 'Wellington Rato' }], 'Já existe um registro com esse nickname'));
});

describe('Deve alterar um jogador com sucesso', () => {
  test('Atualizando o jogador', () => {
    return request(app).put(`${MAIN_ROUTE}/11003`)
      .send({ country_id: 10005 })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/11003`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.country_id).toBe(10005);
      });
  });
});

describe('Não deve alterar um jogador...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('com o valor de name inválido', () => testTemplate(11000, { name: '' }, 'O valor de name é inválido'));
  test('com o valor de birth inválido', () => testTemplate(11000, { birth: '21-07-1999' }, 'O valor de birth é inválido'));
  test('com o valor de country_id inválido', () => testTemplate(11000, { country_id: 10007 }, 'O valor de country_id é inválido'));
  test('com o valor de image inválido', () => testTemplate(11000, { image: '' }, 'O valor de image é inválido'));
  test('com nome duplicado', () => testTemplate(11000, { name: 'Jonathan Calleri' }, 'Já existe um registro com esse name'));
  test('com apelido duplicado', () => testTemplate(11000, { nickname: 'Wellington Rato' }, 'Já existe um registro com esse nickname'));
});

describe('Deve remover um jogador com sucesso', () => {
  test('Removendo o jogador', () => {
    return request(app).delete(`${MAIN_ROUTE}/11021`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/11021`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover um jogador...', () => {
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

  test('não cadastrado', () => testTemplate(11022, 'Registro não encontrado'));
  test('com escalações associadas', () => testTemplate(19000, 'Existem dados em lineup associados a esse registro', '12_lineup'));
  test('com substituições associadas', () => testTemplate(19014, 'Existem dados em substitution associados a esse registro', '13_substitution'));
});
