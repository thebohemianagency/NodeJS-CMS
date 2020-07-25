const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Your Email!'],
        unique: [true, 'You are already a subscriber']
    },
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
module.exports = Subscriber;