/* eslint-disable max-len */
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  requireTLS: true,
  auth: {
    user: 'commonbonobo@gmail.com',
    pass: process.env.SENDMAILPASS,
  },
});
const Status = require('../models/status');
const Time = require('../models/time');
const Track = require('../models/track');

const log = require('../utils/log')(module);

function postStatus(req, res) {
  const systemDate = new Date().toLocaleTimeString();
  const status = new Status({
    id: req.body.id,
    base: req.body.base,
    success: req.body.success,
    operator: req.body.operator,
    type: req.body.type,
    project: req.body.project,
    status: req.body.status,
    date: req.body.date,
    time: req.body.time,
    email: req.body.email,
    phone: req.body.phone,
    company: req.body.company,
    apiKey: req.body.apiKey,
    localTime: systemDate,
  });
  status.save((err, stats) => {
    if (!err) {
      log.debug('status added to collection');
      return res.status(200).json({ err: 0, status: stats });
    }

    log.error(err);
    return res.json({ message: 'Internal Error' });
  });
}

function getStatusCount(req, res) {
  const counter = async () => {
    const totalCalls = await Status.countDocuments({ operator: req.body.operator }, (err, count) => count);
    const totalLeads = await Status.countDocuments({ operator: req.body.operator, type: 'Лид' }, (err, count) => count);
    const goodMorningLeads = await Status.countDocuments({ operator: req.body.operator, type: 'Лид', project: 'Good Morning' }, (err, count) => count);
    const keyToCallLeads = await Status.countDocuments({ operator: req.body.operator, type: 'Лид', project: 'Key to Call' }, (err, count) => count);
    return {
      total: totalCalls,
      leads: totalLeads,
      goodMorning: goodMorningLeads,
      keyToCall: keyToCallLeads,
    };
  };
  counter()
    .then((result) => {
      res.status(200).json({ err: 0, result });
    })
    .catch((exception) => {
      res.status(500).json({ err: 1, exception });
    });
}

