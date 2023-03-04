const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../common/env');
const { profilePictureUploader } = require('../middlewares/image');
const { domain } = require('../common/constants');

module.exports = {

    async check(req, res, next) {
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
    },

    async signup(req, res, next) {
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

    },

    async getUser(req, res, next) {
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
                        error: err.message
                    });
                });
        }
    },

    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const user = await User.findOne({ email: req.body.email });
            user.name = req.body.name;
            user.dob = req.body.dob;
            user.gender = req.body.gender;
            user.country = req.body.country;
            user.city = req.body.city;
            user.interests = req.body.interests;
            user.infoVisibility = req.body.infoVisibility;
            user.save().then(result => {
                res.status(200).json(user.toJSON());
            }).catch(err => {
                res.status(500).json({
                    error: err.message
                });
            });
        }
    },

    async update(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const user = await User.findOne({ email: req.body.email });
            user.password = req.body.password;
            user.save().then(result => {
                res.status(200).json({
                    message: 'Password updated successfully'
                });
            }).catch(err => {
                res.status(500).json({
                    error: err.message
                });
            });
        }
    },

    async updateImage(req, res, next) {
        try {
            // Upload the profile picture using the profilePictureUploader middleware
            profilePictureUploader.single('image')(req, res, async (err) => {

                if (err) {
                    console.error(err); // Log the error to the console
                    return res.status(400).json({ error: 'Failed to upload profile picture' });
                }

                const username = req.body.email.split('@')[0];
                const profilePictureUrl = `${domain}/uploads/profile/${username}.jpg`;

                const user = await User.findOne({ email: req.body.email });
                user.image = profilePictureUrl;

                user.save().then(result => {
                    res.status(200).json({
                        message: 'Profile picture updated successfully',
                        image: profilePictureUrl
                    });
                }).catch(err => {
                    res.status(500).json({
                        error: err.message
                    });
                });

            },
            );
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    },

}