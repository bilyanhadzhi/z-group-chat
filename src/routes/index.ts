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
    };

    res.render('browse-chat', data);
  });

  app.get('/members', (req: any, res: any) => {
    const data: any = {
      title: 'Members',
      loggedIn: req.session.loggedIn,
    };

    Member
    .find({})
    .exec()
    .catch((err: any) => console.error(err))
    .then((members: any) => {
        const promises: Array<any> = [];

        members.forEach((member: any) => {
          promises.push(
            Message
              .find({'senderID': member.memberID})
              .count()
              .exec()
            );
        });

        Promise.all(promises)
          .then((values: any) => {
            for (let i = 0; i < values.length; ++i) {
              members[i].numOfMessages = values[i];
            }

            data.members = members;
            res.render('members', data);
          });
      });
  });

  app.get('/members/:id', (req: any, res: any) => {
    Member
      .findOne({memberID: req.params.id})
      .lean()
      .exec()
      .catch((err: any) => console.error(err))
      .then((member: any) => {
        console.log(member);
        const data: any = {
          title: '',
          loggedIn: req.session.loggedIn,
          member: member,
        };

        res.render('member', data);
      });
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

    if (req.query.amount && parseInt(req.query.amount) != req.query.amount) {
      res
        .status(422)
        .send({'error': 'amount must be a number'});
    }

    const after = req.query.after ? parseInt(req.query.after) : null;
    const upTo = req.query.up_to ? parseInt(req.query.up_to) : new Date().getTime();
    let amount = null;

    if (parseInt(req.query.amount) != req.query.amount) {
      amount = 50;
    } else if (parseInt(req.query.amount) < 1) {
      res.send([]);
    } else if (parseInt(req.query.amount) > 50) {
      amount = 50;
    }

    const params: any = {
      upTo: upTo,
      after: after,
      amount: amount,
    };

    console.log(params);

    if (params.after) {
      Message
      .find({'timestamp': { '$gt': params.after }})
      .sort({'timestamp': -1})
      .limit(params.amount)
      .exec()
      .catch((err: any) => console.error(err))
      .then((messages: any) => {
        res.send(messages);
      });
    } else {
      Message
        .find({'timestamp': { '$lte': params.upTo }})
        .sort({'timestamp': -1})
        .limit(params.amount)
        .exec()
        .catch((err: any) => console.error(err))
        .then((messages: any) => {
          res.send(messages);
        });
    }
  });

  app.get('/api/stats', (req: any, res: any) => {
    let stats: any = {
      msgLeaderboard: {
        labels: [],
        values: [],
      },
      wordLeaderboard: {
        labels: [],
        values: [],
      },
      wordFrequency: {
        labels: [],
        values: [],
      },
      timeOfDayFrequency: {
        labels: [
          '00', '01', '02', '03', '04', '05',
          '06', '07', '08', '09', '10', '11',
          '12', '13', '14', '15', '16', '17',
          '18', '19', '20', '21', '22', '23',
        ],
        values: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      },
    };

    const promises: Array<Promise<any>> = [];

    promises.push(
      Message
        .find({'body': {'$ne': ''}})
        .select('body timestamp senderID')
        .sort({'timestamp': -1})
        // .limit(500)
        .exec()
    );

    Member
      .find({})
      .exec()
      .catch((err: any) => console.error(err))
      .then((members: any) => {

        const membersWordFrq: any = {};

        members.forEach((member: any) => {
          membersWordFrq[member.memberID] = {};
          membersWordFrq[member.memberID].name = member.firstName;
          membersWordFrq[member.memberID].id = member.memberID;
          membersWordFrq[member.memberID].numOfWords = 0;

          promises.push(
            Message
              .find({'senderID': member.memberID})
              .count()
              .exec()
            );
        });


        Promise.all(promises)
          .then((values: any) => {
            const messages = values.shift();

            const wordFrq: any = {};

            messages.forEach((message: any) => {
              ++stats.timeOfDayFrequency.values[new Date(message.timestamp).getHours()];

              if (message.body) {
                const words = message.body.toLowerCase().match(/(\w+|[а-яА-Я]+)/g);

                if (words) {
                  words.forEach((word: any) => {
                    if (wordFrq[word]) {
                      ++wordFrq[word];
                    } else {
                      wordFrq[word] = 1;
                    }

                    if (membersWordFrq[message.senderID]) {
                      ++membersWordFrq[message.senderID].numOfWords;
                    }
                  });
                }
              }
            });

            Object.keys(wordFrq)
              .forEach((key: any) => {
                stats.wordFrequency.labels.push(key);
                stats.wordFrequency.values.push(wordFrq[key]);
              });

            Object.keys(membersWordFrq)
              .forEach((key: any) => {
                stats.wordLeaderboard.labels.push(membersWordFrq[key].name);
                stats.wordLeaderboard.values.push(membersWordFrq[key].numOfWords);
              });

            members.forEach((member: any) => stats.msgLeaderboard.labels.push(member.firstName));
            values.forEach((value: any) => stats.msgLeaderboard.values.push(value));

            res.json(stats);
          });
      });
  });
};
