const express = require('express');
const router = express.Router();
const controller = require('../controllers/timing');

router.post('/get-all', controller.getTiming);

router.post('/add',controller.addTiming );

router.post('/update/:id',controller.updateTiming );


module.exports = router;