var login = require('facebook-chat-api');
var Message = require('./models/message');
var state = { appState: require('./state.json') };
var bot = {
    init: function () {
        var self = this;
        login(state, function (err, api) {
            if (err) {
                return console.error(err);
            }
            self.api = api;
            self.listen();
        });
    },
    listen: function () {
        var newMsgs = [];
        this.api.listen(function (err, message) {
            if (message.threadID === 814129402005312) {
                newMsgs.push(message);
            }
        });
        var interval = setInterval(function () {
            if (newMsgs.length !== 0) {
                newMsgs.forEach(function (msg) {
                    msg = new Message({
                        type: msg.type,
                        senderName: msg.senderName,
                        senderID: msg.senderID,
                        body: msg.body,
                        attachments: msg.attachments,
                        timestamp: msg.timestamp,
                        tags: msg.tags
                    });
                });
                Message.insertMany(newMsgs);
                var dateTime = new Date().toLocaleString();
                console.log(dateTime + ": got " + newMsgs.length + " messages");
                newMsgs = [];
            }
            else {
                var dateTime = new Date().toLocaleString();
                console.log(dateTime + ": no messages");
            }
        }, 60000);
    },
    update: function () {
    }
};
module.exports = bot;
