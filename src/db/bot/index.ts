const login = require('facebook-chat-api');
const Message = require('../models/message');

const loginInfo = {appState: JSON.parse(process.env.FB_STATE)};

const participantIDs: any = {
  '100000545900203': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/17426297_1547171205311061_1411686906099376379_n.jpg?oh=b44bfe2e5117b794fc014879e2f17dca&oe=5A76D900',
  '100000921515627': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/21685958_1784097994964234_8349448217944451008_n.jpg?oh=c32665c8b617496e1ed11c3561b72107&oe=5A3E820E',
  '100001255543983': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/11036626_966602733391569_8451093461269411965_n.jpg?oh=3ed1cc22abe81208d6f6ea6628cce265&oe=5A3D501A',
  '100000791752985': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/21740047_1449947751708269_7129974879223818109_n.jpg?oh=abd7bce1655d5ce170727101849febc8&oe=5A710E94',
  '100002165745435': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/22221875_1488099374605573_3318079829528086722_n.jpg?oh=0dc8f3c8cfaa31e2e75b422d5fa2825a&oe=5A7CD3B9',
  '100001914395387': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/21272514_1694254660648331_8840159438332353602_n.jpg?oh=ca5f19a469ee7c9c1cfe60350f7c44d9&oe=5A6ECE24',
  '100001441850679': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/16865158_1346143522110363_2399582359096078176_n.jpg?oh=726592783c945c7e67a40548757951a9&oe=5A705858',
  '100002397944323': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/c0.9.32.32/p32x32/15178977_1177507659005821_78477501171245126_n.jpg?oh=3f2b8a4bde27bad11ed7ea4fc4c0a5b2&oe=5A770C09',
  '100002328575245': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/16602995_1306924912728449_2516623880464769235_n.jpg?oh=96bab3ff63b70b2650906f0ebd9ca0d8&oe=5A80CE2A',
  '100003538747263': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/22090184_1273175239477089_7633292225703078464_n.jpg?oh=bca2d1c31caf85792759208e50483dc6&oe=5A70785A',
  '100003347242734': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/21617875_1445631322225095_1112575511703685747_n.jpg?oh=a93d4e880d59aad0687f7627959e6bc6&oe=5A7A8F2D',
  '100003521047837': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/19894578_1227555630705127_8992374882884777000_n.jpg?oh=08eb197067b7bad58a970b730ba251fb&oe=5A860437',
  '100004528962777': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/c9.0.32.32/p32x32/10645251_10150004552801937_4553731092814901385_n.jpg?oh=95afbae671e6c59cf956084ad14e740a&oe=5A6C7D26',
  '100003893351763': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/18814341_2389432774529811_930684219834954054_n.jpg?oh=d6579ed7fdb50d1ba1878568f90f9907&oe=5A8182F6',
  '100005719830564': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/c5.0.32.32/p32x32/10653478_278952072305452_1139619940379110100_n.jpg?oh=fc0851d0a7b8462aa8dfe5b0f7fc16b6&oe=5A7E1033',
  '100004103933218': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/12038428_759261334220657_3466331598137843022_n.jpg?oh=2ded10deb27e164d2ceefba1cf66aefa&oe=5A790BA9',
  '100007027441774': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/21430143_1920876661489897_6086053472046321428_n.jpg?oh=f7ed6dfc325c455edd64067e02e1a34d&oe=5A757899',
  '100008079644661': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/12096444_1645204762425496_305098697919399428_n.jpg?oh=8bed0ad4a7b4642c740fd22ccafaa9a4&oe=5A86B8DC',
  '100006969340636': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/13615053_1756729234569371_5479335402344860295_n.jpg?oh=ce18aa7832a204dd709b297b7eba8b74&oe=5A7337E4',
  '100008605898907': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/10629882_1414613275502189_24279809877953958_n.jpg?oh=05cb5bc67b57e0935a69dcdcb5440ff8&oe=5A83DD79',
  '100009666829261': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/c0.1.32.32/p32x32/17362681_449298252069065_9004882908955722714_n.jpg?oh=e492f7ce11ebac58d50823c4e6fa8d6a&oe=5A6E29F9',
  '100017538071180': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/20915647_142212453040023_8318717470684102737_n.jpg?oh=80b837785c6a6a02466326142c808e8d&oe=5A84A07D',
  '100000872904607': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/12063649_971100539595700_4731105284704985010_n.jpg?oh=ea49d8a8d3abdf89eef1f1bc0bf1ed5a&oe=5A704140',
  '100009779563554': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/c8.0.32.32/p32x32/13528943_297933620542621_7495091828161111717_n.jpg?oh=1c09af71e0c6ca07f23cb151e1474f9b&oe=5A7B2544',
  '100018364275725': 'https://scontent.fsof3-1.fna.fbcdn.net/v/t1.0-1/p32x32/21105919_128667684422040_7182370801210885063_n.jpg?oh=eae1fd6a1e3e4e55a2fb314cc49da3d9&oe=5A7EA6E9',
};

const bot: any = {
  threadID: '814129402005312',
  init(): void {
    login(loginInfo, (err: any, api: any) => {
      if (err) {
        return console.error(err);
      }

      this.api = api;
      this.api.setOptions({ selfListen: true });

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
          console.log(participantIDs[msg.senderID.toString()]);

          msg = new Message({
            type: msg.type,
            senderName: msg.senderName,
            senderID: msg.senderID,
            senderThumbSrc: participantIDs[msg.senderID.toString()],
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
    const self = this;

    Message
      .findOne()
      .sort({timestamp: -1})
      .exec((err: any, msg: any) => {

        console.log('Updating db...');
        console.log('Latest message: ', msg.body !== '' ? msg.body : '(it\'s an attachment)');

        const lastMsgTimestamp: number = msg.timestamp;
        const threadID: string = '814129402005312';
        let timestamp: any = undefined;

        const isInArray = (arr: any, message: any): boolean => {
          return arr.some((msgInArr: any) => {
            return msgInArr.timestamp === message.timestamp
                && msgInArr.body === message.body
                && msgInArr.senderID === message.senderID;
          });
        }

        let toInsert: Array<any> = [];
        const interval = setInterval(() => loadMessages(this.api), 5000);

        function loadMessages(api: any): void {
          api.getThreadHistory(threadID, 501, timestamp, (err: any, messages: any) => {
            if (timestamp != undefined) {
              messages.pop();
            }
            timestamp = messages[0].timestamp;

            messages.reverse();

            for (let message of messages) {
              if (message.timestamp > lastMsgTimestamp && !isInArray(toInsert, message)) {
                toInsert.unshift(new Message({
                  senderThumbSrc: participantIDs[message.senderID],
                  type: message.type,
                  senderName: message.senderName,
                  senderID: message.senderID,
                  body: message.body,
                  attachments: message.attachments,
                  timestamp: message.timestamp,
                  tags: message.tags,
                }));
              } else {
                console.log(`\nDone!`);

                if (toInsert.length > 0) {
                  console.log(`Messages exported: ${toInsert.length}\n`);
                } else {
                  console.log(`No messages were exported`);
                }

                clearInterval(interval);

                if (toInsert.length > 0) {
                  Message.insertMany(toInsert);
                }

                self.listen();
                break;
              }
            }

            console.log(`[Loop] ${toInsert.length} messages exported...`);
          });
        }

        loadMessages(this.api);
    });
  },
};

module.exports = bot;
