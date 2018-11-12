const mongoose = require('mongoose');
const config = require('../config/mongodb');

mongoose.connect(config.database, { useNewUrlParser: true });
// Define our beer schema
const MatchSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  type: String,
  comment: String,
  apikey: String,
});

// Export the Mongoose model

module.exports = mongoose.model('Match', MatchSchema);
