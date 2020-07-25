const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);
const fs = require('fs');
const path = require('path');

//MIDDLEWARE


//CRUD 
exports.getAllFiles = catchAsync(async (req, res) => {
    //get all files in uploads
    let files = fs.readdirSync('./public/uploads', function (err, data) {})
    res.status(200).send({
        status: 'success',
        results: files.length,
        data: {
            files
        }
    })
})
exports.uploadFiles = catchAsync(async (req, res) => {
    res.status(200).send({
        status: 'File was uploaded successfully',
    })
})

exports.deleteFile = catchAsync(async (req, res) => {
    if (req.params.filename == 'sitemap.xml' || req.params.filename == 'coupons.json' || req.params.filename == 'structuredData.json') {
        res.status(400).send({
            status: 'That File Cannot Be Deleted',
        })
    } else {
        fs.unlinkSync('./public/uploads/' + req.params.filename, function (err) {});
        res.status(200).send({
            status: 'success',
        })
    }
})