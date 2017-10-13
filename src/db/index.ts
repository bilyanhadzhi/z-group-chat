const mongoose = require('mongoose');
const Member = require('./models/member');
const Message = require('./models/message');

const uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error: '));

database.once('open', () => {
  const shouldUseBot = process.env.NO_BOT !== 'true';

  if (shouldUseBot) {
    const bot = require('./bot');

    bot.init();
  }

  const participantIDs: any = {
    '100000545900203': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/17426297_1547171205311061_1411686906099376379_n.jpg?oh=c06161e8f33919da5690488b3446f1b8&oe=5A4F4C00',
    '100000791752985': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/14519717_1123910227645358_7936452822207951761_n.jpg?oh=acc0a68edcbef0ffe335f7c41c910471&oe=5A16E9D4',
    '100000921515627': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/16299424_1499947106712659_2358816620760168483_n.jpg?oh=05fbc58db18fc27d83f979bf8cfc1197&oe=5A5C7BF2',
    '100001255543983': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/11036626_966602733391569_8451093461269411965_n.jpg?oh=61258efe91de53b37a0bef588ab9b3cf&oe=5A15C31A',
    '100001441850679': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/16865158_1346143522110363_2399582359096078176_n.jpg?oh=b1ebd8e78572fe7a728e5251bbdf0170&oe=5A213E58',
    '100001914395387': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/21272514_1694254660648331_8840159438332353602_n.jpg?oh=05bc956a3a8912d85595525dae04dd61&oe=5A1FB424',
    '100002165745435': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/16729571_1248278538587659_5901532462274382022_n.jpg?oh=cb48ee3e6f23dacbfe160f07effb70af&oe=5A210CD8',
    '100002328575245': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/16602995_1306924912728449_2516623880464769235_n.jpg?oh=0599d392076c884a1e29fc9b5f91239d&oe=5A59412A',
    '100002397944323': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/c0.9.32.32/p32x32/15178977_1177507659005821_78477501171245126_n.jpg?oh=591e66b01f16f492e55949ab0957c731&oe=5A4F7F09',
    '100003347242734': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/21034597_1427429874045240_5987699051795740955_n.jpg?oh=2133aaf0ebb123e5163719015ed5ca60&oe=5A4A7FE7',
    '100003521047837': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/19894578_1227555630705127_8992374882884777000_n.jpg?oh=5d959cf6a1fc5d78d9d71136a005c9e2&oe=5A5E7737',
    '100003538747263': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/c0.1.32.32/p32x32/13886959_898744603586823_2052464845470549283_n.jpg?oh=8d56127ad825f9bb617ee46433a65c6c&oe=5A5B2387',
    '100003893351763': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/18814341_2389432774529811_930684219834954054_n.jpg?oh=018831ad3ea774a6a970a5b06ad16c6f&oe=5A59F5F6',
    '100004103933218': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/12038428_759261334220657_3466331598137843022_n.jpg?oh=aaab6b94b5765cedbb3c6408c8804003&oe=5A517EA9',
    '100004528962777': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/c9.0.32.32/p32x32/10645251_10150004552801937_4553731092814901385_n.jpg?oh=f9e10a21654a4721711b3ec567e2302a&oe=5A1D6326',
    '100005719830564': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/c5.0.32.32/p32x32/10653478_278952072305452_1139619940379110100_n.jpg?oh=ab4c446b8ea9aeb116080d47a3af0c25&oe=5A568333',
    '100006969340636': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/13615053_1756729234569371_5479335402344860295_n.jpg?oh=f13f905493b07019e5590389ae0271a3&oe=5A4BAAE4',
    '100007027441774': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/20228405_1901933610050869_5945852515971805317_n.jpg?oh=5b065e8cb4ae49d4034acc79fd1c1fa6&oe=5A12B840',
    '100008079644661': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/12096444_1645204762425496_305098697919399428_n.jpg?oh=ad9210cb92fe8c4f8d6229adcff75256&oe=5A5F2BDC',
    '100008605898907': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/10629882_1414613275502189_24279809877953958_n.jpg?oh=b621099b32c8ca033890dd06b7683bcd&oe=5A5C5079',
    '100009666829261': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/c0.1.32.32/p32x32/17362681_449298252069065_9004882908955722714_n.jpg?oh=7aa0b927002d16770664f900fd1fcf0f&oe=5A1F0FF9',
    '100009779563554': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/c8.0.32.32/p32x32/13528943_297933620542621_7495091828161111717_n.jpg?oh=f38e3c0eb852f28f941cf42fa00d93e4&oe=5A539844',
    '100017538071180': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/20915647_142212453040023_8318717470684102737_n.jpg?oh=aaf099ab5eac55a35f1e2719ada009b1&oe=5A5D137D',
    '100018364275725': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/21105919_128667684422040_7182370801210885063_n.jpg?oh=9b0d67bc712684aa56b3a8fd1d2bf73d&oe=5A5719E9',
    '100000872904607': 'https://scontent-frt3-2.xx.fbcdn.net/v/t1.0-1/p32x32/12063649_971100539595700_4731105284704985010_n.jpg?oh=17b638e16b931dcaccd1a1cc9d2a6d2a&oe=5A212740'
  };

  setInterval(() => {
    Object.keys(participantIDs).forEach((key: any) => {
      Message
        .updateMany({'senderID': key},
          {$set: {'senderThumbSrc': participantIDs[key]}})
        .exec();
    });
  }, 60 * 1000);

  // --- --- --- //
  // --- --- --- //

  // const login: any = require('facebook-chat-api');
  // const loginInfo: any = {appState: JSON.parse(process.env.FB_STATE)};

  // const lastMsgTimestamp: number = 1503845873204;
  // const threadID: string = '814129402005312';
  // let timestamp: any = undefined;

  // const isInArray = (arr: any, message: any): boolean => {
  //   return arr.some((msgInArr: any) => {
  //     return msgInArr.timestamp === message.timestamp
  //         && msgInArr.body === message.body
  //         && msgInArr.senderID === message.senderID;
  //   });
  // }

  // let toInsert: Array<any> = [];

  // login(loginInfo, (err: any, api: any) => {
  //   if (err) console.error(err);

  //   const interval = setInterval(() => loadMessages(api), 5000);

  //   function loadMessages(api: any): void {

  //     api.getThreadHistoryGraphQL(threadID, 51, timestamp, (err: any, messages: any) => {
  //       if (timestamp != undefined) {
  //         messages.pop();
  //       }
  //       timestamp = messages[0].timestamp;

  //       messages
  //         .reverse()
  //         .forEach((message: any) => {
  //           if (message.timestamp > lastMsgTimestamp && !isInArray(toInsert, message)) {
  //             toInsert.unshift(new Message({
  //               senderThumbSrc: participantIDs[message.senderID],
  //               type: message.type,
  //               senderName: message.senderName,
  //               senderID: message.senderID,
  //               body: message.body,
  //               attachments: message.attachments,
  //               timestamp: message.timestamp,
  //               tags: message.tags,
  //             }));
  //           } else {
  //             console.log('\n\nDone!\n');
  //             console.log('Last message:', message.body);

  //             clearInterval(interval);

  //             Message.insertMany(toInsert);
  //           }
  //         });

  //       console.log(`${toInsert.length} messages exported...`);
  //       // toInsert.forEach(msg => console.log(msg.body !== '' ? msg.body : '(pic)'))
  //       // console.log('\n\n');
  //     });
  //   }

  //   loadMessages(api);
  // });
});

module.exports = database;
