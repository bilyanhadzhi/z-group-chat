var login = require("facebook-chat-api");
var jsonfile = require('jsonfile');
var credentials = {
    email: process.env.FB_EMAIL,
    password: process.env.FB_PASSWORD
};
login(credentials, function (err, api) {
    if (err) {
        return console.error(err);
    }
    var state = api.getAppState();
    jsonfile.writeFile(__dirname + "/state.json", state, { spaces: 2 }, function (err) {
        console.error(err);
    });
});
