const express = require('express');
const subscriberController = require(`${__dirname}/../controller/subscriberController`);
const adminController = require(`${__dirname}/../controller/adminController`);
const router = express.Router();

router.route('/')
    .get(adminController.verifyUser, subscriberController.getAllSubscribers)
    .post(subscriberController.addSubscriber)
router.route('/contact')
    .post(subscriberController.sendContactEmail)
router.route('/send')
    .post(adminController.verifyUser, subscriberController.sendTemplatedEmail)
// router.route('/send-template')
//     .post(subscriberController.sendTemplatedEmail)
router.route('/:id')
    .delete(adminController.verifyUser, subscriberController.deleteSubscriber)
module.exports = router;