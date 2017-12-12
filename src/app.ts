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
  layouts: `${rootPath}/build/views/layouts`,
  partials: `${rootPath}/build/views/partials`,
  public: `${rootPath}/public`,
};

const app = express();

app.use(express.static(dirs.public));
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 30 * 60000 },
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', handlebars({
  extname: '.html',
  defaultLayout: 'main',
  layoutsDir: dirs.layouts,
  partialsDir: dirs.partials,
  helpers: {
    section(name: any, options: any): null {
      if (!this._sections) {
        this._sections = {};
      }

      this._sections[name] = options.fn(this);

      return null;
    },
    if_text_message(msg: any, options: any): any {
      if (msg.type === 'message' && msg.body !== '') {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    if_has_gender(member: any, options: any): any {
      if (member.gender === 1 || member.gender === 2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    if_is_male(member: any, options: any): any {
      if (member.gender === 2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    convert_to_time(unixTimestamp: any, options: any): any {
      unixTimestamp = parseInt(unixTimestamp);

      const date = new Date(unixTimestamp);

      return `${date.toLocaleTimeString('bg-BG', { timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit' })}`;
    }
  }
}));

app.set('views', dirs.views);
app.set('view engine', 'html');

const routes = require('./routes')(app, dirs);

app.listen(process.env.PORT || 3000);
