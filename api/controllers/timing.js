
const Timing = require('../models/timing');


module.exports = {


    async addTiming (req, res, next) {
        try {
            const timing = new Timing(req.body);

            const result = await timing.save();
            res.status(200).json({
                message: 'timing added',
                data : result
            });

        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },

    async getTiming (req, res, next) {
        try {
            const timing = await Timing.find();
            res.status(200).json({
                message :"getall",
                data:timing
            });

        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },

    async updateTiming (req, res, next) {
        try {
            const timing = await Timing.findByIdAndUpdate({ _id:req.params.id });
            timing.time_duration = req.body.time_duration;
            const result = await timing.save();
            res.status(200).json({
                message: 'timing updated',
                data:result
            });
        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    },
    
}