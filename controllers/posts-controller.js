const { StatusCodes } =  require('http-status-codes')
const PostSchema = require('../schemas/post-schema')
const userSchema = require('../schemas/user-schema')

const postCreationPage = async function (req, res) {
    res.status(StatusCodes.OK)
    .render('create-post', { loggedInUser: req.user })
}

const createPost = async (req, res) => {
    let post = await PostSchema.create({ ...req.body, creatorId: req.user._id })
    
    res.status(StatusCodes.CREATED)
    .redirect('/posts/' + post._id)
}

const getPost = async (req, res) => {
    const post = await PostSchema.findById(req.params.postId).select('-__v -updatedAt').lean()
    
    if (!post) throw new Error('Post does not exist.')

    post.creator = await userSchema.findById(post.creatorId).select('name').lean()

    res.status(StatusCodes.OK)
    .render('post', { loggedInUser: req.user, post: post })
}

const postEditingPage = async (req, res) => {
    const loggedInUser = req.user
    const post = await PostSchema.findOne({ creatorId: loggedInUser._id, _id: req.params.postId }).lean()

    res.status(StatusCodes.OK)
    .render('edit-post', { post: post, loggedInUser: loggedInUser })
}

const editPost = async (req, res) => {
    const postId = req.params.postId
    await PostSchema.updateOne({ _id: postId, creatorId: req.user._id }, req.body)

    res.status(StatusCodes.PERMANENT_REDIRECT)
    .redirect(`/posts/${postId}`)
}

const deletePost = async (req, res) => {
    await PostSchema.deleteOne({ _id: req.params.postId, creatorId: req.user._id })
    
    res.status(StatusCodes.PERMANENT_REDIRECT)
    .redirect('/')
}

module.exports = {
    postCreationPage,
    postEditingPage,
    deletePost,
    createPost,
    editPost,
    getPost,
}