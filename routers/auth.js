const express = require('express');

const auth = express.Router();
const config = require('../config/config');
const controller = require('../controllers/auth');
const org = require('../controllers/org');

const baseUrl = config.url;
// Create authorization
auth.post(`${baseUrl}/user/signup`, org.key, controller.tokenAdmin, controller.setupPostUser);

auth.post(`${baseUrl}/user/signup/manager`, org.key, controller.tokenAdmin, controller.setupPostManager);
// View authorization via query
auth.post(`${baseUrl}/user/signup/admin`, org.key, controller.setupPost);

// Delete authorization
auth.delete(`${baseUrl}/user`, org.key, controller.tokenAdmin, controller.removeUser);

// Login
auth.post(`${baseUrl}/user/login`, org.key, controller.login);


module.exports = auth;
