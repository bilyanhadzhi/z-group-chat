const db = require('../db');
const bcrypt = require('bcrypt');

module.exports = (app: any, dirs: any) => {

  app.use((req: any, res: any, next: any) => {
    const url = req.originalUrl;

    if (req.session.loggedIn) {
      url === '/auth' ? res.redirect('/') : next();
    } else {
      url !== '/auth' ? res.redirect('/auth') : next();
    }
  });

  app.get('/', (req: any, res: any) => {
    res.send('hallo');
  });

  app.get('/auth', (req: any, res: any) => {
    res.render('auth.html');
  });
  app.post('/auth', (req: any, res: any) => {
    bcrypt.compare(req.body.password, process.env.HASH, (err: any, result: boolean) => {
      if (result === true) {
        req.session.loggedIn = true;
        res.redirect('/');
      } else {
        res.redirect('/auth');
      }
    });
  });
};
