const db = require('../db');
const passport = require('passport');

module.exports = (app: any, dirs: any) => {
  app.get('/auth', (req: any, res: any) => {
    res.render('auth.html');
  });
  app.post('/auth', (req: any, res: any) => {
    res.redirect('/auth');
  });
};
