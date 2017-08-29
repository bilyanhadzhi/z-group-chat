const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error: '));

database.once('open', () => {
  const shouldUseBot = process.env.NO_BOT.toLowerCase() !== 'true';

  if (shouldUseBot) {
    const bot = require('./bot');

    bot.init();
  }
});

module.exports = database;
