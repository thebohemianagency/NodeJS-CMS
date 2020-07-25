const Comment = require(`${__dirname}/../model/commentModel.js`);
const mongoFeatures = require(`${__dirname}/../util/mongoFeatures.js`);
const catchAsync = require(`${__dirname}/../util/catchAsync`);
const AppError = require(`${__dirname}/../util/appError`);



//ALL REVIEW (resticted for admin user)
exports.getAllComments = catchAsync(async (req, res) => {
    let features = new mongoFeatures(Comment.find(), req.query).filter().sort().limitFields();
    let commentPagination = await features.query;
    features = new mongoFeatures(Comment.find(), req.query).filter().sort().limitFields().paginate();
    const comments = await features.query;
    res.status(200).send({
        status: 'success',
        results: commentPagination.length,
        data: {
            comments
        }
    })
})
exports.createComment = catchAsync(async (req, res) => {
    const newComment = await Comment.create(req.body);
    res.status(200).send({
        status: 'success - Comment Added Updated',
        data: {}
    })
})
exports.deleteComment = catchAsync(async (req, res) => {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
        return next(new AppError('No comments was found with that ID', 404));
    }
    res.status(204).send({
        status: 'success',
        data: null
    })
})