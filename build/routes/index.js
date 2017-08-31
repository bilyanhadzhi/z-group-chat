var db = require('../db');
var passport = require('passport');
module.exports = function (app, dirs) {
    app.get('/auth', function (req, res) {
        res.render('auth.html');
    });
    app.post('/auth', function (req, res) {
        res.redirect('/auth');
    });
};
