const express = require('express');

const org = express.Router();
const config = require('../config/config');
const controller = require('../controllers/org');

const baseUrl = config.url;
// Create organization
org.post(`${baseUrl}/org`, controller.createOrg);

// View organization via query
org.get(`${baseUrl}/org`, controller.showOrganization);

// Delete organization
org.delete(`${baseUrl}/org`, controller.deleteOrganization);

module.exports = org;
