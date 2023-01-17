const request = require('supertest');

const app = require('../src/app');

test('Devo conseguir acessar a raiz', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toBe('Vamos São Paulo! Vamo São Paulo! Vamos ser <b>C-A-M-P-E-Ã-O</b>!');
    });
});
