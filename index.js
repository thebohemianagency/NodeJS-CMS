//DEPENDENCIES
const fs = require('fs');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var csrf = require('csurf')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');



const stripe = require("stripe")(process.env.STRIPE);
//UTILS
const AppError = require(`${__dirname}/util/appError.js`);
const catchAsync = require(`${__dirname}/util/catchAsync`);
//CONTROLLERS
const globalErrorHandler = require(`${__dirname}/controller/errorController.js`);
const adminController = require(`${__dirname}/controller/adminController.js`);
//ROUTES
const fileRouter = require(`${__dirname}/routes/fileRoutes.js`);
const blogRouter = require(`${__dirname}/routes/blogRoutes.js`);
const productRouter = require(`${__dirname}/routes/productRoutes.js`);
const adminRouter = require(`${__dirname}/routes/adminRoutes.js`);
const reviewRouter = require(`${__dirname}/routes/reviewRoutes.js`);
const commentRouter = require(`${__dirname}/routes/commentRoutes.js`);
const subscriberRouter = require(`${__dirname}/routes/subscriberRoutes.js`);
//MODELS
const Blog = require(`${__dirname}/model/blogModel.js`)


//TEMPLATING ENGINE HANDLEBARs
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
    /* config */
    defaultLayout: 'main',
});
const app = express();


//COMPRESS Images
var compression = require('compression');
app.use(compression());


//CSFR PROTECTION (PUT ON LOGIN PAGE)
var csrfProtection = csrf({
    cookie: true
})
//BODY PARSER
var parseForm = bodyParser.urlencoded({
    extended: false
})

//Cookie Parser
app.use(cookieParser())

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// // Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: '*'
    })
);



// Serving static files
app.use(express.static(`${__dirname}/public`));
// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", ['*']);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Role, x-csrf-token"
    );
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


//API
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/subscribers', subscriberRouter);




//SSR VIEWS
var couponCode = fs.readFileSync(`${__dirname}/public/uploads/coupons.json`, "utf8");
couponCode = JSON.parse(couponCode).coupons[0]
//LANDING PAGE
app.get('/', csrfProtection, async function (req, res) {
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");

    res.render('index', {
        title: 'Mycotrax - Organic Mushroom Extracts',
        description: 'Mycotrax Is A Organic Mushroom Extract Online Retailer.  We Sell Organic Lion Mane Mushroom, Chaga Mushroom, Miatake Mushroom And Cordyceps.',
        csrfToken: req.csrfToken(),
        home: process.env.HOME_LINK,
        couponCode,
        structuredData
    });
    //blog feed, LZLOAD- twitter feed, LZLOAD-instagram feed, featured product JSON, 
});

//ABOUT PAGE
app.get('/about', async function (req, res) {
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    res.render('about', {
        title: 'Mycotrax - About Us',
        description: 'Mycotrax Is an Organic Extract Supplier. We Run Quality Control On All Products',
        home: process.env.HOME_LINK,
        structuredData,
        couponCode
    });
    //information about company / organization 
});

//FAQ PAGE
app.get('/faq', async function (req, res) {
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    res.render('faq', {
        title: 'Mycotrax - Frequently Asked Question',
        description: 'Any Questions on Organic Mushroom Extracts And Mycotrax The Company',
        home: process.env.HOME_LINK,
        structuredData,
        couponCode
    });
    //FAQ WEBSITE
});

//CONTACT PAGE
app.get('/contact', async function (req, res) {
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    res.render('contact', {
        title: 'Mycotrax - Contact Us',
        description: 'Contact Us Anytime using our online form.',
        home: process.env.HOME_LINK,
        structuredData,
        couponCode
    });
    //CONTACT FORM, CONTACT INFORMATION
});

// //POLICY PAGE  
app.get('/policy', async function (req, res) {
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    res.render('policy', {
        title: 'Mycotrax - Policy',
        description: 'Policy Page Outlining Shipping Options, Refunds And Quality Control',
        home: process.env.HOME_LINK,
        structuredData,
        couponCode
    });
});



//PRODUCT SEARCH PAGE 
app.get('/products', csrfProtection, async function (req, res) {
    //get all products, create query string
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    res.render('productSearch', {
        title: 'Mycotrax - Product Search',
        description: '',
        csrfToken: req.csrfToken(),
        query: req.query.search,
        home: process.env.HOME_LINK,
        structuredData,
        couponCode

    });
});


