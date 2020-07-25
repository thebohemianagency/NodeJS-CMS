const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    prod_id: {
        type: String,
        required: [true, "A reveiw must have an ID"]
    },
    name: {
        type: String,
        required: [true, 'Review must belong to a user']
    },
    userImageLink: {
        type: String,
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;