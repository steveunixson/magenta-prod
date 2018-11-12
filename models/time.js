/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const config = require('../config/mongodb');

mongoose.connect(config.database, { useNewUrlParser: true });

const Schema = mongoose.Schema;

const Time = new Schema({
  apiKey: String,
  start: String,
  end: String,
  operator: String,
  localTime: String,
  localDate: String,
  callNumber: Number,
});

const TimeModel = mongoose.model('Time', Time);

module.exports = TimeModel;
