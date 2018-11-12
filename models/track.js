/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

// mongoose.set('debug', true);

const Schema = mongoose.Schema;

const Track = new Schema({
  apiKey: String,
  time: Number,
  operator: String,
  localTime: String,
  localDate: String,
}, {
  timestamps: true,
});

const TrackModel = mongoose.model('Track', Track);

module.exports = TrackModel;
