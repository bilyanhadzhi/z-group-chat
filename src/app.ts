const express = require('express');
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

const hbs = handlebars.create({
  partialsDir: dirs.partials,
});

app.engine('html', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', dirs.views);

app.use(express.static(dirs.public));

const routes = require('./routes')(app, dirs);

app.listen(process.env.PORT || 3000);
