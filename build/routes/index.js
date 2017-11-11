var db = require('../db');
var bcrypt = require('bcrypt');
var Member = require('../db/models/member');
var Message = require('../db/models/message');
module.exports = function (app, dirs) {
    app.use(function (req, res, next) {
        var url = req.originalUrl;
        if (req.session.loggedIn) {
            url === '/auth' ? res.redirect('/') : next();
        }
        else {
            url !== '/auth' ? res.redirect('/auth') : next();
        }
    });
    app.get('/', function (req, res) {
        var data = {
            title: 'Home',
            loggedIn: req.session.loggedIn
        };
        res.render('index', data);
    });
    app.get('/browse-chat', function (req, res) {
        var data = {
            title: 'Browse the chat',
            loggedIn: req.session.loggedIn
        };
        res.render('browse-chat', data);
    });
    app.get('/members', function (req, res) {
        var data = {
            title: 'Members',
            loggedIn: req.session.loggedIn
        };
        Member
            .find({})
            .exec()["catch"](function (err) { return console.error(err); })
            .then(function (members) {
            var promises = [];
            members.forEach(function (member) {
                promises.push(Message
                    .find({ 'senderID': member.memberID })
                    .count()
                    .exec());
            });
            Promise.all(promises)
                .then(function (values) {
                for (var i = 0; i < values.length; ++i) {
                    members[i].numOfMessages = values[i];
                }
                data.members = members;
                res.render('members', data);
            });
        });
    });
    app.get('/members/:id', function (req, res) {
        var data = {
            title: '',
            loggedIn: req.session.loggedIn
        };
        res.render('member', data);
    });
    app.get('/auth', function (req, res) {
        res.render('auth', { title: 'Log in' });
    });
    app.post('/auth', function (req, res) {
        var hash = process.env.HASH;
        var password = req.body.password;
        bcrypt.compare(req.body.password, process.env.HASH, function (err, correct) {
            if (correct) {
                req.session.loggedIn = true;
                res.redirect('/');
            }
            else {
                res.redirect('/auth');
            }
        });
    });
    app.get('/log-out', function (req, res) {
        if (req.session.loggedIn) {
            req.session.loggedIn = false;
            res.redirect('/auth');
        }
    });
    app.get('/api/get-messages', function (req, res) {
        if (req.query.amount && parseInt(req.query.amount) != req.query.amount) {
            res
                .status(422)
                .send({ 'error': 'amount must be a number' });
        }
        var after = req.query.after ? parseInt(req.query.after) : null;
        var upTo = req.query.up_to ? parseInt(req.query.up_to) : new Date().getTime();
        var amount = null;
        if (parseInt(req.query.amount) != req.query.amount) {
            amount = 50;
        }
        else if (parseInt(req.query.amount) < 1) {
            res.send([]);
        }
        else if (parseInt(req.query.amount) > 50) {
            amount = 50;
        }
        var params = {
            upTo: upTo,
            after: after,
            amount: amount
        };
        console.log(params);
        if (params.after) {
            Message
                .find({ 'timestamp': { '$gt': params.after } })
                .sort({ 'timestamp': -1 })
                .limit(params.amount)
                .exec()["catch"](function (err) { return console.error(err); })
                .then(function (messages) {
                res.send(messages);
            });
        }
        else {
            Message
                .find({ 'timestamp': { '$lte': params.upTo } })
                .sort({ 'timestamp': -1 })
                .limit(params.amount)
                .exec()["catch"](function (err) { return console.error(err); })
                .then(function (messages) {
                res.send(messages);
            });
        }
    });
    app.get('/api/stats', function (req, res) {
        var stats = {
            leaderboard: {
                labels: [],
                values: []
            },
            wordFrequency: {
                labels: [],
                values: []
            }
        };
        var promises = [];
        promises.push(Message
            .find({ 'body': { '$ne': '' } })
            .select('body')
            .sort({ 'timestamp': -1 })
            .exec());
        Member
            .find({})
            .exec()["catch"](function (err) { return console.error(err); })
            .then(function (members) {
            members.forEach(function (member) {
                promises.push(Message
                    .find({ 'senderID': member.memberID })
                    .count()
                    .exec());
            });
            Promise.all(promises)
                .then(function (values) {
                var messages = values.shift();
                var wordFrq = {};
                messages.forEach(function (message) {
                    if (message.body) {
                        var words = message.body.toLowerCase().match(/(\w+|[а-яА-Я]+)/g);
                        if (words) {
                            words.forEach(function (word) {
                                if (wordFrq[word]) {
                                    ++wordFrq[word];
                                }
                                else {
                                    wordFrq[word] = 1;
                                }
                            });
                        }
                    }
                });
                Object.keys(wordFrq)
                    .forEach(function (key) {
                    stats.wordFrequency.labels.push(key);
                    stats.wordFrequency.values.push(wordFrq[key]);
                });
                members.forEach(function (member) { return stats.leaderboard.labels.push(member.firstName); });
                values.forEach(function (value) { return stats.leaderboard.values.push(value); });
                res.json(stats);
            });
        });
    });
};
