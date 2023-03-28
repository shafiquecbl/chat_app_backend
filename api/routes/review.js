const express = require('express');
const router = express.Router();
const { getReviewList } = require('../controllers/review');


router.post('/get', getReviewList);


module.exports = router;