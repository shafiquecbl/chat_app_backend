const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const validators = require('../validators/users');

router.post('/check-email', validators.checkUserValdiaors, controller.check);

router.post('/signup', validators.signupValidators,
    (req, res, next) => controller.signup(req, res, next));

router.post('/get-user', validators.checkUserValdiaors, controller.getUser);

router.delete('/delete:id', (req, res, next) => {
    res.status(200).json({
        message: 'User deleted'
    });
});

router.put('/update:id', (req, res, next) => {
    res.status(200).json({
        message: 'User updated'
    });
});

router.post('/check', (req, res, next) => {
    if (req.body.email != null) {
        res.status(200).json({
            message: 'User exists',
            email: req.body.email
        });
    }
    else {
        res.status(404).json({
            message: 'User does not exist'
        });
    }
});

module.exports = router;