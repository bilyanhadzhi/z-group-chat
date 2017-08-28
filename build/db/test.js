var login = require("facebook-chat-api");
var jsonfile = require('jsonfile');
var loginInfo = { appState: JSON.parse(process.env.FB_STATE) };
login(loginInfo, function (err, api) {
    if (err) {
        return console.error(err);
    }
    var state = api.getAppState();
    jsonfile.writeFile(__dirname + "/state.json", state, function (err) {
        console.error(err);
    });
});
