const Review = require(`${__dirname}/../model/reviewModel.js`);
const mongoFeatures = require(`${__dirname}/../util/mongoFeatures.js`);
const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);
const stripe = require("stripe")(process.env.STRIPE);
const stripeFeatures = require(`${__dirname}/../util/stripeFeatures.js`)
//MIDDLEWARE

// //Missing Fields Check
// exports.checkBody = function (req, res, next) {
//     if (!req.body.title || !req.body.review || !req.body.user || !req.body.ranking) {
//         return res.status(401).send({
//             status: 'fail',
//             message: "Please Fill Out All Fields"
//         })
//     }
//     next();
// }

//ALL REVIEW (resticted for admin user)
exports.getAllReviews = catchAsync(async (req, res) => {
    let features = new mongoFeatures(Review.find(), req.query).filter().sort().limitFields();
    let reviewPagination = await features.query;
    features = new mongoFeatures(Review.find(), req.query).filter().sort().limitFields().paginate();
    const reviews = await features.query;
    res.status(200).send({
        status: 'success',
        results: reviewPagination.length,
        data: {
            reviews
        }
    })
})

exports.createReview = catchAsync(async (req, res) => {
    const newReview = await Review.create(req.body);


    var productID = req.body.prod_id;
    //send request to review db  with 
    let singleProductReveiws = await Review.find({
        prod_id: productID
    });
    let totalReview = parseInt(singleProductReveiws.length);
    let averageRating = 0;
    //get all reviews of a product
    //single product reviews
    singleProductReveiws.forEach(review => {
        averageRating += review.rating
    });
    averageRating = parseInt(averageRating) / totalReview;
    averageRating = averageRating.toFixed(1);
    //STRIPE
    stripe.products.update(
        productID, {
            metadata: {
                rating: averageRating,
                numberOfReviews: totalReview
            }
        },
        function (err, product) {
            if (err || !product) {
                return next(new AppError('No product was found with that ID', 404));
            }
            res.status(200).send({
                status: 'success - Review Added Updated',
                data: {
                    totalReview,
                    averageRating
                }
            })
        })
})

exports.deleteReview = catchAsync(async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new AppError('No reviews was found with that ID', 404));
    }
    res.status(204).send({
        status: 'success',
        data: null
    })
    //add REMOVE FROM Structured Data, Add Reveiw to MONGODB
    //add SEND Update To Google
})

exports.updateProductReviewAverage = catchAsync(async (req, res) => {
    //get all reviews with product number

    var productID = req.body.prod_id;
    //send request to review db  with 
    let singleProductReveiws = await Review.find({
        prod_id: productID
    });
    let totalReview = parseInt(singleProductReveiws.length);
    let averageRating = 0;
    //get all reviews of a product
    //single product reviews
    singleProductReveiws.forEach(review => {
        averageRating += review.rating
    });
    averageRating = parseInt(averageRating) / totalReview;
    //STRIPE
    stripe.products.update(
        productID, {
            metadata: {
                rating: averageRating,
            }
        },
        function (err, product) {
            if (err || !product) {
                return next(new AppError('No product was found with that ID', 404));
            }
            res.status(200).send({
                status: 'success - Review Added Updated',
                data: {
                    totalReview,
                    averageRating
                }
            })
        })
})