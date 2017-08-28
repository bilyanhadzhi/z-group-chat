const db = require('../db');
const passport = require('passport');

module.exports = (app: any, dirs: any) => {
  app.get('/', (req: any, response: any) => {
    response.render('index.html');
  });
};
