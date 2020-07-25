const Blog = require(`${__dirname}/../model/blogModel.js`)
const mongoFeatures = require(`${__dirname}/../util/mongoFeatures.js`);
const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);
//MIDDLEWARE
//Popular Posts
exports.aliasMostPopular = (req, res, next) => {
    req.query.limit('5');
    req.query.sort('-rating');
    req.query.fields('name', 'price', 'ratingAverage', 'description');
    next();
}

//Missing Fields Check
exports.checkBody = function (req, res, next) {
    if (!req.body.title || !req.body.content || !req.body.description) {
        return res.status(401).send({
            status: 'fail',
            message: "Please Fill Out All Fields"
        })
    }
    next();
}

//CRUD 
exports.getAllBlogPosts = catchAsync(async (req, res) => {
    let features = new mongoFeatures(Blog.find(), req.query).filter().sort().limitFields();
    let blogPagination = await features.query;
    features = new mongoFeatures(Blog.find(), req.query).filter().sort().limitFields().paginate();
    const blogs = await features.query
    res.status(200).send({
        status: 'success',
        results: blogPagination.length,
        data: {
            blogs
        }
    })
})

exports.addBlogPost = catchAsync(async (req, res) => {
    const newBlog = await Blog.create(req.body);
    res.status(201).send({
        status: "success",
        data: {
            blog: newBlog
        }
    })
    //UPDATE SITEMAP
    //CREATE STRUCTURED DATA FOR ARTICLE
    //NOTIFY GOOGLE OF NEW CONTENT
})

exports.getSingleBlogPost = catchAsync(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return next(new AppError('No blog was found with that ID', 404));
    }
    res.status(200).send({
        status: 'success',
        data: {
            blog
        }
    })
})

exports.updateSingleBlogPost = catchAsync(async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!blog) {
        return next(new AppError('No blog was found with that ID', 404));
    }
    res.status(200).send({
        status: 'success',
        data: {
            blog
        }
    })
})

exports.deleteSingleBlogPost = catchAsync(async (req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
        return next(new AppError('No blog was found with that ID', 404));
    }
    res.status(204).send({
        status: 'success',
        data: null
    })
})