//PRODUCT  PAGE 
app.get('/products/product/:id', csrfProtection, catchAsync(async function (req, res) {

    //STRUCTURED DATA LOADER
    var structuredData;
    try {
        var structuredData = fs.readFileSync(`${__dirname}/public/uploads/${req.params.id}.json`, "utf8");
        structuredData = req.params.id;
    } catch (err) {
        var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    }

    //FIND PRODUCT

    var productId = req.params.id;
    //STRIPE
    stripe.products.retrieve(
        productId,
        function (err, product) {
            if (err || !product) {
                return new AppError('No product was found with that ID', 404);
            }
            //GET EACH SKU
            stripe.skus.list({
                product: product.id
            },
                //get all skus
                function (err, skus) {
                    if (err) {
                        return new AppError('Error getting SKU', 500);
                    }
                    var firstSKUSize = skus.data[0].attributes.size
                    var firstSKUPrice = skus.data[0].price / 100;
                    var firstSKUID = skus.data[0].id;
                    var firstSKUImage = skus.data[0].image;
                    var firstSKUQuantity = skus.data[0].inventory.quantity

                    res.render('product', {
                        title: 'Mycotrax - ' + product.name,
                        description: product.secondary,
                        product: product,
                        skus: skus,
                        csrfToken: req.csrfToken(),
                        prod_id: req.params.id,
                        images: product.images,
                        firstSKUSize,
                        firstSKUPrice,
                        firstSKUID,
                        firstSKUImage,
                        firstSKUQuantity,
                        home: process.env.HOME_LINK,
                        structuredData,
                        couponCode
                    });
                });
        });
}));


//BLOG PAGE
app.get('/blog', csrfProtection, async function (req, res) {
    var structuredData = fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8");
    res.render('blog', {
        title: 'Mycotrax - Articles',
        description: '',
        csrfToken: req.csrfToken(),
        home: process.env.HOME_LINK,
        structuredData,
        couponCode
    });
});

//SINGLE BLOG PAGE
app.get('/blog/:id', csrfProtection, async function (req, res) {

    //STRUCTURED DATA LOADER
    var structuredData;
    try {
        var structuredData = (fs.readFileSync(`${__dirname}/public/uploads/${req.params.id}.json`, "utf8"));
        structuredData = req.params.id
    } catch (err) {
        var structuredData = (fs.readFileSync(`${__dirname}/public/uploads/main.json`, "utf8"));
    }

    //GET ARTICLE
    var article = Blog.find({
        _id: req.params.id
    });
    article = await article;

    res.render('article', {
        title: 'Mycotrax - ' + article[0].title,
        description: article[0].description,
        article: article[0],
        content: article[0].content,
        csrfToken: req.csrfToken(),
        home: process.env.HOME_LINK,
        structuredData,
        couponCode
    });

});

//CART
app.get('/cart', csrfProtection, async function (req, res) {
    var coupons = fs.readFileSync(`${__dirname}/public/uploads/coupons.json`, "utf8");
    coupons = JSON.parse(coupons).coupons
    res.render('cart', {
        title: 'Mycotrax - Cart',
        description: '',
        coupons,
        csrfToken: req.csrfToken(),
        home: process.env.HOME_LINK,
        structuredData: "main",
        couponCode
    });
});

//RECIEPT
app.get('/reciept', async function (req, res) {
    res.render('reciept', {
        title: 'Mycotrax - Reciept',
        description: '',
        home: process.env.HOME_LINK,
        structuredData: "",
        couponCode
    });
});
//LOGIN PAGE
app.get('/login', csrfProtection, function (req, res) {
    res.render('login', {
        title: 'Welcome Please Login',
        description: 'Login Page',
        csrfToken: req.csrfToken(),
        home: process.env.HOME_LINK,
        structuredData: "",
        couponCode
    });
    //MAKE API REQUEST ON SUCCESSFUL OAUTH LOGIN
});
//ADMIN BACKEND
app.get('/cloud', adminController.verifyUser, csrfProtection,
    async function (req, res) {
        res.render('cloud', {
            csrfToken: req.csrfToken(),
            title: 'Welcome Admin',
            description: 'Admin Section',
            home: process.env.HOME_LINK,
            structuredData: "",
            couponCode
        });
    })
//CLIENT VIEWS
app.all('*', (req, res, next) => {
    res.render('error', {
        title: 'Mycotrax - Page Not Found',
        description: 'Page Not Found',
        home: process.env.HOME_LINK,
        structuredData: "",
        couponCode

    });
});

app.use(globalErrorHandler);



module.exports = app;