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
        res.send('hallo');
    });
    app.get('/auth', function (req, res) {
        res.render('auth.html');
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
};
