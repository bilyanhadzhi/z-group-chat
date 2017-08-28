const login = require("facebook-chat-api");
const jsonfile = require('jsonfile');

const credentials: Object = {
  email: process.env.FB_EMAIL,
  password: process.env.FB_PASSWORD,
};

login(credentials, (err: any, api: any) => {
  if (err) {
    return console.error(err);
  }

  const state = api.getAppState();

  jsonfile.writeFile(`${__dirname}/state.json`, state, {spaces: 2}, (err: any) => {
    console.error(err);
  });
});


// jsonfile.readFile(file, (err: any, data: any) => {
//   const toInsert: Array<any> = [];

//   data.forEach((msg: any) => {
//     toInsert.push(new Message({
//       type: msg.type,
//       senderName: msg.senderName,
//       senderID: msg.senderID,
//       body: msg.body,
//       attachments: msg.attachments,
//       timestamp: msg.timestamp,
//       tags: msg.tags,
//     }));
//   });

//   Message.insertMany(toInsert);
// });
