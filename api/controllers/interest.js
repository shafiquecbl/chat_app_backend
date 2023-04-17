const Interest = require("../models/interests.js");
const User = require('../models/user');



module.exports = {


    async add_interest(req, res, next) {
        try {
            const interest = new Interest({
                interest: req.body.interest,
            });

            const result = await interest.save();
            res.status(200).json({
                message: 'interest added',
                data: result
            });

        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },

    async get_interest(req, res, next) {
        try {
            const interest = await Interest.find();
            res.status(200).json({
                message: "getall",
                data: interest
            });

        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },

    async update_interest(req, res, next) {
        try {
            const interest = await Interest.findByIdAndUpdate({ _id: req.params.id });
            interest.interest = req.body.interest;
            const result = await interest.save();
            res.status(200).json({
                message: 'interest updated',
                data: result
            });
        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    },
    async delete_interest(req, res, next) {
        try {
            const interest = await Interest.findByIdAndDelete({ _id: req.params.id });
            res.status(200).json({
                message: "deleted",

            });

        }
        catch (err) {
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




}