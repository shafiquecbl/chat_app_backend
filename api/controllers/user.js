const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { profilePictureUploader } = require('../middlewares/image');
const Message = require('../models/message');
const { customError } = require('../middlewares/errors');


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

    async getUsersWithSimilarInterests(req, res, next) {
        try {
            const PAGE_SIZE = 10;
            const page = parseInt(req.body.page) || 1;
            const user = await User.findOne({ email: req.body.email });

            if (req.body.interest === '') {
                const count = await User.countDocuments({
                    $or: [
                        { listenStatus: !req.body.listen },
                        { listenStatus: null }
                    ], interests: { $in: user.interests }, email: { $ne: user.email }
                });
                const totalPages = Math.ceil(count / PAGE_SIZE);

                const users = await User.find({
                    $or: [
                        { listenStatus: !req.body.listen },
                        { listenStatus: null }
                    ]
                    , interests: { $in: user.interests }, email: { $ne: user.email }
                })
                    .sort({ createdAt: 1, email: 1 })
                    .skip((page - 1) * PAGE_SIZE)
                    .limit(PAGE_SIZE);

                res.status(200).json({
                    users: users,
                    page: page,
                    hasMore: page < totalPages
                });
            } else {
                const count = await User.countDocuments({
                    $or: [
                        { listenStatus: !req.body.listen },
                        { listenStatus: null }
                    ], interests: { $in: [req.body.interest] }, email: { $ne: user.email }
                });
                const totalPages = Math.ceil(count / PAGE_SIZE);

                const users = await User.find({
                    $or: [
                        { listenStatus: !req.body.listen },
                        { listenStatus: null }
                    ], interests: { $in: [req.body.interest] }, email: { $ne: user.email }
                })
                    .sort({ createdAt: 1, email: 1 })
                    .skip((page - 1) * PAGE_SIZE)
                    .limit(PAGE_SIZE);

                res.status(200).json({
                    users: users,
                    page: page,
                    hasMore: page < totalPages
                });
            }


        }
        catch (err) {
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

    async addMessageAndContact(senderId, receiverId, message, image, request, ended) {
        try {
            const senderUser = await User.findOne({ _id: senderId });
            const receiverUser = await User.findOne({ _id: receiverId });

            console.log(request);

            if (message != 'Chat Request' && message != 'Chat Ended' && message != 'Request Accepted') {
                senderId = senderId;
            } else {
                // check if the contact already exists then get sender Id
                const senderContactIndex = senderUser.contacts.findIndex(contact => contact.user.toString() === receiverUser._id.toString());
                if (senderContactIndex !== -1) {
                    senderId = senderUser.contacts[senderContactIndex].sender;
                }

            }

            const senderContact = {
                user: receiverUser._id,
                lastMessage: message,
                createdAt: Date.now(),
                image: image,
                ended: ended,
                request: request,
                sender: senderUser._id
            };

            const receiverContact = {
                user: senderUser._id,
                lastMessage: message,
                createdAt: Date.now(),
                image: image,
                ended: ended,
                request: request,
                sender: senderUser._id
            };

            if (request == 'accepted') {
                senderContact.startTime = Date.now();
                receiverContact.startTime = Date.now();
            }

            // add contact to sender
            const senderContactIndex = senderUser.contacts.findIndex(contact => contact.user.toString() === receiverUser._id.toString());
            if (senderContactIndex === -1) {
                senderUser.contacts.push(senderContact);
            }
            else {
                senderUser.contacts[senderContactIndex] = senderContact;
            }

            // add contact to receiver
            const receiverContactIndex = receiverUser.contacts.findIndex(contact => contact.user.toString() === senderUser._id.toString());
            if (receiverContactIndex === -1) {
                receiverUser.contacts.push(receiverContact);
            }
            else {
                receiverUser.contacts[receiverContactIndex] = receiverContact;
            }

            senderUser.save();
            receiverUser.save();


            // save message in the database

            const newMessage = new Message({
                sender: senderUser._id,
                receiver: receiverUser._id,
                message: message,
                createdAt: Date.now(),
                image: image
            });

            var messageResult = '';
            if (message != 'Chat Request' && message != 'Chat Ended' && message != 'Request Accepted') {
                messageResult = await newMessage.save();
            }

            return messageResult;

        }
        catch (err) {
            console.log(err);
        }

    },


    async getContacts(email) {
        console.log(email);
        const user = await User.findOne({ email: email }).populate('contacts.user');
        return user.contacts;
    },

    async getInitialMessages(senderId, receiverId) {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId }
                ]
            }).sort({ createdAt: -1 });

            return messages;
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
    }


}