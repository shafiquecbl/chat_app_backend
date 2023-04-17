const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const interestController = require('../controllers/interest');
const validators = require('../validators/users');
const { validateRequest } = require('../middlewares/validation');


router.post('/check-email', validators.checkUserValdiaors, validateRequest, controller.check);

router.post('/signup', validators.signupValidators, validateRequest, controller.signup);

router.post('/get-user', validators.checkUserValdiaors, validateRequest, controller.getUser);

router.post('/update-user', validators.updateValidators, validateRequest, controller.update);

router.post('/update-password', validators.updatePasswordValidators, validateRequest, controller.updatePassword);

router.post('/update-image', controller.updateImage);

router.post('/get-users', validators.checkUserValdiaors, validateRequest, interestController.getUsersWithSimilarInterests);

router.post('/search-users', controller.searchUsers);

router.post('/update-listen-status', controller.updateUserListenStatus);

router.get('/get-country-city', controller.getCityAndCountry);

router.get('/get-allUser', controller.getAllUser);

router.post('/update-token', controller.updateFirebaseToken);


module.exports = router;