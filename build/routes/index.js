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
            title: 'Home',
            loggedIn: req.session.loggedIn,
            messageCount: null
        };
        var lenPromise = Message
            .find()
            .count()
            .exec();
        var messagesPromise = Message
            .find()
            .sort({ 'timestamp': -1 })
            .limit(50)
            .exec();
        var promises = [lenPromise, messagesPromise];
        Promise.all(promises)
            .then(function (values) {
            data.messagesCount = values[0];
            data.messages = values[1].reverse();
            res.render('browse-chat', data);
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
        var params = {
            from: req.body['from'],
            to: req.body['to'],
            messageCount: req.body['message-count']
        };
        res.send(params);
    });
};
