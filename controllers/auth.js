require('dotenv').config();

const faker = require('faker');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const User = require('../models/users');
const log = require('../utils/log')(module);
// const config = require('../config/config');

function passwordGen() {
  return faker.internet.password();
}

function usertokenGen(name, password, role) {
  return jwt.sign({ name, password, role }, process.env.SECRET);
}
// Creates admin
function setupPost(req, res) {
  const key = req.headers['x-api-key'];
  const Name = { username: req.body.username };
  const Organization = { org: req.body.organization };
  const pwd = passwordGen();
  const role = 'admin';
  const NewUser = new User({
    username: Name.username,
    password: pwd,
    role: 'admin',
    organization: Organization.org,
    token: usertokenGen(Name.username, pwd, role),
    apikey: key,
  });
  NewUser.save((error, saveResult) => {
    if (error) {
      log.error(error.message);
      return res.status(403).json({ error: 1, msg: 'User Exists', user: { username: Name.username } });
    }
    return res.status(200).json({ error: 0, token: saveResult.token, pwd });
  });
}
// Creates User
function setupPostUser(req, res) {
  const key = req.headers['x-api-key'];
  const Name = { username: req.body.username };
  const Organization = { org: req.body.organization };
  const Base = { base: req.body.base };
  const YDI = { yandexID: req.body.yandexID };
  const pwd = passwordGen();
  const role = 'user';
  const NewUser = new User({
    base: Base.base,
    yandexID: YDI.yandexID,
    username: Name.username,
    password: pwd,
    role: 'user',
    organization: Organization.org,
    token: usertokenGen(Name.username, pwd, role),
    apikey: key,
  });
  NewUser.save((error, saveResult) => {
    if (error) {
      log.error(error.message);
      return res.status(403).json({ error: 1, msg: 'User Exists', user: { username: Name.username } });
    }
    return res.status(200).json({ error: 0, token: saveResult.token, pwd });
  });
}

function setupPostManager(req, res) {
  const key = req.headers['x-api-key'];
  const Name = { username: req.body.username };
  const Organization = { org: req.body.organization };
  const YDI = { yandexID: req.body.yandexID };
  const pwd = passwordGen();
  const role = 'manager';
  const NewUser = new User({
    yandexID: YDI.yandexID,
    username: Name.username,
    password: pwd,
    role: 'manager',
    organization: Organization.org,
    token: usertokenGen(Name.username, pwd, role),
    apikey: key,
  });
  NewUser.save((error, saveResult) => {
    if (error) {
      log.error(error.message);
      return res.status(403).json({ error: 1, msg: 'User Exists', user: { username: Name.username } });
    }
    return res.status(200).json({ error: 0, token: saveResult.token, pwd });
  });
}

