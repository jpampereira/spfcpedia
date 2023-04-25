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
    .then(() => knex('player').insert([
      {
        id: 11000,
        name: 'Rafael Pires Monteiro',
        birth: '1989-06-23',
        country_id: 10000,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1600/middle/images.terra.com/2022/12/09/6205393-63926babb6010.jpeg',
      },
      {
        id: 11001,
        name: 'Marcio Rafael Ferreira de Souza',
        nickname: 'Rafinha',
        birth: '1985-09-07',
        country_id: 10000,
        image: 'https://tntsports.com.br/__export/1654285236706/sites/esporteinterativo/img/2022/06/03/51852542181_226f9b53df_c.jpg_423682103.jpg',
      },
      {
        id: 11002,
        name: 'Robert Abel Arboleda Escobar',
        birth: '1991-10-22',
        country_id: 10003,
        image: 'https://www.ofutebolero.com.br/__export/1662133645349/sites/elfutboleromx/img/2022/09/02/arboleda-sao-paulo-36-scaled.jpg_462530703.jpg',
      },
      {
        id: 11003,
        name: 'Nahuel Adolfo Ferraresi Hernández',
        birth: '1998-11-19',
        country_id: 10001,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2022/08/13/1712093731-1660423851588.jpg',
      },
      {
        id: 11004,
        name: 'Welington Damascena Santos',
        birth: '2001-02-19',
        country_id: 10000,
        image: 'https://s2.glbimg.com/z_6gQ5UJ4v8Zb8_KPg7tA1UrPjE=/0x0:2000x1335/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2020/6/SS7epO9JqcDmBDQ/welington.jpg',
      },
      {
        id: 11005,
        name: 'Pablo Gonçalves Maia Fortunato',
        birth: '2002-01-10',
        country_id: 10000,
        image: 'https://conteudo.imguol.com.br/c/esporte/00/2022/11/9/volante-pablo-maia-em-acao-durante-partida-do-sao-paulo-no-brasileirao-de-2022-1668885668963_v2_450x450.jpg',
      },
      {
        id: 11006,
        name: 'Wellington Soares da Silva',
        nickname: 'Wellington Rato',
        birth: '1992-06-18',
        country_id: 10000,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1600/middle/images.terra.com/2022/12/17/412251407-639dfb5c28dc1.jpeg',
      },
      {
        id: 11007,
        name: 'Rodrigo Nestor Bertalia',
        birth: '2000-08-09',
        country_id: 10000,
        image: 'https://www.lance.com.br/files/article_main/uploads/2022/05/20/6287066cba784.jpeg',
      },
      {
        id: 11008,
        name: 'Luciano da Rocha Neves',
        birth: '1993-05-18',
        country_id: 10000,
        image: 'https://campeoesdofuturo.files.wordpress.com/2021/02/luciano.png?w=243&h=300',
      },
      {
        id: 11009,
        name: 'Pedro Gabriel Pereira Lopes',
        nickname: 'Pedrinho',
        birth: '1999-11-10',
        country_id: 10000,
        image: 'https://www.lance.com.br/files/article_main/uploads/2023/01/04/63b5b6c10d1d9.jpeg',
      },
      {
        id: 11010,
        name: 'Jonathan Calleri',
        birth: '1993-09-23',
        country_id: 10001,
        image: 'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt0ef8bf5a4a9ee4b6/616e0cf0323a8610fb736cdd/7f598d4d6ed29214d88c512f7e60b3a12b97e11.jpg?auto=webp&fit=crop&format=jpg&height=800&quality=601200',
      },
      {
        id: 11011,
        name: 'Igor Vinícius de Souza',
        birth: '1997-04-01',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/1997/04/Igor-Vinicius-SPFC.jpg',
      },
      {
        id: 11012,
        name: 'Giuliano Galoppo',
        birth: '1999-06-18',
        country_id: 10001,
        image: 'https://conteudo.imguol.com.br/c/parceiros/53/2022/07/27/novo-jogador-do-sao-paulo-giuliano-galoppo-1658936429269_v2_450x450.jpg',
      },
      {
        id: 11013,
        name: 'Igor Matheus Liziero Pereira',
        birth: '1998-02-07',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/2000/08/Liziero-1.png',
      },
      {
        id: 11014,
        name: 'Juan Santos da Silva',
        birth: '2002-03-07',
        country_id: 10000,
        image: 'https://www.ogol.com.br/img/jogadores/85/866685_med__20220128160256_juan_santos.png',
      },
      {
        id: 11015,
        name: 'Marcos Paulo Costa do Nascimento',
        birth: '2001-02-01',
        country_id: 10000,
        image: 'https://conteudo.imguol.com.br/c/esporte/0f/2022/12/28/arcos-paulo-novo-reforco-do-sao-paulo-1672273637413_v2_450x450.jpg',
      },
      {
        id: 11016,
        name: 'Alan Javier Franco',
        birth: '1996-10-11',
        country_id: 10001,
        image: 'https://portaldosaopaulino.com.br/wp-content/uploads/2023/02/457416CA-6C40-42FD-9864-3E88D753AC4A-819x1024.jpeg',
      },
      {
        id: 11017,
        name: 'David Corrêa da Fonseca',
        birth: '1995-10-17',
        country_id: 10000,
        image: 'https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2023/01/19/858881080-david-1.jpg',
      },
      {
        id: 11018,
        name: 'Jhegson Sebastián Méndez Carabalí',
        birth: '1997-04-26',
        country_id: 10003,
        image: 'https://www.lance.com.br/files/article_main/uploads/2023/01/19/63c9ea1ba189b.jpeg',
      },
      {
        id: 11019,
        name: 'Luan Vinícius da Silva Santos',
        birth: '1999-05-14',
        country_id: 10000,
        image: 'https://soutricolor.net/wp-content/uploads/1999/05/Luan-SPFC.jpg',
      },
      {
        id: 11020,
        name: 'Luis Manuel Orejuela García',
        birth: '1995-08-20',
        country_id: 10004,
        image: 'https://conteudo.imguol.com.br/c/esporte/3b/2021/05/2/orejuela-comemora-gol-do-sao-paulo-contra-o-rentistas-pela-libertadores-1620860700392_v2_1x1.jpg',
      },
      {
        id: 11021,
        name: 'Lucas Lopes Beraldo',
        birth: '2003-11-24',
        country_id: 10000,
        image: 'https://www.arqtricolor.com/wp-content/uploads/2021/07/210103152_797403657640580_7710886127371056561_n.jpg',
      },
    ]));
};
