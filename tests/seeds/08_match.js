exports.seed = (knex) => {
  return knex('card').del()
    .then(() => knex('goal').del())
    .then(() => knex('substitution').del())
    .then(() => knex('lineup').del())
    .then(() => knex('position').del())
    .then(() => knex('player').del())
    .then(() => knex('match').del())
    .then(() => knex('stage').del())
    .then(() => knex('tournament').del())
    .then(() => knex('referee').del())
    .then(() => knex('opponent').del())
    .then(() => knex('stadium').del())
    .then(() => knex('city').del())
    .then(() => knex('country').del())
    .then(() => knex('country').insert([
      { id: 10000, name: 'Brasil' },
      { id: 10001, name: 'Argentina' },
      { id: 10002, name: 'Uruguai' },
      { id: 10003, name: 'Equador' },
      { id: 10004, name: 'Colômbia' },
      { id: 10005, name: 'Venezuela' },
    ]))
    .then(() => knex('city').insert([
      { id: 11000, name: 'São Paulo', country_id: 10000 },
      { id: 11001, name: 'Araraquara', country_id: 10000 },
      { id: 11002, name: 'Santo André', country_id: 10000 },
      { id: 11003, name: 'Bragança Paulista', country_id: 10000 },
    ]))
    .then(() => knex('stadium').insert([
      { id: 12000, name: 'Estádio Cícero Pompeu de Toledo', nickname: 'Morumbi', city_id: 11000 },
      { id: 12001, name: 'Estádio Doutor Adhemar de Barros', nickname: 'Fonte Luminosa', city_id: 11001 },
      { id: 12002, name: 'Allianz Parque', city_id: 11000 },
      { id: 12003, name: 'Estádio Municipal Bruno José Daniel', nickname: 'Brunão', city_id: 11002 },
      { id: 12004, name: 'Estádio Nabi Abi Chedid', nickname: 'Nabizão', city_id: 11003 },
    ]))
    .then(() => knex('opponent').insert([
      { id: 13000, name: 'Ituano Futebol Clube' },
      { id: 13001, name: 'Associação Ferroviária de Esportes' },
      { id: 13002, name: 'Sociedade Esportiva Palmeiras' },
      { id: 13003, name: 'Associação Portuguesa de Desportos' },
      { id: 13004, name: 'Sport Club Corinthians Paulista' },
      { id: 13005, name: 'Esporte Clube Santo André' },
      { id: 13006, name: 'Red Bull Bragantino' },
      { id: 13007, name: 'Santos Futebol Clube' },
      { id: 13008, name: 'Associação Atlética Internacional - Limeira' },
    ]))
    .then(() => knex('referee').insert([
      { id: 14000, name: 'Vinícius Gonçalves Dias Araújo' },
      { id: 14001, name: 'Robson Ferreira Oliveira' },
      { id: 14002, name: 'Ilbert Estevam da Silva' },
      { id: 14003, name: 'Flávio Rodrigues de Souza' },
      { id: 14004, name: 'Marcelo Carvalho Van Gasse' },
      { id: 14005, name: 'Diego Morelli de Oliveira' },
      { id: 14006, name: 'Paulo Cesar Francisco' },
      { id: 14007, name: 'Edina Alves Batista' },
      { id: 14008, name: 'Neuza Ines Back' },
      { id: 14009, name: 'Fabrini Bevilaqua Costa' },
      { id: 14010, name: 'Marianna Nanni Batalha' },
      { id: 14011, name: 'Salim Fende Chavez' },
      { id: 14012, name: 'Alex Ang Ribeiro' },
      { id: 14013, name: 'Rafael Tadeu Alves de Souza' },
      { id: 14014, name: 'Adeli Mara Monteiro' },
      { id: 14015, name: 'Raphael Claus' },
      { id: 14016, name: 'Danilo Ricardo Simon Manis' },
      { id: 14017, name: 'Daniel Paulo Ziolli' },
      { id: 14018, name: 'Douglas Marques das Flores' },
      { id: 14019, name: 'Denis Matheus Afonso Ferreira' },
      { id: 14020, name: 'Rodrigo Santos' },
      { id: 14021, name: 'Luiz Flávio de Oliveira' },
      { id: 14022, name: 'Miguel Cataneo Ribeiro da Costa' },
      { id: 14023, name: 'Michel de Camargo' },
      { id: 14024, name: 'Mauro Freitas' },
      { id: 14025, name: 'Matheus Delgado Candançan' },
      { id: 14026, name: 'Luiz Alberto Andrini Nogueira' },
      { id: 14027, name: 'Amanda Pinto Matias' },
      { id: 14028, name: 'Ricardo Bittencourt da Silva' },
    ]))
    .then(() => knex('tournament').insert([
      { id: 15000, name: 'Campeonato Paulista' },
    ]))
    .then(() => knex('stage').insert([
      { id: 16000, name: 'Fase de Grupos', tournament_id: 15000 },
      { id: 16001, name: 'Quartas de Final', tournament_id: 15000 },
      { id: 16002, name: 'Semi Final', tournament_id: 15000 },
      { id: 16003, name: 'Final', tournament_id: 15000 },
    ]))
    .then(() => knex('match').insert([
      {
        id: 17000,
        stage_id: 16000,
        datetime: '2023-01-15 18:30',
        stadium_id: 12000,
        referee: 14000,
        assistant_referee_1: 14016,
        assistant_referee_2: 14001,
        fourth_official: 14002,
        opponent_id: 13000,
        opponent_goals: 0,
        highlights: 'https://www.youtube.com/watch?v=RtLunSYQYsY',
      },
      {
        id: 17001,
        stage_id: 16000,
        datetime: '2023-01-19 19:30',
        stadium_id: 12001,
        referee: 14003,
        assistant_referee_1: 14004,
        assistant_referee_2: 14005,
        fourth_official: 14006,
        opponent_id: 13001,
        opponent_goals: 3,
        highlights: 'Link Faltando :(',
      },
      {
        id: 17002,
        stage_id: 16000,
        datetime: '2023-01-22 16:00',
        stadium_id: 12002,
        referee: 14007,
        assistant_referee_1: 14008,
        assistant_referee_2: 14009,
        fourth_official: 14010,
        opponent_id: 13002,
        opponent_goals: 0,
        highlights: 'https://www.youtube.com/watch?v=4W2iHV5vJXI',
      },
      {
        id: 17003,
        stage_id: 16000,
        datetime: '2023-01-26 21:30',
        stadium_id: 12000,
        referee: 14011,
        assistant_referee_1: 14012,
        assistant_referee_2: 14013,
        fourth_official: 14014,
        opponent_id: 13003,
        opponent_goals: 1,
        highlights: 'https://www.youtube.com/watch?v=kjq4MP_gimw',
      },
    ]));
};
