const { StatusCodes } =  require('http-status-codes')
const PostSchema = require('../schemas/post-schema')
const UserSchema = require('../schemas/user-schema')

const home = async (req, res) => {
    const loggedInUser = req.user
    const posts = await PostSchema.find().sort({ createdAt: -1 }).lean()

    res.status(StatusCodes.OK)
    .render('home', { loggedInUser: loggedInUser, posts: posts, thereArePosts: Boolean(posts.length) })
}

const user = async (req, res) => {
    //createdAt isn't included in req.user so I've gotta retrieve the user from the database.
    const loggedInUser = await UserSchema.findById(req.user._id).select('createdAt name').lean()
    
    res.status(StatusCodes.OK)
    .render('user', { loggedInUser: loggedInUser })
}

const authenticationPage = (req, res) => {
    res.status(StatusCodes.OK).render('authentication');
}

module.exports = {
    authenticationPage,
    home,
    user,
}