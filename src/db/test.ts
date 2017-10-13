const login = require('facebook-chat-api');
const jsonfile = require('jsonfile');

const Member = require('./models/member');

const loginInfo = {appState: JSON.parse(process.env.FB_STATE)};

login(loginInfo, (err: any, api: any) => {
  if (err) {
    return console.error(err);
  }

  const participantIDs: any = [
    100000545900203,
    100000791752985,
    100000921515627,
    100001255543983,
    100001441850679,
    100001914395387,
    100002165745435,
    100002328575245,
    100002397944323,
    100003347242734,
    100003521047837,
    100003538747263,
    100003893351763,
    100004103933218,
    100004528962777,
    100005719830564,
    100006969340636,
    100007027441774,
    100008079644661,
    100008605898907,
    100009666829261,
    100009779563554,
    100017538071180,
    100018364275725,
    100000872904607,
  ];

  let toInsert: Array<any> = [];
});

// const state = api.getAppState();

// jsonfile.writeFile(`${__dirname}/state.json`, state, (err: any) => {
//   console.error(err);
// });

// ------- //

// const file = `${__dirname}/messages.json`;
// const jsonfile = require('jsonfile');

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
