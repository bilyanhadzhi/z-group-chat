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
        var promises = [];
        Member
            .findOne({ memberID: req.params.id })
            .lean()
            .exec()["catch"](function (err) { return console.error(err); })
            .then(function (member) {
            if (!member) {
                res.redirect('/');
            }
            var promises = [];
            promises.push(Message
                .find({ 'senderID': member.memberID })
                .count()
                .exec());
            promises.push(Message
                .find({ 'senderID': member.memberID, 'body': { '$ne': '' } })
                .select('body timestamp senderID')
                .sort({ 'timestamp': -1 })
                .exec());
            Promise.all(promises)
                .then(function (values) {
                var data = {
                    title: member.name,
                    loggedIn: req.session.loggedIn,
                    member: member
                };
                data.member.stats = {
                    numOfWords: 0,
                    numOfMessages: 0,
                    wordsPerMessage: 0,
                    mostActiveHours: [null, null]
                };
                data.member.stats.numOfMessages = values[0];
                data.member.stats.timeOfDayFrequency = {
                    labels: [
                        '00', '01', '02', '03', '04', '05',
                        '06', '07', '08', '09', '10', '11',
                        '12', '13', '14', '15', '16', '17',
                        '18', '19', '20', '21', '22', '23',
                    ],
                    values: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ]
                };
                var wordFrq = {};
                values[1].forEach(function (message) {
                    ++data.member.stats.timeOfDayFrequency.values[new Date(message.timestamp).getHours()];
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
                                ++data.member.stats.numOfWords;
                            });
                        }
                    }
                });
                data.member.stats.wordsPerMessage = Math.round(data.member.stats.numOfWords / data.member.stats.numOfMessages * 100) / 100;
                var numOfMessagesMAH = 0;
                for (var i = 0; i < data.member.stats.timeOfDayFrequency.values.length; ++i) {
                    if (data.member.stats.timeOfDayFrequency.values[i] > numOfMessagesMAH) {
                        numOfMessagesMAH = data.member.stats.timeOfDayFrequency.values[i];
                    }
                }
                data.member.stats.mostActiveHours[0] = data.member.stats.timeOfDayFrequency.values.indexOf(numOfMessagesMAH);
                data.member.stats.mostActiveHours[1] = (data.member.stats.mostActiveHours[0] + 1) % 24;
                res.render('member', data);
            });
        });
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
            msgLeaderboard: {
                labels: [],
                values: []
            },
            wordLeaderboard: {
                labels: [],
                values: []
            },
            wordFrequency: {
                labels: [],
                values: []
            },
            timeOfDayFrequency: {
                labels: [
                    '00', '01', '02', '03', '04', '05',
                    '06', '07', '08', '09', '10', '11',
                    '12', '13', '14', '15', '16', '17',
                    '18', '19', '20', '21', '22', '23',
                ],
                values: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            },
            monthFrequency: {
                labels: [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December',
                ],
                values: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            }
        };
        var promises = [];
        promises.push(Message
            .find({ 'body': { '$ne': '' } })
            .select('body timestamp senderID')
            .sort({ 'timestamp': -1 })
            .exec());
        Member
            .find({})
            .exec()["catch"](function (err) { return console.error(err); })
            .then(function (members) {
            var membersWordFrq = {};
            members.forEach(function (member) {
                membersWordFrq[member.memberID] = {};
                membersWordFrq[member.memberID].name = member.firstName;
                membersWordFrq[member.memberID].id = member.memberID;
                membersWordFrq[member.memberID].numOfWords = 0;
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
                    ++stats.timeOfDayFrequency.values[(new Date(message.timestamp).getUTCHours() + 2) % 24];
                    ++stats.monthFrequency.values[new Date(message.timestamp).getMonth()];
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
                                if (membersWordFrq[message.senderID]) {
                                    ++membersWordFrq[message.senderID].numOfWords;
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
                Object.keys(membersWordFrq)
                    .forEach(function (key) {
                    stats.wordLeaderboard.labels.push(membersWordFrq[key].name);
                    stats.wordLeaderboard.values.push(membersWordFrq[key].numOfWords);
                });
                members.forEach(function (member) { return stats.msgLeaderboard.labels.push(member.firstName); });
                values.forEach(function (value) { return stats.msgLeaderboard.values.push(value); });
                res.json(stats);
            });
        });
    });
};
