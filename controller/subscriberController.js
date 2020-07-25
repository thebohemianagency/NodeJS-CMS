const Subscriber = require(`${__dirname}/../model/subscriberModel.js`);
const mongoFeatures = require(`${__dirname}/../util/mongoFeatures.js`);
const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);
const nodemailer = require('nodemailer');


//ALL REVIEW (resticted for admin user)
exports.getAllSubscribers = catchAsync(async (req, res) => {
    let features = new mongoFeatures(Subscriber.find(), req.query).filter().sort().limitFields();
    let subscriberPagination = await features.query;
    features = new mongoFeatures(Subscriber.find(), req.query).filter().sort().limitFields().paginate();
    const subscribers = await features.query;
    res.status(200).send({
        status: 'success',
        results: subscriberPagination.length,
        data: {
            subscribers
        }
    })
})

exports.addSubscriber = catchAsync(async (req, res) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email) == false) {
        return next(new AppError('Not a valid email address', 400));
    }
    const newSubscriber = await Subscriber.create(req.body);
    res.status(200).send({
        status: 'success - Subscriber Added Updated',
        data: {
            subscriber: newSubscriber
        }
    })
})

exports.deleteSubscriber = catchAsync(async (req, res) => {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
        return next(new AppError('No subscribers was found with that ID', 404));
    }
    res.status(204).send({
        status: 'success',
        data: null
    })
})

exports.sendMassEmail = catchAsync(async (req, res) => {

    let subscribers = req.body.subscribers
    let subject = req.body.subject
    let text = req.body.text
    console.log(subscribers);
    //email
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // 2) Define the email options
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: subscribers,
        subject: subject,
        text: text
        // html:
    };
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);

    res.status(200).send({
        status: 'success - Subscriber Email Sent',
    })
})

exports.sendContactEmail = catchAsync(async (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let question = req.body.question
    let subject = "You Have A Question From " + name + " Email: " + email;
    let text = question

    //email
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: process.env.FROM_EMAIL,
        subject: subject,
        text: text
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send({
        status: 'success - Email Sent',
    })
})



// ///EMAIL TEMPLATING
const emailTemplate = require('email-templates').EmailTemplate
const path = require('path');
const Promise = require('bluebird');
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

function sendEmail(obj) {
    return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
    let template = new emailTemplate(path.join(__dirname, "../templates", templateName));
    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}
exports.sendTemplatedEmail = catchAsync(async (req, res) => {
    let contacts = req.body.subscribers
    let subject = req.body.subject
    let body = req.body.text
    var context = [];
    for (var i = 0; i <= contacts.length; i++) {
        context.push({
            subject: subject,
            body: body,
            email: contacts[i]
        });
    }
    loadTemplate('starter', context).then((results) => {
        return Promise.all(results.map((result) => {
            sendEmail({
                to: contacts,
                from: "The Mycotrax Team <tony@tonysworking.com>",
                subject: result.email.subject,
                html: result.email.html,
                text: result.email.text,
            });
        }));
    }).then(() => {
        res.status(200).send({
            status: 'success - Subscriber Email Sent',
        })
    });
})