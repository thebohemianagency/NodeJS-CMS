const dotenv = require('dotenv');
var http = require('http')
var https = require('https')
var fs = require('fs');

dotenv.config({
    path: "./config.env"
})
const mongoose = require('mongoose');
const app = require(`${__dirname}/index.js`);

mongoose.connect(process.env.MONGO)
    .then(() => console.log("connected"));



var https = require('https')
var fs = require('fs');
https.createServer({
    key: fs.readFileSync(`${__dirname}/https/key.pem`),
    cert: fs.readFileSync(`${__dirname}/https/cert.pem`),
    ca: fs.readFileSync(`${__dirname}/https/ca.pem`)
}, app).listen(443);


app.listen(process.env.PORT, function () {
    console.log(`CMS is running on port ${process.env.PORT}`);
})