var mongoose = require('mongoose');
var memberSchema = mongoose.Schema({
    memberID: String,
    name: String,
    firstName: String,
    vanity: String,
    thumbSrc: String,
    profileUrl: String,
    gender: Number,
    isBirthday: Boolean
});
var Member = mongoose.model('members', memberSchema);
module.exports = Member;
