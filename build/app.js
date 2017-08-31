var express = require('express');
var session = require('express-session');
var handlebars = require('express-handlebars');
var path = require('path');
var rootPath = path.join(__dirname, '../').slice(0, -1);
var dirs = {
    root: rootPath + "/",
    src: rootPath + "/src",
    build: rootPath + "/build",
    views: rootPath + "/build/views",
    partials: rootPath + "/build/views/partials",
    public: rootPath + "/public"
};
var app = express();
app.use(express.static(dirs.public));
app.use(session({ secret: 'mySecret', cookie: { maxAge: 60000 } }));
var hbs = handlebars.create({
    partialsDir: dirs.partials
});
app.engine('html', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', dirs.views);
var routes = require('./routes')(app, dirs);
app.listen(process.env.PORT || 3000);
