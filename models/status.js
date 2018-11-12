/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Status = new Schema({
  id: {
    type: Number,
  },
  base: {
    type: String,
  },
  success: {
    type: Boolean,
  },
  operator: {
    type: String,
  },
  type: {
    type: String,
  },
  project: {
    type: String,
  },
  status: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  apiKey: {
    type: String,
  },
  localTime: {
    type: String,
  },
});
const StatusModel = mongoose.model('Status', Status);
module.exports = StatusModel;
