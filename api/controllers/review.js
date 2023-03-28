const Review = require('../models/review');
const User = require('../models/user');
const { customError } = require('../middlewares/errors');


const addReview = async (senderId, receiverId, rating) => {
    try {

        const receiver = await User.findOne({ _id: receiverId });
        const newRating = (receiver.rating * receiver.ratingCount + rating) / (receiver.ratingCount + 1);
        receiver.rating = newRating;
        receiver.ratingCount = receiver.ratingCount + 1;
        await receiver.save();

        // check if review already exists
        const oldReview = await Review.findOne({ sender: senderId, receiver: receiverId });
        if (oldReview) {
            return oldReview;
        } else {
            const review = new Review({ sender: senderId, receiver: receiverId });
            return await review.save();
        }
    }
    catch (err) {
        console.log(err);
    }
};

const updateRating = async (senderId, receiverId, rating) => {
    try {

        const receiver = await User.findOne({ _id: receiverId });
        const newRating = (receiver.rating * receiver.ratingCount + rating) / (receiver.ratingCount + 1);
        receiver.rating = newRating;
        receiver.ratingCount = receiver.ratingCount + 1;
        await receiver.save();

        await Review.findOneAndDelete({ sender: receiverId, receiver: senderId });

    }
    catch (err) {
        console.log(err);
    }
};


const getReviews = async (user) => {
    try {
        return await Review.find({ receiver: user });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports = {

    async getReviewList(req, res, next) {
        try {
            const reviews = await Review.find({ user: req.body.id });
            console.log(reviews);
            res.status(200).json({
                reviews: reviews
            });

        }
        catch (err) {
            customError(err);
        }
    },

    async onReview(io, data) {
        if (data.end) {
            updateRating(data.sender, data.receiverId, data.rating);
            const senderReviews = await getReviews(data.sender);
            const receiverReviews = await getReviews(data.receiverId);
            io.to(data.receiverEmail).emit('review', { reviews: receiverReviews });
            io.to(data.senderEmail).emit('review', { reviews: senderReviews });
        }
        else {
            await addReview(data.sender, data.receiverId, data.rating);
            const reviews = await getReviews(data.receiverId);
            io.to(data.receiverEmail).emit('review', {
                reviews: reviews,
                id: data.sender
            });
        }
    }


}