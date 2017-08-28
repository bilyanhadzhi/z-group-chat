var login = require("facebook-chat-api");
var jsonfile = require('jsonfile');
var loginInfo = { appState: JSON.parse(process.env.FB_STATE) };
login(loginInfo, function (err, api) {
    if (err) {
        return console.error(err);
    }
    api.getThreadList(0, 2, function (err, list) {
        list.forEach(function (thread) { return console.log(thread.threadID); });
    });
});
