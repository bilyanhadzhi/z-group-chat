const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
  memberID: String,
  name: String,
  firstName: String,
  vanity: String,
  thumbSrc: String,
  profileUrl: String,
  gender: Number,
  isBirthday: Boolean,
});

const Member = mongoose.model('members', memberSchema);

module.exports = Member;
