var db = require('../db');
var bcrypt = require('bcrypt');
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
        var options = {
            title: 'Home',
            loggedIn: req.session.loggedIn
        };
        res.render('index', options);
    });
    app.get('/auth', function (req, res) {
        res.render('auth', { title: 'Log in' });
    });
    app.post('/auth', function (req, res) {
        bcrypt.compare(req.body.password, process.env.HASH, function (err, result) {
            if (result === true) {
                req.session.loggedIn = true;
                res.redirect('/');
            }
            else {
                res.redirect('/auth');
            }
        });
    });
    app.get('/log_out', function (req, res) {
        if (req.session.loggedIn) {
            req.session.loggedIn = false;
            res.redirect('/auth');
        }
    });
};
