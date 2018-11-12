const express = require('express');
const config = require('../config/config');
const controller = require('../controllers/status');

const router = express.Router();
/* GET home page. */
router.post(`${config.url}/status`, controller.postStatus);
router.post(`${config.url}/stats`, controller.getStatusCount);
router.post(`${config.url}/user/stats`, controller.postTime);
router.post(`${config.url}/user/track`, controller.postTimeTrack);
router.get(`${config.url}/user/track`, controller.getTimeTrack);
router.post(`${config.url}/user/track/operator`, controller.getTimeTrackOperator);
router.post(`${config.url}/user/track/conversion`, controller.getConversionByOperator);
router.post(`${config.url}/upload/conversion`, controller.getConversionByBase);
router.get('/admin/time', controller.renderStatus);
router.get('/manager/leads', controller.renderLeads);
router.get('/manager/clients', controller.renderClients);

module.exports = router;
