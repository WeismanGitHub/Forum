const { StatusCodes } =  require('http-status-codes')
const UserSchema = require('../schemas/user-schema')
const PostSchema = require('../schemas/post-schema')

const logout = (req, res) => {
    res.status(StatusCodes.OK)
    .clearCookie("token")
    .redirect('/authentication')
}

const deleteUser = async (req, res) => {
    const userId = req.user._id
    //It isn't deleted right away because the middleware to delete the user's posts won't run then.
    const user = await UserSchema.findOne({ _id: userId })
    await user.deleteOne()

    res.status(StatusCodes.OK)
    .clearCookie("token")
    .redirect('/authentication')
}

const updateUser = async (req, res) => {
    let loggedInUser = await UserSchema.findByIdAndUpdate(req.user._id, req.body).select('_id')
    const token = loggedInUser.createJWT()

    res.status(StatusCodes.PERMANENT_REDIRECT)
    .cookie('token', token)
    .redirect(`/users/${loggedInUser._id}`)
}

const getUser = async (req, res) => {
    const paramUserId = req.params.userId
    const loggedInUser = req.user
    const user = await UserSchema.findById(paramUserId).select('name createdAt').lean()

    if (!user) throw new Error('User does not exist.')

    res.status(StatusCodes.OK)
    .render('user', { user: user, loggedInUser: loggedInUser })
}

const getUsersPosts = async (req, res) => {
    const loggedInUser = req.user
    const paramsUser = req.params.userId

    const posts = await PostSchema.find({ creatorId: paramsUser }).sort({ createdAt: -1 }).lean()
    const user = await UserSchema.findOne({ _id: paramsUser }).select('name -_id').lean()

    if (!user) throw new Error('User does not exist.')
    
    res.status(StatusCodes.OK)
    .render('users-posts', {
        loggedInUser: loggedInUser,
        posts: posts,
        thereArePosts: Boolean(posts.length),
        user: user
    })
}

module.exports = {
    getUsersPosts,
    updateUser,
    deleteUser,
    getUser,
    logout,
}