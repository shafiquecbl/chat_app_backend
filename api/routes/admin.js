const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin');
const admin = require('../models/admin');

router.post('/get-admin', controller.get_admin);

router.post('/add-admin', controller.add_admin);

router.post('/delete-admin/:id', controller.delete_admin);

router.post('/update-admin/:id', controller.update_admin);


module.exports = router;