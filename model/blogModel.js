const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        maxLength: [80, "A Blog Title Can Only Have 200 Characters"],
        minLength: [10, "A Blog Title Must Have More Than 10 Characters"]
    },
    category: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [200, "A Blog Description Can Only Have 200 Characters"],
        minLength: [80, "A Blog Title Must Have More Than 80 Characters"]
    },
    imageLinkUrl: {
        type: String,
    },
    timeCreated: {
        type: Date,
        default: Date.now(),
    }
})

// blogSchema.index({
//     title: 'text',
//     content: 'text',
//     category: 'text',
//     keywords: 'text'

// }, {
//     weights: {
//         title: 4,
//         category: 5,
//         content: 2,
//         keywords: 1,
//     },
// });
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;