const request = require('supertest');

const app = require('../../src/app');
const { run } = require('../seed');

const MAIN_ROUTE = '/match';

beforeAll(() => {
  run('06_match_player');
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
        tournament_stage: 16000,
        datetime: '2023-01-26 21:30',
        local: 12000,
        referee: 14011,
        assistant_referee_1: 14012,
        assistant_referee_2: 14013,
        fourth_official: 14014,
        opponent: 13003,
        opponent_goals: 1,
        highlights: 'https://www.youtube.com/watch?v=kjq4MP_gimw',
      },
      {
        tournament_stage: 16000,
        datetime: '2023-01-29 18:30',
        local: 12000,
        referee: 14015,
        assistant_referee_1: 14016,
        assistant_referee_2: 14017,
        fourth_official: 14014,
        opponent: 13004,
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
      tournament_stage: 16000,
      datetime: '2023-02-05 16:00',
      local: 12003,
      referee: 14018,
      assistant_referee_1: 14004,
      assistant_referee_2: 14019,
      fourth_official: 14020,
      opponent: 13005,
      opponent_goals: 0,
      highlights: 'https://www.youtube.com/watch?v=sutniAJC9KA',
    },
    {
      tournament_stage: 16000,
      datetime: '2023-02-08 19:30',
      local: 12004,
      referee: 14021,
      assistant_referee_1: 14022,
      assistant_referee_2: 14001,
      fourth_official: 14023,
      opponent: 13006,
      opponent_goals: 2,
      highlights: 'https://www.youtube.com/watch?v=dmCBpvQGyio',
    },
  ];

  const wrongData = {
    tournament_stage: 16000,
    datetime: '2023-01-29 18:30',
    local: 12000,
    referee: 14015,
    assistant_referee_1: 14016,
    assistant_referee_2: 14017,
    fourth_official: 14014,
    opponent: 13004,
    opponent_goals: 2,
    highlights: 'https://www.youtube.com/watch?v=6haIBI_zD9E',
  };

  test('sem o atributo tournament_stage', () => testTemplate([...newData, { ...wrongData, tournament_stage: null }], 'O atributo tournament_stage é obrigatório'));
  test('sem o atributo datetime', () => testTemplate([...newData, { ...wrongData, datetime: null }], 'O atributo datetime é obrigatório'));
  test('sem o atributo local', () => testTemplate([...newData, { ...wrongData, local: null }], 'O atributo local é obrigatório'));
  test('sem o atributo referee', () => testTemplate([...newData, { ...wrongData, referee: null }], 'O atributo referee é obrigatório'));
  test('sem o atributo assistant_referee_1', () => testTemplate([...newData, { ...wrongData, assistant_referee_1: null }], 'O atributo assistant_referee_1 é obrigatório'));
  test('sem o atributo assistant_referee_2', () => testTemplate([...newData, { ...wrongData, assistant_referee_2: null }], 'O atributo assistant_referee_2 é obrigatório'));
  test('sem o atributo fourth_official', () => testTemplate([...newData, { ...wrongData, fourth_official: null }], 'O atributo fourth_official é obrigatório'));
  test('sem o atributo opponent', () => testTemplate([...newData, { ...wrongData, opponent: null }], 'O atributo opponent é obrigatório'));
  test('sem o atributo opponent_goals', () => testTemplate([...newData, { ...wrongData, opponent_goals: null }], 'O atributo opponent_goals é obrigatório'));
  test('sem o atributo highlights', () => testTemplate([...newData, { ...wrongData, highlights: null }], 'O atributo highlights é obrigatório'));
  test('cujo valor de tournament_stage é inválido', () => testTemplate([...newData, { ...wrongData, tournament_stage: 16004 }], 'O valor de tournament_stage é inválido'));
  test('cujo valor de datetime é inválido', () => testTemplate([...newData, { ...wrongData, datetime: '2023-01-29 18' }], 'O valor de datetime é inválido'));
  test('cujo valor de local é inválido', () => testTemplate([...newData, { ...wrongData, local: 12005 }], 'O valor de local é inválido'));
  test('cujo valor de referee é inválido', () => testTemplate([...newData, { ...wrongData, referee: 14029 }], 'O valor de referee é inválido'));
  test('cujo valor de assistant_referee_1 é inválido', () => testTemplate([...newData, { ...wrongData, assistant_referee_1: 14029 }], 'O valor de assistant_referee_1 é inválido'));
  test('cujo valor de assistant_referee_2 é inválido', () => testTemplate([...newData, { ...wrongData, assistant_referee_2: 14029 }], 'O valor de assistant_referee_2 é inválido'));
  test('cujo valor de fourth_official é inválido', () => testTemplate([...newData, { ...wrongData, fourth_official: 14029 }], 'O valor de fourth_official é inválido'));
  test('cujo valor de opponent é inválido', () => testTemplate([...newData, { ...wrongData, opponent: 13009 }], 'O valor de opponent é inválido'));
  test('cujo valor de opponent_goals é inválido', () => testTemplate([...newData, { ...wrongData, opponent_goals: -2 }], 'O valor de opponent_goals é inválido'));
  test('cujo valor de highlights é inválido', () => testTemplate([...newData, { ...wrongData, highlights: 'google.com.br' }], 'O valor de highlights é inválido'));
  test('duplicada', () => testTemplate([...newData, wrongData], 'Partida já cadastrada'));
});

