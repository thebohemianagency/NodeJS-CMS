const express = require('express');
const adminController = require(`${__dirname}/../controller/adminController`);
const router = express.Router();




router.route('/')
    .post(adminController.createToken) //creates user token, 
    .get(adminController.verifyUser)

module.exports = router;