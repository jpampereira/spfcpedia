const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/match';

beforeAll(() => {
  run('08_match');
});

test('Deve listar todas as partidas', () => {
  return request(app).get(MAIN_ROUTE)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(1);
    });
});

test('Deve retornar uma partida pelo Id', () => {
  return request(app).get(`${MAIN_ROUTE}/17000`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.datetime).toBe('2023-01-15 18:30');
      expect(res.body.opponent_goals).toBe(0);
      expect(res.body.highlights).toBe('https://www.youtube.com/watch?v=RtLunSYQYsY');
    });
});

test('Deve inserir novas partidas com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send([
      {
        stage_id: 16000,
        datetime: '2023-02-12 19:00',
        stadium_id: 12000,
        referee: 14003,
        assistant_referee_1: 14012,
        assistant_referee_2: 14024,
        fourth_official: 14010,
        opponent_id: 13007,
        opponent_goals: 1,
        highlights: 'https://www.youtube.com/watch?v=xiD75Xq6Vxs',
      },
      {
        stage_id: 16000,
        datetime: '2023-01-29 18:30',
        stadium_id: 12000,
        referee: 14015,
        assistant_referee_1: 14016,
        assistant_referee_2: 14017,
        fourth_official: 14014,
        opponent_id: 13004,
        opponent_goals: 2,
        highlights: 'https://www.youtube.com/watch?v=6haIBI_zD9E',
      },
    ])
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('id');
    });
});

describe('Não deve inserir uma partida...', () => {
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
      stage_id: 16000,
      datetime: '2023-02-05 16:00',
      stadium_id: 12003,
      referee: 14018,
      assistant_referee_1: 14004,
      assistant_referee_2: 14019,
      fourth_official: 14020,
      opponent_id: 13005,
      opponent_goals: 0,
      highlights: 'https://www.youtube.com/watch?v=sutniAJC9KA',
    },
    {
      stage_id: 16000,
      datetime: '2023-02-08 19:30',
      stadium_id: 12004,
      referee: 14021,
      assistant_referee_1: 14022,
      assistant_referee_2: 14001,
      fourth_official: 14023,
      opponent_id: 13006,
      opponent_goals: 2,
      highlights: 'https://www.youtube.com/watch?v=dmCBpvQGyio',
    },
  ];

  const wrongData = {
    stage_id: 16000,
    datetime: '2023-01-29 18:30',
    stadium_id: 12000,
    referee: 14015,
    assistant_referee_1: 14016,
    assistant_referee_2: 14017,
    fourth_official: 14014,
    opponent_id: 13004,
    opponent_goals: 2,
    highlights: 'https://www.youtube.com/watch?v=6haIBI_zD9E',
  };

  test('sem o atributo stage_id', () => testTemplate([...newData, { ...wrongData, stage_id: null }], 'O atributo stage_id é obrigatório'));
  test('sem o atributo datetime', () => testTemplate([...newData, { ...wrongData, datetime: null }], 'O atributo datetime é obrigatório'));
  test('sem o atributo stadium_id', () => testTemplate([...newData, { ...wrongData, stadium_id: null }], 'O atributo stadium_id é obrigatório'));
  test('sem o atributo referee', () => testTemplate([...newData, { ...wrongData, referee: null }], 'O atributo referee é obrigatório'));
  test('sem o atributo assistant_referee_1', () => testTemplate([...newData, { ...wrongData, assistant_referee_1: null }], 'O atributo assistant_referee_1 é obrigatório'));
  test('sem o atributo assistant_referee_2', () => testTemplate([...newData, { ...wrongData, assistant_referee_2: null }], 'O atributo assistant_referee_2 é obrigatório'));
  test('sem o atributo fourth_official', () => testTemplate([...newData, { ...wrongData, fourth_official: null }], 'O atributo fourth_official é obrigatório'));
  test('sem o atributo opponent_id', () => testTemplate([...newData, { ...wrongData, opponent_id: null }], 'O atributo opponent_id é obrigatório'));
  test('sem o atributo opponent_goals', () => testTemplate([...newData, { ...wrongData, opponent_goals: null }], 'O atributo opponent_goals é obrigatório'));
  test('sem o atributo highlights', () => testTemplate([...newData, { ...wrongData, highlights: null }], 'O atributo highlights é obrigatório'));
  test('com o valor de stage_id inválido', () => testTemplate([...newData, { ...wrongData, stage_id: 16004 }], 'O valor de stage_id é inválido'));
  test('com o valor de datetime inválido', () => testTemplate([...newData, { ...wrongData, datetime: '2023-01-29 18' }], 'O valor de datetime é inválido'));
  test('com o valor de stadium_id inválido', () => testTemplate([...newData, { ...wrongData, stadium_id: 12005 }], 'O valor de stadium_id é inválido'));
  test('com o valor de referee inválido', () => testTemplate([...newData, { ...wrongData, referee: 14029 }], 'O valor de referee é inválido'));
  test('com o valor de assistant_referee_1 inválido', () => testTemplate([...newData, { ...wrongData, assistant_referee_1: 14029 }], 'O valor de assistant_referee_1 é inválido'));
  test('com o valor de assistant_referee_2 inválido', () => testTemplate([...newData, { ...wrongData, assistant_referee_2: 14029 }], 'O valor de assistant_referee_2 é inválido'));
  test('com o valor de fourth_official inválido', () => testTemplate([...newData, { ...wrongData, fourth_official: 14029 }], 'O valor de fourth_official é inválido'));
  test('com o valor de opponent_id inválido', () => testTemplate([...newData, { ...wrongData, opponent_id: 13009 }], 'O valor de opponent_id é inválido'));
  test('com o valor de opponent_goals inválido', () => testTemplate([...newData, { ...wrongData, opponent_goals: -2 }], 'O valor de opponent_goals é inválido'));
  test('duplicada', () => testTemplate([...newData, wrongData], 'Registro já cadastrado'));
});

