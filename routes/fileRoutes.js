const express = require('express');
const router = express.Router();
const fileController = require(`${__dirname}/../controller/fileController.js`);
const adminController = require(`${__dirname}/../controller/adminController.js`);
const fs = require('fs');
const multer = require('multer');

//Multer Settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.originalname == 'sitemap.xml' || file.originalname == 'coupons.json' || file.originalname == 'structuredData.json') {
        cb(null, true);
    } else {
        fs.exists('./public/uploads/' + file.originalname, function (exists) {
            if (exists) {
                cb(new Error('FIle Name Exists'))
            } else {
                cb(null, true);
            }
        });
    }
};
const upload = multer({
    fileFilter,
    storage: storage
});

router.route('/')
    .get(adminController.verifyUser, fileController.getAllFiles)
    .post(adminController.verifyUser, upload.single("file"), fileController.uploadFiles);
router.route('/:filename')
    .delete(adminController.verifyUser, fileController.deleteFile)
module.exports = router;