const express = require('express');
const router = express.Router();
const controller = require('../controllers/interest');

router.post('/get-all', controller.get_interest);

router.post('/add', controller.add_interest);

router.post('/delete/:id', controller.delete_interest);

router.post('/update/:id', controller.update_interest);


module.exports = router;