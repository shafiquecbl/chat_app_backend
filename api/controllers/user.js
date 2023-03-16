const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { profilePictureUploader } = require('../middlewares/image');
const Message = require('../models/message');


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
            res.status(500).json({
                error: err.message
            });
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
            res.status(500).json({
                error: err.message
            });
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
            res.status(500).json({
                error: err.message
            });
        }

    },

    async update(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            user.name = req.body.name;
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
            res.status(500).json({
                error: err.message
            });
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
            res.status(500).json({
                error: err.message
            });
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

    async getUsersWithSimilarInterests(req, res, next) {
        try {
            const PAGE_SIZE = 10;
            const page = parseInt(req.body.page) || 1;
            const user = await User.findOne({ email: req.body.email });

            const count = await User.countDocuments({ interests: { $in: user.interests }, email: { $ne: user.email } });
            const totalPages = Math.ceil(count / PAGE_SIZE);

            const users = await User.find({ interests: { $in: user.interests }, email: { $ne: user.email } })
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
            res.status(500).json({
                error: err.message
            });
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
            res.status(500).json({
                error: err.message
            });
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

    async addMessageAndContact(senderId, receiverId, message, image) {
        try {
            const senderUser = await User.findOne({ _id: senderId });
            const receiverUser = await User.findOne({ _id: receiverId });

            console.log(image);

            const senderContact = {
                user: receiverUser._id,
                lastMessage: message,
                createdAt: Date.now(),
                image: image,
                safe: true,
            };

            const receiverContact = {
                user: senderUser._id,
                lastMessage: message,
                createdAt: Date.now(),
                image: image,
                safe: false,
            };

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

            const messageResult = await newMessage.save();

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