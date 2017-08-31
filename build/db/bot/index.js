var login = require('facebook-chat-api');
var Message = require('../models/message');
var loginInfo = { appState: JSON.parse(process.env.FB_STATE) };
var bot = {
    threadID: '814129402005312',
    init: function () {
        var _this = this;
        login(loginInfo, function (err, api) {
            if (err) {
                return console.error(err);
            }
            _this.api = api;
            _this.update();
        });
    },
    listen: function () {
        var _this = this;
        var newMsgs = [];
        this.api.listen(function (err, message) {
            if (message.threadID === _this.threadID) {
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
        var _this = this;
        Message
            .findOne()
            .sort({ timestamp: -1 })
            .exec(function (err, msg) {
            console.log(msg.body);
            _this.api.getThreadHistory(_this.threadID, 50, undefined, function (err, messages) {
                if (messages[messages.length - 1].timestamp !== msg.timestamp) {
                    var newMsgs = [];
                    messages = messages.reverse();
                    for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                        var message = messages_1[_i];
                        if (message.timestamp <= msg.timestamp) {
                            break;
                        }
                        else {
                            newMsgs.push(new Message({
                                type: message.type,
                                senderName: message.senderName,
                                senderID: message.senderID,
                                body: message.body,
                                attachments: message.attachments,
                                timestamp: message.timestamp,
                                tags: message.tags
                            }));
                        }
                    }
                    newMsgs = newMsgs.reverse();
                    Message.insertMany(newMsgs);
                    _this.listen();
                }
                else {
                    console.log('no new messages');
                    _this.listen();
                }
            });
        });
    }
};
module.exports = bot;