test('Deve alterar uma partida com sucesso', () => {
  return request(app).put(`${MAIN_ROUTE}/17001`)
    .send({ opponent_goals: 1, highlights: 'https://www.youtube.com/watch?v=8X4TVhN8T88&t=13s' })
    .then((res) => {
      expect(res.status).toBe(204);
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
    tournament_stage: 16000,
    datetime: '2023-01-29 18:30',
    local: 12000,
    referee: 14015,
    assistant_referee_1: 14016,
    assistant_referee_2: 14017,
    fourth_official: 14014,
    opponent: 13004,
    opponent_goals: 2,
    highlights: 'https://www.youtube.com/watch?v=6haIBI_zD9E',
  };

  test('cujo valor de tournament_stage é inválido', () => testTemplate(17000, { ...data, tournament_stage: 16004 }, 'O valor de tournament_stage é inválido'));
  test('cujo valor de datetime é inválido', () => testTemplate(17000, { ...data, datetime: '2023-01-29 18' }, 'O valor de datetime é inválido'));
  test('cujo valor de local é inválido', () => testTemplate(17000, { ...data, local: 12005 }, 'O valor de local é inválido'));
  test('cujo valor de referee é inválido', () => testTemplate(17000, { ...data, referee: 14029 }, 'O valor de referee é inválido'));
  test('cujo valor de assistant_referee_1 é inválido', () => testTemplate(17000, { ...data, assistant_referee_1: 14029 }, 'O valor de assistant_referee_1 é inválido'));
  test('cujo valor de assistant_referee_2 é inválido', () => testTemplate(17000, { ...data, assistant_referee_2: 14029 }, 'O valor de assistant_referee_2 é inválido'));
  test('cujo valor de fourth_official é inválido', () => testTemplate(17000, { ...data, fourth_official: 14029 }, 'O valor de fourth_official é inválido'));
  test('cujo valor de opponent é inválido', () => testTemplate(17000, { ...data, opponent: 13009 }, 'O valor de opponent é inválido'));
  test('cujo valor de opponent_goals é inválido', () => testTemplate(17000, { ...data, opponent_goals: -2 }, 'O valor de opponent_goals é inválido'));
  test('cujo valor de highlights é inválido', () => testTemplate(17000, { ...data, highlights: 'google.com.br' }, 'O valor de highlights é inválido'));
  test('duplicada', () => testTemplate(17000, data, 'Partida já cadastrada'));
});

test('Deve remover uma partida com sucesso', () => {
  return request(app).delete(`${MAIN_ROUTE}/17002`)
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
