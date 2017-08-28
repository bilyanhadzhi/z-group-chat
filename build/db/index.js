var mongoose = require('mongoose');
var bot = require('./bot');
var Message = require('./models/message');
var uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(uri);
var database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error: '));
database.once('open', function () {
    console.log('hey im in');
    bot.init();
});
module.exports = database;
