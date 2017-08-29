var mongoose = require('mongoose');
var uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(uri);
var database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error: '));
database.once('open', function () {
    var shouldUseBot = process.env.NO_BOT.toLowerCase() !== 'true';
    if (shouldUseBot) {
        var bot_1 = require('./bot');
        bot_1.init();
    }
});
module.exports = database;
