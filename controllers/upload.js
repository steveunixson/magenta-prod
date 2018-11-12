/* eslint-disable max-len,prefer-destructuring */
const csv = require('csvtojson');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const Match = require('../models/phonebase');
const log = require('../utils/log')(module);
const config = require('../config/mongodb');

function postUpload(req, res) {
  if (!req.files.xlsx || !req.body.name || !req.body.type || !req.body.comment || !req.headers['x-api-key']) {
    const debugBody = req.body;
    return res.status(400).json({ error: 1, msg: 'Bad Request', debug: { debugBody } });
  }
  const Name = req.body.name.replace(/\s/g, '');
  const csvFilePath = req.files.xlsx.path;
  const apiKey = { key: req.headers['x-api-key'] };
  const match = new Match({
    name: req.body.name,
    type: req.body.type,
    comment: req.body.comment,
    apikey: apiKey.key,
  });
  const SaveDB = async () => {
    const URI = config.database.toString();
    const matchStatus = await match.save((err, result) => result);
    const jsonArray = await csv().fromFile(csvFilePath);
    await MongoClient.connect(URI, { useNewUrlParser: true }, (err, client) => {
      assert.equal(null, err);
      log.info('Connected to DB!');
      const db = client.db(config.name);
      const collection = db.collection(Name);
      collection.insertMany(jsonArray, (exception, result) => result);
      log.info('INSERTED');
    });
    return { matchStatus, jsonArray };
  };
  SaveDB()
    .then((result) => {
      res.status(200).json({ error: 0, msg: `Data uploaded to collection: ${Name}`, status: result.matchStatus });
    })
    .catch((err) => {
      log.error(err);
      res.status(500).json({ error: 1, msg: `Internal Error ${err}` });
    });
  return 0;
}

function getUpload(req, res) {
  const key = req.headers['x-api-key'];
  Match.find({ apikey: key }, (err, users) => {
    if (err) res.status(404).json({ err: 1, msg: 'Not Found' });

    res.status(200).json({ err: 0, msg: users });
  });
}

function getPhone(req, res) {
  if (!req.body.base) {
    console.log(req.body);
    return res.status(400).json({ err: 1, msg: 'No base was specified.' });
  }
  function find(name, query, cb) {
    mongoose.connection.db.collection(name, (err, collection) => {
      collection.find(query).toArray(cb);
    });
  }

  find(req.body.base.replace(/\s/g, ''), { id: req.body.id }, (err, docs) => {
    if (err) {
      return res.status(404).json({ err: 1, msg: 'Not Found' });
    }

    return res.status(200).json({ err: 0, msg: docs[0] });
  });
  return 0;
}

function activity(req, res) {
  const name = { name: req.body.name };
  const type = { type: req.body.type };
  const key = req.headers['x-api-key'];

  const update = async () => {
    await Match.findOneAndUpdate({ name, apikey: key }, { $set: { type } }, () => {});
  };
  update()
    .then(() => { res.status(200).json({ err: 0, msg: 'Updated' }); })
    .catch((exception) => {
      res.status(500).json({ err: 1, msg: 'Internal Error', exception });
    });
  return 0;
}

function getTemplate(res) {
  const file = 'tmp/templates/База.xlsx';
  try {
    return res.download(file);
  } catch (error) {
    return res.status(500).json({ err: 1, msg: 'Internal Error' });
  }
}

module.exports.postUpload = postUpload;
module.exports.getUpload = getUpload;
module.exports.getPhone = getPhone;
module.exports.activity = activity;
module.exports.getTemplate = getTemplate;
