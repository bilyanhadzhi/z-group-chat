const login = require("facebook-chat-api");
const jsonfile = require('jsonfile');

const loginInfo = {appState: JSON.parse(process.env.FB_STATE)};

login(loginInfo, (err: any, api: any) => {
  if (err) {
    return console.error(err);
  }

  api.getThreadList(0, 2, (err: any, list: any) => {
    list.forEach((thread: any) => console.log(thread.threadID));
  });

});

// const state = api.getAppState();

// jsonfile.writeFile(`${__dirname}/state.json`, state, (err: any) => {
//   console.error(err);
// });

// ------- //

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
