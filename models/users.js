require('dotenv').config();

const mongoose = require('mongoose');
const config = require('../config/mongodb');

mongoose.connect(config.database, { useNewUrlParser: true });
// const { Schema } = mongoose.Schema;
// const bcrypt = require('bcrypt-nodejs');

// const salt = process.env.SRV_SALT;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  yandexID: {
    type: Number,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    // required: true,
  },
  organization: {
    type: String,
    // required: true,
  },
  token: {
    type: String,
    // required: true,
  },
  base: String,
  apikey: String,
});

// UserSchema.pre('save', () => {
//   const user = this;
//   // hash the password using our new salt
//   bcrypt.hash(user.password, salt, (err, hash) => {
//     if (err) { console.log(err); } else {
//       next();
//     }
//   });
// });

// UserSchema.methods.verifyPassword = function (password, cb) {
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

// Export the Mongoose model

module.exports = mongoose.model('User', UserSchema);
