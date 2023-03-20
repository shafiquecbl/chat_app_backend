const Interest = require("../models/interests.js");
const jwt = require('jsonwebtoken');
const { profilePictureUploader } = require('../middlewares/image');
const Message = require('../models/message');


module.exports = {


    async add_interest(req, res, next) {
        try {
            const interest = new Interest({
                interest: req.body.interest,
            });

            const result = await interest.save();
            res.status(200).json({
                message: 'interest added',
                data : result
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
                message :"getall",
                data:interest
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
            const interest = await Interest.findByIdAndUpdate({ _id:req.params.id });
            interest.interest = req.body.interest;
            const result = await interest.save();
            res.status(200).json({
                message: 'interest updated',
                data:result
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
                message:"deleted",
              
            });

        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },
   

   

}