var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
    type: String,
    senderName: String,
    senderID: String,
    body: String,
    attachments: Array,
    timestamp: Number,
    tags: Array
});
var Message = mongoose.model('messages', messageSchema);
module.exports = Message;
