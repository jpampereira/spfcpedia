const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/player';

beforeAll(() => {
  run('06_match_player');
});

test('Deve inserir novos jogadores com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      {
        name: 'Caio Fernando de Oliveira',
        nickname: 'Caio Paulista',
        position: 'D',
        birth: '1998-05-11',
        nationality: 10000,
        image: 'https://s2.glbimg.com/xDgiIaQ7lAaVJQYvm5gqq3DMdWE=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/I/z/F4axytRAWVBdbmmdvG4g/caio-paulista.jpg',
      },
      {
        name: 'Talles Macedo Toledo Costa',
        position: 'M',
        birth: '2002-08-02',
        nationality: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/2002/08/Talles-Costa-SPFC.jpg',
      },
      {
        name: 'Gabriel Neves Perdomo',
        position: 'M',
        birth: '1997-08-11',
        nationality: 10002,
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
      position: 'F',
      birth: '1999-04-13',
      nationality: 10000,
      image: 'https://s2.glbimg.com/5zYL9xS0hqcUIqCnRC-G-031Juc=/0x0:1100x1600/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/s/S/4bbi0QR8aSSDLZRwMW7Q/whatsapp-image-2023-02-02-at-13.39.28.jpeg',
    },
    {
      name: 'Nathan Gabriel de Souza Mendes',
      position: 'D',
      birth: '2002-08-19',
      nationality: 10000,
      image: 'https://pbs.twimg.com/media/FoZal_LWcAI_JlG.jpg:large',
    },
  ];

  const wrongData = {
    name: 'Diego Henrique Costa Barbosa',
    position: 'D',
    birth: '1999-07-21',
    nationality: 10000,
    image: 'https://pbs.twimg.com/media/FYN_7XYXoAIbFpR.jpg',
  };

  test('sem o atributo name', () => testTemplate([...newData, { ...wrongData, name: null }], 'O atributo name é obrigatório'));
  test('sem o atributo position', () => testTemplate([...newData, { ...wrongData, position: null }], 'O atributo position é obrigatório'));
  test('sem o atributo birth', () => testTemplate([...newData, { ...wrongData, birth: null }], 'O atributo birth é obrigatório'));
  test('sem o atributo nationality', () => testTemplate([...newData, { ...wrongData, nationality: null }], 'O atributo nationality é obrigatório'));
  test('sem o atributo image', () => testTemplate([...newData, { ...wrongData, image: null }], 'O atributo image é obrigatório'));
  test('cujo valor de position é inválido', () => testTemplate([...newData, { ...wrongData, position: 'H' }], 'O valor de position é inválido'));
  test('cujo valor de birth é inválido', () => testTemplate([...newData, { ...wrongData, birth: '21-07-1999' }], 'O valor de birth é inválido'));
  test('cujo valor de nationality é inválido', () => testTemplate([...newData, { ...wrongData, nationality: 10007 }], 'O valor de nationality é inválido'));
  test('cujo valor de image é inválido', () => testTemplate([...newData, { ...wrongData, image: 'google.com.br' }], 'O valor de image é inválido'));
  test('com nome duplicado', () => testTemplate([...newData, { ...wrongData, name: 'Jonathan Calleri' }], 'Jogador já cadastrado'));
  test('com apelido duplicado', () => testTemplate([...newData, { ...wrongData, nickname: 'Wellington Rato' }], 'Apelido já utilizado por outro jogador'));
});

test('Deve alterar um jogador com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/18003`)
    .send({ position: 'D', nationality: 10005 })
    .then((res) => {
      expect(res.status).toBe(204);
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

  test('cujo valor de position é inválido', () => testTemplate(18000, { position: 'H' }, 'O valor de position é inválido'));
  test('cujo valor de birth é inválido', () => testTemplate(18000, { birth: '21-07-1999' }, 'O valor de birth é inválido'));
  test('cujo valor de nationality é inválido', () => testTemplate(18000, { nationality: 10007 }, 'O valor de nationality é inválido'));
  test('cujo valor de image é inválido', () => testTemplate(18000, { image: 'google.com.br' }, 'O valor de image é inválido'));
  test('para um nome já cadastrado', () => testTemplate(18000, { name: 'Jonathan Calleri' }, 'Jogador já cadastrado'));
  test('para um apelido já cadastrado', () => testTemplate(18000, { nickname: 'Wellington Rato' }, 'Apelido já utilizado por outro jogador'));
});

test('Deve remover um jogador com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/18000`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