// Removes user
function removeUser(req, res) {
  const key = req.headers['x-api-key'];
  const user = req.body.username;
  if (typeof key === 'undefined' || typeof user === 'undefined') {
    return res.status(400).json({ error: 1, msg: 'Bad Request' });
  }
  User.findOneAndDelete({ apikey: key, username: user }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 1, msg: 'Internal Error' });
    }
    if (result == null) {
      return res.status(404).json({ error: 1, msg: 'User not found' });
    }
    return res.status(200).json({ error: 0, message: 'Removed' });
  });
  return 0;
}
// Admin Token extractor
function tokenAdmin(req, res, next) {
  if (!req.headers.authorization) {
    log.error('UNAUTHORIZED USER HAS BEEN SPOTTED!');
    return res.status(403).json({ error: 1, msg: 'Unauthorized' });
  }
  const token = JSON.stringify(req.headers.authorization).replace('Bearer ', '');

  const decoded = jwtDecode(token);
  const Name = { name: decoded.name };
  const Password = { password: decoded.password };
  User.findOne({ username: Name.name, password: Password.password, role: 'admin' }, (err, data) => {
    if (err) {
      return res.status(403).json({ error: 1, msg: 'Forbiden' });
    }
    if (!data) {
      log.error(`user ${Name.name} Permission denied`);
      return res.status(401).json({ error: 1, msg: 'Permission denied' });
    }
    if (data.password === Password.password || data.username === Name.username || data.role === 'admin') {
      log.info(`Acsess granted for: ${data.username}`);
      next();
    } else {
      log.error(`user ${data.username} Permission denied`);
      return res.status(401).json({ error: 1, msg: 'Permission denied' });
    }
    return 0;
  });
  return 0;
}
// Token extractor
function tokenUser(req, res, next) {
  if (!req.headers.authorization) {
    log.error('UNAUTHORIZED USER HAS BEEN SPOTTED!');
    return res.status(403).json({ error: 1, msg: 'Unauthorized' });
  }
  const token = JSON.stringify(req.headers.authorization).replace('Bearer ', '');

  const decoded = jwtDecode(token);
  const Name = { name: decoded.name };
  const Password = { password: decoded.password };
  User.findOne({ username: Name.name, password: Password.password, role: 'user' }, (err, data) => {
    if (err) {
      return res.status(403).json({ error: 1, msg: 'Forbiden' });
    }
    if (!data) {
      log.error(`user ${Name.name} Permission denied`);
      return res.status(401).json({ error: 1, msg: 'Permission denied' });
    }
    if (data.password === Password.password || data.username === Name.username || data.role === 'user') {
      log.info(`Acsess granted for: ${data.username}`);
      next();
    } else {
      log.error(`user ${data.username} Permission denied`);
      return res.status(401).json({ error: 1, msg: 'Permission denied' });
    }
    return 0;
  });
  return 0;
}

// Token extractor
function tokenManager(req, res, next) {
  if (!req.headers.authorization) {
    log.error('UNAUTHORIZED USER HAS BEEN SPOTTED!');
    return res.status(403).json({ error: 1, msg: 'Unauthorized' });
  }
  const token = JSON.stringify(req.headers.authorization).replace('Bearer ', '');

  const decoded = jwtDecode(token);
  const Name = { name: decoded.name };
  const Password = { password: decoded.password };
  User.findOne({ username: Name.name, password: Password.password, role: 'user' }, (err, data) => {
    if (err) {
      return res.status(403).json({ error: 1, msg: 'Forbiden' });
    }
    if (!data) {
      log.error(`user ${Name.name} Permission denied`);
      return res.status(401).json({ error: 1, msg: 'Permission denied' });
    }
    if (data.password === Password.password || data.username === Name.username || data.role === 'manager') {
      log.info(`Acsess granted for: ${data.username}`);
      next();
    } else {
      log.error(`user ${data.username} Permission denied`);
      return res.status(401).json({ error: 1, msg: 'Permission denied' });
    }
    return 0;
  });
  return 0;
}
// Login mechanism
function login(req, res) {
  const Password = { password: req.body.password };
  const Username = { username: req.body.username };
  if (typeof (Password.password) === 'undefined' || typeof (Username.username) === 'undefined') {
    return res.status(400).json({ err: 1, msg: 'Bad Request' });
  }
  User.findOne({ username: Username.username, password: Password.password }, (err, data) => {
    if (err) {
      return res.status(500).json({ err: 1, msg: 'Internal Error' });
    }
    if (data === null) {
      return res.status(404).json({ err: 1, msg: 'User Not found' });
    }
    if (Username.username !== data.username || Password.password !== data.password) {
      return res.status(403).json({ err: 1, msg: 'Unauthorized' });
    }
    log.info(`A user has been logged in! Welcome: ${data.username}`);
    return res.status(200).json({
      err: 0, msg: data.username, token: data.token, base: data.base, yandexID: data.yandexID, role: data.role,
    });
  });
  return 0;
}

module.exports.setupPost = setupPost; // Creates admin
module.exports.setupPostUser = setupPostUser; // Creates User
module.exports.setupPostManager = setupPostManager;
module.exports.tokenManager = tokenManager;
module.exports.removeUser = removeUser; // Removes User
module.exports.tokenAdmin = tokenAdmin; // Admin Token Extractor
module.exports.tokenUser = tokenUser; // User Token Extractor
module.exports.login = login; // Login mechanism
