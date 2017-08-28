var express = require('express');
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
var hbs = handlebars.create({
    partialsDir: dirs.partials
});
app.engine('html', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', dirs.views);
app.use(express.static(dirs.public));
var routes = require('./routes')(app, dirs);
app.listen(process.env.PORT || 3000);
