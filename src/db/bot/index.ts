const login = require('facebook-chat-api');
const Message = require('../models/message');

const loginInfo = {appState: JSON.parse(process.env.FB_STATE)};

const bot: any = {
  threadID: '814129402005312',
  init(): void {
    login(loginInfo, (err: any, api: any) => {
      if (err) {
        return console.error(err);
      }

      this.api = api;
      this.update();
    });
  },
  listen(): void {
    let newMsgs: any = [];

    this.api.listen((err: any, message: any) => {
      if (message.threadID === this.threadID) {
        newMsgs.push(message);
      }
    });

    const interval = setInterval(() => {
      if (newMsgs.length !== 0) {
        newMsgs.forEach((msg: any) => {
          msg = new Message({
            type: msg.type,
            senderName: msg.senderName,
            senderID: msg.senderID,
            body: msg.body,
            attachments: msg.attachments,
            timestamp: msg.timestamp,
            tags: msg.tags,
          });
        });

        Message.insertMany(newMsgs);

        const dateTime = new Date().toLocaleString();
        console.log(`${dateTime}: got ${newMsgs.length} messages`);
        newMsgs = [];
      } else {
        const dateTime = new Date().toLocaleString();
        console.log(`${dateTime}: no messages`);
      }
    }, 60000);
  },
  update(): void {
    Message
      .findOne()
      .sort({timestamp: -1})
      .exec((err: any, msg: any) => {

        console.log(msg.body);

        this.api.getThreadHistory(this.threadID, 50, undefined, (err: any, messages: any) => {
          if (messages[messages.length - 1].timestamp !== msg.timestamp) {
            let newMsgs: any = [];

            messages = messages.reverse();

            for (let message of messages) {
              if (message.timestamp <= msg.timestamp) {
                break;
              } else {
                newMsgs.push(new Message({
                  type: message.type,
                  senderName: message.senderName,
                  senderID: message.senderID,
                  body: message.body,
                  attachments: message.attachments,
                  timestamp: message.timestamp,
                  tags: message.tags,
                }));
              }
            }

            newMsgs = newMsgs.reverse();
            Message.insertMany(newMsgs);

            this.listen();
          } else {
            console.log('no new messages');
            this.listen();
          }
        });
    });
  },
};

module.exports = bot;
