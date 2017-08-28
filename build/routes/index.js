var db = require('../db');
var passport = require('passport');
module.exports = function (app, dirs) {
    app.get('/', function (req, response) {
        response.render('index.html');
    });
};
