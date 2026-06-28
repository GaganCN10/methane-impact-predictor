const express = require('express');
const router = express.Router();
const graphDataController = require('../controllers/graphDataController');

router.get('/concentration', graphDataController.getConcentration);
router.get('/sectoral', graphDataController.getSectoral);
router.get('/countries', graphDataController.getCountries);
router.get('/livestock', graphDataController.getLivestock);
router.get('/losses', graphDataController.getLosses);
router.get('/ndc', graphDataController.getNDC);
router.get('/gdp-scatter', graphDataController.getGDPScatter);

module.exports = router;
