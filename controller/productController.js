const stripe = require("stripe")(process.env.STRIPE);
const stripeFeatures = require(`${__dirname}/../util/stripeFeatures.js`)
const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);
//Get All Products
exports.getAllProducts = catchAsync(async (req, res) => {
    stripe.products.list({
            limit: 200
        },
        //All Product With Pagination
        function (err, products) {
            let query = products.data;
            query = new stripeFeatures(query, req.query).search().category().rating().price().paginate();
            res.status(200).send({
                status: 'success',
                results: query.totalRes,
                data: {
                    products: query.stripeData
                }
            })
        }
    );
})
//Get Single Product For Display
exports.getSingleProduct = catchAsync(async (req, res, next) => {
    var productId = req.params.id;
    //STRIPE
    stripe.products.retrieve(
        productId,
        function (err, product) {
            if (err || !product) {
                return next(new AppError('No product was found with that ID', 404));
            }
            //GET EACH SKU
            stripe.skus.list({
                    product: product.id
                },
                function (err, skus) {
                    if (err) {
                        return next(new AppError('Error getting SKU', 500));
                    }
                    res.status(200).send({
                        status: 'success',
                        data: {
                            product,
                            skus: skus.data
                        }
                    })
                });
        }
    );
})

//get all categories
exports.getCategoryList = catchAsync(async (req, res) => {
    stripe.products.list({
            limit: 200
        },
        //get all products
        function (err, products) {
            var products = products.data
            var categories = [];
            products.forEach(product => {
                //declare variable holder
                var categoryToAdd = true;
                //add first category
                if (categories.length < 1) {
                    categories.push(product.metadata.category)
                } else {
                    //sort through growing category list 
                    categories.forEach(category => {
                        if (product.metadata.category !== category && categoryToAdd != false) {
                            categoryToAdd = true;
                        } else {
                            //already in array, move on to next product
                            categoryToAdd = false;
                        }
                    });
                    //made through entire array
                    if (categoryToAdd != false) {
                        categories.push(product.metadata.category)
                    }
                }
            });
            //send to clients
            res.status(200).send({
                status: 'success',
                results: categories.length,
                data: {
                    categories
                }
            })
        }
    );
})
exports.getAllTransactions = catchAsync(async (req, res) => {
    stripe.issuing.transactions.list({},
        function (err, transactions) {
            // asynchronously called
            let query = products.data;
            query = new stripeFeatures(query, req.query).search().category().rating().price().paginate();;
            res.status(200).send({
                status: 'success',
                results: query.totalRes,
                data: {
                    transactions: query.stripeData
                }
            })
        }
    );
})
exports.deleteProduct = catchAsync(async (req, res) => {
    stripe.products.del(
        req.params.id,
        function (err, confirmation) {
            // asynchronously called
            res.status(200).send({
                status: 'success',
            })
        },
    );
})
exports.getAllSKUs = catchAsync(async (req, res) => {
    var product = req.params.prodid;
    stripe.skus.list({
            product
        },
        function (err, skus) {
            let query = skus.data;
            query = new stripeFeatures(query, req.query).search().category().rating().price().paginate();
            // asynchronously called
            res.status(200).send({
                status: 'success',
                data: {
                    skus: query
                }
            })
        }
    );
})
exports.checkOut = catchAsync(async (req, res) => {
    //create order
    stripe.orders.update(
        req.body.orderId, {
            selected_shipping_method: req.body.selected_shipping_method_id
        },
        function (err, order) {
            // asynchronously called
            stripe.orders.pay(
                order.id, {
                    source: req.body.token.id,
                },
                function (err, order) {
                    res.status(200).json({
                        reciept: order
                    });
                }
            );
        }
    );
})
exports.createOrder = catchAsync(async (req, res) => {
    stripe.orders.create(req.body.order, function (err, order) {
        res.status(200).json({
            order: order
        });
    });
})

exports.getSKU = catchAsync(async (req, res) => {
    stripe.skus.retrieve(
        req.params.id,
        function (err, sku) {
            res.status(200).json({
                sku: sku
            });
        }
    );
})

exports.listCoupons = catchAsync(async (req, res) => {
    stripe.coupons.list({},
        function (err, coupons) {
            res.status(200).json({
                coupons: coupons
            });
        }
    );
})