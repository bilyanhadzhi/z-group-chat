var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var handlebars = require('express-handlebars');
var path = require('path');
var rootPath = path.join(__dirname, '../').slice(0, -1);
var dirs = {
    root: rootPath + "/",
    src: rootPath + "/src",
    build: rootPath + "/build",
    views: rootPath + "/build/views",
    layouts: rootPath + "/build/views/layouts",
    partials: rootPath + "/build/views/partials",
    public: rootPath + "/public"
};
var app = express();
app.use(express.static(dirs.public));
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 30 * 60000 }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', handlebars({
    extname: '.html',
    defaultLayout: 'main',
    layoutsDir: dirs.layouts,
    partialsDir: dirs.partials,
    helpers: {
        section: function (name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        },
        if_text_message: function (msg, options) {
            if (msg.type === 'message' && msg.body !== '') {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        },
        if_has_gender: function (member, options) {
            if (member.gender === 1 || member.gender === 2) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        },
        if_is_male: function (member, options) {
            if (member.gender === 2) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        },
        convert_to_time: function (unixTimestamp, options) {
            unixTimestamp = parseInt(unixTimestamp);
            var date = new Date(unixTimestamp);
            return "" + date.toLocaleTimeString('bg-BG', { timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit' });
        }
    }
}));
app.set('views', dirs.views);
app.set('view engine', 'html');
var routes = require('./routes')(app, dirs);
app.listen(process.env.PORT || 3000);
