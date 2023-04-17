const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { profilePictureUploader } = require('../middlewares/image');
const { customError } = require('../middlewares/errors');
const { getContacts } = require('./message');




module.exports = {

    async check(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const token = jwt.sign(req.body.email, process.env.JWT_KEY);
                user.token = token;
                const result = await user.save();
                res.status(200).json({
                    status: true,
                    token: token
                });
            } else {
                res.status(200).json({
                    status: false
                });
            }
        }
        catch (err) {
            customError(err);
        }

    },

    async signup(req, res, next) {
        try {
            const token = jwt.sign(req.body.email, process.env.JWT_KEY);
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

            const result = await user.save();
            res.status(200).json({
                message: 'User created',
                user: result
            });

        } catch (err) {
            customError(err);
        }

    },

    async getUser(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            const token = jwt.sign(req.body.email, process.env.JWT_KEY);
            user.token = token;

            const result = await user.save();
            user.contacts = [];
            res.status(200).json(user.toJSON());

        }
        catch (err) {
            customError(err);
        }

    },
    async getAllUser(req, res, next) {
        try {
            let userss = await User.find();
            res.status(200).json(userss);

        }
        catch (err) {
            customError(err);
        }

    },

    async update(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            user.name = req.body.name;
            user.about = req.body.about;
            user.dob = req.body.dob;
            user.gender = req.body.gender;
            user.country = req.body.country;
            user.city = req.body.city;
            user.interests = req.body.interests;
            user.infoVisibility = req.body.infoVisibility;
            const result = await user.save();
            res.status(200).json(user.toJSON());
        }
        catch (err) {
            customError(err);
        }
    },

    async updateUserListenStatus(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            user.listenStatus = req.body.listen;
            const result = await user.save().then(result => {
                res.status(200).json(user.toJSON())
            }).catch(err => {
                customError(err);
            });
        }
        catch (err) {
            customError(err);
        }
    },

    async updatePassword(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            user.password = req.body.password;
            const result = await user.save();
            res.status(200).json({
                message: 'Password updated successfully'
            });
        } catch (err) {
            customError(err);
        }

    },

    async updateImage(req, res, next) {
        try {
            // Upload the profile picture using the profilePictureUploader middleware
            profilePictureUploader.single('image')(req, res, async (err) => {

                if (err) {
                    console.error(err); // Log error to console
                    return res.status(400).json({ error: 'Failed to upload profile picture' });
                }
                const profilePictureUrl = `${process.env.DOMAIN}/${req.file.path}`;

                const user = await User.findOne({ email: req.body.email });
                user.image = profilePictureUrl;

                user.save().then(result => {
                    res.status(200).json({
                        message: 'Profile picture updated successfully',
                        image: profilePictureUrl
                    });
                }).catch(err => {
                    customError(err);
                });

            },
            );
        } catch (err) {
            customError(err);
        }
    },


    async searchUsers(req, res, next) {
        try {
            const PAGE_SIZE = 10;
            const page = parseInt(req.body.page) || 1;
            const searchQuery = req.body.query;
            const count = await User.countDocuments({ name: { $regex: searchQuery, $options: 'i' } });
            const totalPages = Math.ceil(count / PAGE_SIZE);

            const users = await User.find({ name: { $regex: searchQuery, $options: 'i' } })
                .sort({ createdAt: 1, email: 1 })
                .skip((page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE);

            res.status(200).json({
                users: users,
                page: page,
                hasMore: page < totalPages
            });
        }
        catch (err) {
            customError(err);
        }
    },

    async getCityAndCountry(req, res, next) {
        try {
            // get the city and country of every user in the database 
            const cities = [];
            const countries = [];
            const users = await User.find({}).select('city country');
            users.forEach(user => {
                if (user.city !== '') {
                    cities.push(user.city.toLowerCase().trim());
                }
                if (user.country !== '') {
                    countries.push(user.country.toLowerCase().trim());
                }
            });
            // remove duplicates
            const uniqueCities = [...new Set(cities)];
            const uniqueCountries = [...new Set(countries)];

            res.status(200).json({
                cities: uniqueCities,
                countries: uniqueCountries
            });

        }
        catch (err) {
            customError(err);
        }
    },

    async updateOnlineStatus(email, status) {
        try {
            const user = await User.findOne({ email: email });
            user.online = status;
            const result = await user.save();
        }
        catch (err) {
            console.log(err);
        }
    },


    async getEmailFromId(id) {
        try {
            const user = await User.findOne({ _id: id });
            return user.email;
        }
        catch (err) {
            console.log(err);
        }
    },


    async emitContacts(io, email) {
        getContacts(email).then((contacts) => {
            io.to(email).emit('contacts', contacts);
        });
    },

    async sendUserStatus(io, email, status) {
        getContacts(email).then((contacts) => {
            for (let i = 0; i < contacts.length; i++) {
                io.to(contacts[i].user.email).emit('onlineUsers', {
                    email: email,
                    status: status
                });
            }
        });
    },

    async updateFirebaseToken(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const token = req.body.token;
                user.firebaseToken = token;
                await user.save();
                res.status(200).json({
                    status: true
                });
            } else {
                res.status(200).json({
                    status: false
                });
            }
        }
        catch (err) {
            customError(err);
        }
    }

}