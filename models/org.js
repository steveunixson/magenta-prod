const mongoose = require('mongoose');
const config = require('../config/mongodb');

mongoose.connect(config.database, { useNewUrlParser: true });

// const { Schema } = mongoose.Schema;

const Organization = mongoose.Schema({

  apiKey: String,
  uuid: String,
  domain: String,
  organization: String,

});

const OrganizationModel = mongoose.model('Organization', Organization);

module.exports = OrganizationModel;
