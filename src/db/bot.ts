const login = require('facebook-chat-api');
const Message = require('./models/message');

const state = {appState: require('./state.json')};

const bot: any = {
  init(): void {
    const self = this;

    login(state, (err: any, api: any) => {
      if (err) {
        return console.error(err);
      }

      self.api = api;
      self.listen();
    });
  },
  listen(): void {
    let newMsgs: any = [];

    this.api.listen((err: any, message: any) => {
      if (message.threadID === 814129402005312) {
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
  update() {

  },
};

module.exports = bot;
