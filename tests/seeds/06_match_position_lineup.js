exports.seed = (knex) => {
  return knex('goal').del()
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
    ]))
    .then(() => knex('position').insert([
      { id: 18000, symbol: 'G', name: 'Goalkepper' },
      { id: 18001, symbol: 'D', name: 'Defense' },
      { id: 18002, symbol: 'M', name: 'Midfielder' },
      { id: 18003, symbol: 'F', name: 'Forward' },
      { id: 18004, symbol: 'LB', name: 'Left Back' },
    ]))
    .then(() => knex('player').insert([
      {
        id: 19000,
        name: 'Rafael Pires Monteiro',
        birth: '1989-06-23',
        country_id: 10000,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1600/middle/images.terra.com/2022/12/09/6205393-63926babb6010.jpeg',
      },
      {
        id: 19001,
        name: 'Marcio Rafael Ferreira de Souza',
        nickname: 'Rafinha',
        birth: '1985-09-07',
        country_id: 10000,
        image: 'https://tntsports.com.br/__export/1654285236706/sites/esporteinterativo/img/2022/06/03/51852542181_226f9b53df_c.jpg_423682103.jpg',
      },
      {
        id: 19002,
        name: 'Robert Abel Arboleda Escobar',
        birth: '1991-10-22',
        country_id: 10003,
        image: 'https://www.ofutebolero.com.br/__export/1662133645349/sites/elfutboleromx/img/2022/09/02/arboleda-sao-paulo-36-scaled.jpg_462530703.jpg',
      },
      {
        id: 19003,
        name: 'Nahuel Adolfo Ferraresi Hernández',
        birth: '1998-11-19',
        country_id: 10005,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2022/08/13/1712093731-1660423851588.jpg',
      },
      {
        id: 19004,
        name: 'Welington Damascena Santos',
        birth: '2001-02-19',
        country_id: 10000,
        image: 'https://s2.glbimg.com/z_6gQ5UJ4v8Zb8_KPg7tA1UrPjE=/0x0:2000x1335/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2020/6/S/cVwudES7epO9JqcDmBDQ/welington.jpg',
      },
      {
        id: 19005,
        name: 'Pablo Gonçalves Maia Fortunato',
        birth: '2002-01-10',
        country_id: 10000,
        image: 'https://conteudo.imguol.com.br/c/esporte/00/2022/11/19/volante-pablo-maia-em-acao-durante-partida-do-sao-paulo-no-brasileirao-de-2022-1668885668963_v2_450x450.jpg',
      },
      {
        id: 19006,
        name: 'Wellington Soares da Silva',
        nickname: 'Wellington Rato',
        birth: '1992-06-18',
        country_id: 10000,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1600/middle/images.terra.com/2022/12/17/412251407-639dfb5c28dc1.jpeg',
      },
      {
        id: 19007,
        name: 'Rodrigo Nestor Bertalia',
        birth: '2000-08-09',
        country_id: 10000,
        image: 'https://www.lance.com.br/files/article_main/uploads/2022/05/20/6287066cba784.jpeg',
      },
      {
        id: 19008,
        name: 'Luciano da Rocha Neves',
        birth: '1993-05-18',
        country_id: 10000,
        image: 'https://campeoesdofuturo.files.wordpress.com/2021/02/luciano.png?w=243&h=300',
      },
      {
        id: 19009,
        name: 'Pedro Gabriel Pereira Lopes',
        nickname: 'Pedrinho',
        birth: '1999-11-10',
        country_id: 10000,
        image: 'https://www.lance.com.br/files/article_main/uploads/2023/01/04/63b5b6c10d1d9.jpeg',
      },
      {
        id: 19010,
        name: 'Jonathan Calleri',
        birth: '1993-09-23',
        country_id: 10001,
        image: 'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt0ef8bf5a4a9ee4b6/616e0cf0323a8610fb736cdd/7f598d4d6ed29214d88c512f7e60b3a12b97e151.jpg?auto=webp&fit=crop&format=jpg&height=800&quality=60&width=1200',
      },
      {
        id: 19011,
        name: 'Igor Vinícius de Souza',
        birth: '1997-04-01',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/1997/04/Igor-Vinicius-SPFC.jpg',
      },
      {
        id: 19012,
        name: 'Giuliano Galoppo',
        birth: '1999-06-18',
        country_id: 10001,
        image: 'https://conteudo.imguol.com.br/c/parceiros/53/2022/07/27/novo-jogador-do-sao-paulo-giuliano-galoppo-1658936429269_v2_450x450.jpg',
      },
      {
        id: 19013,
        name: 'Igor Matheus Liziero Pereira',
        birth: '1998-02-07',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/2000/08/Liziero-1.png',
      },
      {
        id: 19014,
        name: 'Juan Santos da Silva',
        birth: '2002-03-07',
        country_id: 10000,
        image: 'https://www.ogol.com.br/img/jogadores/85/866685_med__20220128160256_juan_santos.png',
      },
      {
        id: 19015,
        name: 'Marcos Paulo Costa do Nascimento',
        birth: '2001-02-01',
        country_id: 10000,
        image: 'https://conteudo.imguol.com.br/c/esporte/0f/2022/12/28/marcos-paulo-novo-reforco-do-sao-paulo-1672273637413_v2_450x450.jpg',
      },
      {
        id: 19016,
        name: 'Alan Javier Franco',
        birth: '1996-10-11',
        country_id: 10001,
        image: 'https://portaldosaopaulino.com.br/wp-content/uploads/2023/02/457416CA-6C40-42FD-9864-3E88D753AC4A-819x1024.jpeg',
      },
      {
        id: 19017,
        name: 'David Corrêa da Fonseca',
        birth: '1995-10-17',
        country_id: 10000,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2023/01/19/858881080-david-1.jpg',
      },
      {
        id: 19018,
        name: 'Jhegson Sebastián Méndez Carabalí',
        birth: '1997-04-26',
        country_id: 10003,
        image: 'https://www.lance.com.br/files/article_main/uploads/2023/01/19/63c9ea1ba189b.jpeg',
      },
      {
        id: 19019,
        name: 'Luan Vinícius da Silva Santos',
        birth: '1999-05-14',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/1999/05/Luan-SPFC.jpg',
      },
      {
        id: 19020,
        name: 'Luis Manuel Orejuela García',
        birth: '1995-08-20',
        country_id: 10004,
        image: 'https://conteudo.imguol.com.br/c/esporte/3b/2021/05/12/orejuela-comemora-gol-do-sao-paulo-contra-o-rentistas-pela-libertadores-1620860700392_v2_1x1.jpg',
      },
      {
        id: 19021,
        name: 'Lucas Lopes Beraldo',
        birth: '2003-11-24',
        country_id: 10000,
        image: 'https://www.arqtricolor.com/wp-content/uploads/2021/07/210103152_797403657640580_7710886127371056561_n.jpg',
      },
    ]))
    .then(() => knex('lineup').insert([
      { id: 20000, match_id: 17000, player_id: 19000, position_id: 18000, shirt_number: 23 },
      { id: 20001, match_id: 17000, player_id: 19001, position_id: 18001, shirt_number: 13 },
      { id: 20002, match_id: 17000, player_id: 19002, position_id: 18001, shirt_number: 5 },
      { id: 20003, match_id: 17000, player_id: 19003, position_id: 18001, shirt_number: 3 },
      { id: 20004, match_id: 17000, player_id: 19004, position_id: 18001, shirt_number: 6 },
      { id: 20005, match_id: 17000, player_id: 19005, position_id: 18002, shirt_number: 29 },
      { id: 20006, match_id: 17000, player_id: 19006, position_id: 18003, shirt_number: 27 },
      { id: 20007, match_id: 17000, player_id: 19007, position_id: 18002, shirt_number: 11 },
      { id: 20008, match_id: 17000, player_id: 19008, position_id: 18002, shirt_number: 10 },
      { id: 20009, match_id: 17000, player_id: 19009, position_id: 18003, shirt_number: 12 },
      { id: 20010, match_id: 17000, player_id: 19012, position_id: 18003, shirt_number: 14 },
    ]));
};
