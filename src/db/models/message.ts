const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  type: String,
  senderName: String,
  senderID: String,
  senderThumbSrc: String,
  body: String,
  attachments: Array,
  timestamp: Number,
  tags: Array,
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
