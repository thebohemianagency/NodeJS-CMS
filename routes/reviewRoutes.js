const express = require('express');
const reviewController = require(`${__dirname}/../controller/reviewController`);
const adminController = require(`${__dirname}/../controller/adminController`);
const router = express.Router();

router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview, reviewController.updateProductReviewAverage)
router.route('/update/:prodid')
    .get(reviewController.updateProductReviewAverage)
router.route('/:id')
    .delete(adminController.verifyUser, reviewController.deleteReview)
module.exports = router;