function postTime(req, res) {
  const Save = async () => {
    const time = new Time(req.body);
    await time.save((err, result) => result);
  };
  Save()
    .then(() => {
      res.status(200).json({ err: 0, msg: 'saved' });
      const mailOptions = {
        from: 'commonbonobo@gmail.com',
        to: process.env.EMAIL,
        subject: `Отчет о действиях оператора ${req.body.operator}`,
        text: `\nНачал звонить в: ${req.body.start}\n 
        Закончил звонить в: ${req.body.end}\n 
        Позвонил ${req.body.callNumber} раз\n
        Дата: ${req.body.localDate}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          log.error(error);
        } else {
          log.info(`Email sent: ${info.response}`);
          transporter.close();
        }
      });
    })
    .catch((exception) => { res.status(500).json({ err: 1, msg: exception }); });
}

function postTimeTrack(req, res) {
  const TimeTrack = async () => {
    const track = new Track({
      apiKey: req.body.apiKey,
      operator: req.body.operator,
      time: req.body.time,
      localTime: new Date().toLocaleTimeString(),
      localDate: new Date().toLocaleDateString(),
    });
    await track.save((err, result) => result);
  };
  TimeTrack()
    .then(() => { res.status(200).json({ err: 0, msg: 'saved' }); })
    .catch(() => { res.status(500).json({ err: 1, msg: 'Internal Error' }); });
}

function getTimeTrack(req, res) {
  const TimeTrack = async () => {
    const result = await Track.find({}, (err, data) => data);
    return result;
  };
  TimeTrack()
    .then((result) => { res.status(200).json(result); })
    .catch((exception) => { res.status(200).json({ err: 1, msg: exception }); });
}

function getTimeTrackOperator(req, res) {
  const Operator = req.body.operator;
  Track.find({ operator: Operator }, (exception, result) => {
    if (exception) {
      return res.status(400).json({ err: 1, msg: exception });
    }
    return res.status(200).json(result);
  });
}

function getConversionByOperator(req, res) {
  const Operator = { operator: req.body.operator };
  const API = { apiKey: req.body.apiKey };
  const conversion = async () => {
    const successGM = await Status.countDocuments({
      success: true,
      operator: Operator.operator,
      apiKey: API.apiKey,
      project: 'Good Morning',
    }, (err, data) => data);

    const successKTK = await Status.countDocuments({
      success: true,
      operator: Operator.operator,
      apiKey: API.apiKey,
      project: 'Key to Call',
    }, (err, data) => data);

    const failedGM = await Status.countDocuments({
      success: false,
      operator: Operator.operator,
      apiKey: API.apiKey,
      project: 'Good Morning',
    }, (err, data) => data);

    const failedKTK = await Status.countDocuments({
      success: false,
      operator: Operator.operator,
      apiKey: API.apiKey,
      project: 'Key to Call',
    }, (err, data) => data);
    const KTK = (successKTK / failedKTK + successKTK) * 0.1;
    const GM = (successGM / failedGM + successGM) * 0.1;
    return {
      keyToCall: KTK,
      goodMorning: GM,
    };
  };
  conversion()
    .then((result) => { res.status(200).json({ err: 0, msg: result }); })
    .catch((exception) => { res.status(500).json({ err: 1, msg: exception }); });
}

function getConversionByBase(req, res) {
  const Base = { base: req.body.base };
  const API = { apiKey: req.body.apiKey };
  const conversion = async () => {
    const successGM = await Status.countDocuments({
      success: true,
      base: Base.base,
      apiKey: API.apiKey,
      project: 'Good Morning',
    }, (err, data) => data);

    const successKTK = await Status.countDocuments({
      success: true,
      base: Base.base,
      apiKey: API.apiKey,
      project: 'Key to Call',
    }, (err, data) => data);

    const failedGM = await Status.countDocuments({
      success: false,
      base: Base.base,
      apiKey: API.apiKey,
      project: 'Good Morning',
    }, (err, data) => data);

    const failedKTK = await Status.countDocuments({
      success: false,
      base: Base.base,
      apiKey: API.apiKey,
      project: 'Key to Call',
    }, (err, data) => data);
    const KTK = (successKTK / failedKTK + successKTK) * 0.1;
    const GM = (successGM / failedGM + successGM) * 0.1;
    return {
      keyToCall: KTK,
      goodMorning: GM,
    };
  };
  conversion()
    .then((result) => { res.status(200).json({ err: 0, msg: result }); })
    .catch((exception) => { res.status(500).json({ err: 1, msg: exception }); });
}

function renderStatus(req, res) {
  const status = async () => {
    const result = await Track.find({}, (err, data) => data);
    return result;
  };
  status()
    .then((data) => {
      res.render(
        'conversion',
        {
          statusData: data,
        },
      );
    })
    .catch((exception) => { res.status(500).json({ err: 1, msg: 'Internal Error', exception }); });
}

function renderLeads(req, res) {
  const status = async () => {
    const result = await Status.find({ success: true }, (err, data) => data);
    return result;
  };
  status()
    .then((data) => {
      res.render(
        'leads',
        {
          statusData: data,
        },
      );
    })
    .catch((exception) => { res.status(500).json({ err: 1, msg: 'Internal Error', exception }); });
}

function renderClients(req, res) {
  const status = async () => {
    const result = await Status.find({ success: true }, (err, data) => data);
    return result;
  };
  status()
    .then((data) => {
      res.render(
        'clients',
        {
          statusData: data,
        },
      );
    })
    .catch((exception) => { res.status(500).json({ err: 1, msg: 'Internal Error', exception }); });
}

module.exports.postStatus = postStatus;
module.exports.getStatusCount = getStatusCount;
module.exports.postTime = postTime;
module.exports.postTimeTrack = postTimeTrack;
module.exports.getTimeTrack = getTimeTrack;
module.exports.getTimeTrackOperator = getTimeTrackOperator;
module.exports.getConversionByOperator = getConversionByOperator;
module.exports.getConversionByBase = getConversionByBase;
module.exports.renderStatus = renderStatus;
module.exports.renderLeads = renderLeads;
module.exports.renderClients = renderClients;
