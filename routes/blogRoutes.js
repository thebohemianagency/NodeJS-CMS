const express = require('express');
const router = express.Router();
const blogController = require(`${__dirname}/../controller/blogController.js`);
const adminController = require(`${__dirname}/../controller/adminController.js`);


router.route('/')
    .get(blogController.getAllBlogPosts)
    .post(blogController.checkBody, blogController.addBlogPost)
router.route('/:id')
    //get reviews with blog post
    .get(blogController.getSingleBlogPost)
    .patch(adminController.verifyUser, blogController.updateSingleBlogPost)
    .delete(adminController.verifyUser, blogController.deleteSingleBlogPost)
module.exports = router;