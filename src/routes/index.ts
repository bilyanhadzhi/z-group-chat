const db = require('../db');
const bcrypt = require('bcrypt');

const Member = require('../db/models/member');
const Message = require('../db/models/message');

module.exports = (app: any, dirs: any) => {

  app.use((req: any, res: any, next: Function) => {
    const url = req.originalUrl;

    if (req.session.loggedIn) {
      url === '/auth' ? res.redirect('/') : next();
    } else {
      url !== '/auth' ? res.redirect('/auth') : next();
    }
  });

  app.get('/', (req: any, res: any) => {
    const data: any = {
      title: 'Home',
      loggedIn: req.session.loggedIn,
    };

    res.render('index', data);
  });

  app.get('/browse-chat', (req: any, res: any) => {
    const data: any = {
      title: 'Browse the chat',
      loggedIn: req.session.loggedIn,
      // messageCount: null,
    };

    // const lenPromise =
    //   Message
    //     .find()
    //     .count()
    //     .exec();

    // const messagesPromise =
    //   Message
    //     .find()
    //     .sort({ 'timestamp': -1 })
    //     .limit(50)
    //     .exec();

    // const promises = [lenPromise, messagesPromise];

    // Promise.all(promises)
    //   .then((values: any) => {
    //     data.messagesCount = values[0];
    //     data.messages = values[1].reverse();

    //   });
      res.render('browse-chat', data);
    });

  app.get('/auth', (req: any, res: any) => {
    res.render('auth', {title: 'Log in'});
  });

  app.post('/auth', (req: any, res: any) => {
    const hash = process.env.HASH;
    const password = req.body.password;

    bcrypt.compare(req.body.password, process.env.HASH, (err: any, correct: boolean) => {
      if (correct) {
        req.session.loggedIn = true;
        res.redirect('/');
      } else {
        res.redirect('/auth');
      }
    });
  });

  app.get('/log-out', (req: any, res: any) => {
    if (req.session.loggedIn) {
      req.session.loggedIn = false;
      res.redirect('/auth');
    }
  });

  // API
  app.get('/api/get-messages', (req: any, res: any) => {

    if (parseInt(req.query.amount) != req.query.amount) {
      res
        .status(422)
        .send({'error': 'amount must be a number'});
    }

    const params: any = {
      before: req.query.before,
      amount: parseInt(req.query.amount),
    };

    Message
      .find({'timestamp': { $lte: params.before }})
      .sort({'timestamp': -1})
      .limit(params.amount)
      .exec()
      .catch((err: any) => console.error(err))
      .then((messages: any) => {
        res.send(messages);
      });

  });
};
