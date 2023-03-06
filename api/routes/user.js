const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const validators = require('../validators/users');


router.post('/check-email', validators.checkUserValdiaors, controller.check);

router.post('/signup', validators.signupValidators, controller.signup);

router.post('/get-user', validators.checkUserValdiaors, controller.getUser);

router.post('/update-user', validators.updateValidators, controller.update);

router.post('/update-password', validators.updatePasswordValidators, controller.updatePassword);

router.post('/update-image', controller.updateImage);


module.exports = router;