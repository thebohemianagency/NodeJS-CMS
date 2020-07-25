const express = require('express');
const commentController = require(`${__dirname}/../controller/commentController`);
const adminController = require(`${__dirname}/../controller/adminController`);
const router = express.Router();

router.route('/')
    .get(commentController.getAllComments)
    .post(commentController.createComment)
router.route('/:id')
    .delete(adminController.verifyUser, commentController.deleteComment)
module.exports = router;