const mongoose = require('mongoose');

const bot = require('./bot');
const Message = require('./models/message');

const uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error: '));

database.once('open', () => {
  console.log('hey im in');

  bot.init();
});

module.exports = database;
