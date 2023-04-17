const Admin = require("../models/admin.js");


module.exports = {


    async add_admin(req, res, next) {
        try {
            /// saving user into DB ///
            const saveduser = new Admin(req.body);
            await saveduser.save();
            return res.status(200).json(saveduser)

        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },

    async get_admin(req, res, next) {
        try {
            const user = await Admin.findOne({ email: req.body.email })
            if (!user) return res.status(403).json({
                message: "invalid email"
            })
            if (user.password !== req.body.password) {
                return res.status(403).json({
                    message: "wrong password"
                })
            }
            res.status(200).json({
                message: "logedin",
                data: user
            })


        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },

    async update_admin(req, res, next) {
        try {

            const user = await Admin.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            return res.status(200).json(user)

        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    },
    async delete_admin(req, res, next) {
        try {
            /// select all users  ///
            const user = await Admin.findByIdAndDelete(req.params.id)
            return res.status(200).json({ message: "user deleted" })


        }
        catch (err) {
            res.status(500).json({
                error: err.message
            });
        }

    },




}