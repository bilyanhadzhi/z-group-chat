const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const path = require('path');

const rootPath = path.join(__dirname, '../').slice(0, -1);
const dirs = {
  root: `${rootPath}/`,
  src: `${rootPath}/src`,
  build: `${rootPath}/build`,
  views: `${rootPath}/build/views`,
  partials: `${rootPath}/build/views/partials`,
  public: `${rootPath}/public`,
};

const app = express();

app.use(express.static(dirs.public));
app.use(session({ secret: 'mySecret', cookie: { maxAge: 60000 } }));
app.use(bodyParser.urlencoded({ extended: true }));

const hbs = handlebars.create({
  partialsDir: dirs.partials,
});

app.engine('html', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', dirs.views);

const routes = require('./routes')(app, dirs);

app.listen(process.env.PORT || 3000);
