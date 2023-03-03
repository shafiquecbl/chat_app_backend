const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../common/env');

const check = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign(req.body.email, jwtKey);
            user.token = token;
            user.save()
                .then(result => {
                    res.status(200).json({
                        status: true,
                        token: token
                    });
                }).catch(err => {
                    res.status(500).json({
                        error: err.message
                    });
                });
        } else {
            res.status(200).json({
                status: false
            });
        }
    }
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        const token = jwt.sign(req.body.email, jwtKey);
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            gender: req.body.gender,
            dob: req.body.dob,
            country: req.body.country,
            city: req.body.city,
            interests: req.body.interests,
            token: token
        });

        console.log(user);

        user.save()
            .then(result => {
                res.status(200).json({
                    message: 'User created',
                    user: result
                });
            }).catch(err => {
                res.status(500).json({
                    error: err.message
                });
            });

    }

};

const getUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        const user = await User.findOne({ email: req.body.email });
        const token = jwt.sign(req.body.email, jwtKey);
        user.token = token;
        user.save()
            .then(result => {
                res.status(200).json(user.toJSON());
            }).catch(err => {
                res.status(500).json({
                    errors: [
                        { msg: err.message }
                    ]
                });
            });
    }
};

module.exports = { check, signup, getUser };