describe('Deve alterar uma partida com sucesso', () => {
  test('Atualizando a partida', () => {
    return request(app).put(`${MAIN_ROUTE}/17001`)
      .send({ opponent_goals: 1, highlights: 'https://www.youtube.com/watch?v=8X4TVhN8T88' })
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a atualização foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/17001`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.opponent_goals).toBe(1);
        expect(res.body.highlights).toBe('https://www.youtube.com/watch?v=8X4TVhN8T88');
      });
  });
});

describe('Não deve alterar uma partida...', () => {
  const testTemplate = (id, data, errorMessage) => {
    return request(app).put(`${MAIN_ROUTE}/${id}`)
      .send(data)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  const data = {
    stage_id: 16000,
    datetime: '2023-01-29 18:30',
    stadium_id: 12000,
    referee: 14015,
    assistant_referee_1: 14016,
    assistant_referee_2: 14017,
    fourth_official: 14014,
    opponent_id: 13004,
    opponent_goals: 2,
    highlights: 'https://www.youtube.com/watch?v=6haIBI_zD9E',
  };

  test('com o valor de stage_id inválido', () => testTemplate(17000, { ...data, stage_id: 16004 }, 'O valor de stage_id é inválido'));
  test('com o valor de datetime inválido', () => testTemplate(17000, { ...data, datetime: '2023-01-29 18' }, 'O valor de datetime é inválido'));
  test('com o valor de stadium_id inválido', () => testTemplate(17000, { ...data, stadium_id: 12005 }, 'O valor de stadium_id é inválido'));
  test('com o valor de referee inválido', () => testTemplate(17000, { ...data, referee: 14029 }, 'O valor de referee é inválido'));
  test('com o valor de assistant_referee_1 inválido', () => testTemplate(17000, { ...data, assistant_referee_1: 14029 }, 'O valor de assistant_referee_1 é inválido'));
  test('com o valor de assistant_referee_2 inválido', () => testTemplate(17000, { ...data, assistant_referee_2: 14029 }, 'O valor de assistant_referee_2 é inválido'));
  test('com o valor de fourth_official inválido', () => testTemplate(17000, { ...data, fourth_official: 14029 }, 'O valor de fourth_official é inválido'));
  test('com o valor de opponent_id inválido', () => testTemplate(17000, { ...data, opponent_id: 13009 }, 'O valor de opponent_id é inválido'));
  test('com o valor de opponent_goals inválido', () => testTemplate(17000, { ...data, opponent_goals: -2 }, 'O valor de opponent_goals é inválido'));
  test('com o valor de highlights inválido', () => testTemplate(17000, { ...data, highlights: '' }, 'O valor de highlights é inválido'));
  test('duplicada', () => testTemplate(17000, data, 'Registro já cadastrado'));
});

describe('Deve remover uma partida com sucesso', () => {
  test('Removendo a partida', () => {
    return request(app).delete(`${MAIN_ROUTE}/17002`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });

  test('Atestando que a remoção foi realizada', () => {
    return request(app).get(`${MAIN_ROUTE}/17002`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
      });
  });
});

describe('Não deve remover uma partida...', () => {
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

  test('não cadastrada', () => testTemplate(17004, 'Registro não encontrado'));
  test('com escalações associadas', () => testTemplate(17000, 'Existem dados em lineup associados a esse registro', '12_lineup'));
});
