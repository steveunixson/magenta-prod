require('dotenv').config();

const uuidAPIKey = require('uuid-apikey');
const log = require('../utils/log')(module);
const Organization = require('../models/org');

function genUUID() {
  return uuidAPIKey.create();
}

function createOrg(req, res) {
  const org = { organization: req.body.organization, domain: req.body.domain };
  if (!req.body || !org.domain || !org.organization) {
    return res.status(400).json({ error: 1, msg: 'Bad Request: Domain should be specified!' });
  }
  Organization.findOne(org, (err, result) => {
    if (result != null) {
      return res.status(403).json({ error: 1, msg: 'Forbiden: Organization already exists!' });
    }

    if (err) {
      return res.status(500).json({ error: 1, msg: 'Internal Error' });
    }
    const newOrg = new Organization({

      apiKey: genUUID().apiKey,
      uuid: genUUID().uuid,
      domain: org.domain,
      organization: org.organization,

    });
    newOrg.save((orgSaveError, saveOrgResult) => {
      if (orgSaveError) {
        return res.status(500).json({ error: 1, msg: 'Internal Error' });
      }
      console.log(saveOrgResult.apiKey);
      return res.status(200).json({ error: 0, msg: saveOrgResult.apiKey });
    });
    return 0;
  });
  return 0;
}

function showOrganization(req, res) {
  const org = { organization: req.query.org };
  Organization.findOne(org.organization, (err, result) => {
    if (err) {
      return res.status(404).json({ error: 1, msg: 'Not Found' });
    }
    if (!result) {
      return res.status(404).json({ error: 1, msg: 'Not Found' });
    }

    return res.status(200).json({ error: 0, msg: result.apiKey });
  });
}

function deleteOrganization(req, res) {
  const org = { organization: req.body.organization };
  Organization.findOneAndRemove(org.organization, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 1, msg: 'Internal Error' });
    }
    if (!result) {
      return res.status(404).json({ error: 1, msg: 'Not Found' });
    }
    return res.status(200).json({ error: 0, msg: 'Removed' });
  });
}

function key(req, res, next) {
  if (!req.headers['x-api-key']) {
    return res.status(403).json({ error: 1, msg: 'Unauthorized: no key provided!' });
  }
  const apiKey = { key: req.headers['x-api-key'] };
  if (uuidAPIKey.isAPIKey(apiKey.key) === true) {
    Organization.findOne({ apiKey: apiKey.key }, (err, data) => {
      if (err) {
        log.error(err);
        return res.status(500).json({ error: 1, msg: 'Internal Error' });
      }
      if (!data) {
        return res.status(404).json({ error: 1, msg: 'Organization does not exists' });
      }
      next();
      return 0;
    });
  } else {
    return res.status(400).json({ error: 1, msg: 'Bad API key' });
  }
  return 0;
}

module.exports.genUUID = genUUID;
module.exports.createOrg = createOrg;
module.exports.showOrganization = showOrganization;
module.exports.deleteOrganization = deleteOrganization;
module.exports.key = key;
// сначала нужно принять ключ из x-api-token
// потом нужно провалидирровать ключ
// потом достать соответствующий ключ из БД
// потом перевести его в uuid
// потом перевести key из запроса в uuid
// затем сравнить его с uuid из базы

// /api/org

// TODO

// Save organization to common DB

// On Organization creation check if organization exsists
// if organization exsists send 403 Forbiden

// On admin creation check if organization exsists
// if organization not exsists send 404 Not Found

// if everything ok - use org name as db name and create new mongo connection
// Return domain, organization, and uuid in response


// Show organization on request by uuid
// Return domain, organization, and uuid
// if not exsist - send 404 not found

// Remove organization and all its DBs
// if not exsist - send 404 not found
// Return "ok, removed"
// Close all DB connections
// Remove databases and all org related tmp files
