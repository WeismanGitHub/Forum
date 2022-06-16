const {StatusCodes} = require('http-status-codes')
const UserSchema = require('../schemas/user-schema')

const register = async (req, res) => {
    const loggedInUser = await UserSchema.create(req.body)
    const token = loggedInUser.createJWT()

    res.status(StatusCodes.CREATED)
    .cookie('token', token)
    .redirect('/')
}

const login = async (req, res) => {
    const { name, password } = req.body
    const loggedInUser = await UserSchema.findOne({ name: name })

    if (!loggedInUser) {
        throw new Error('Please provide a valid name.')
    }
    
    const PasswordIsCorrect = await loggedInUser.checkPassword(password)

    if (!PasswordIsCorrect) {
        throw new Error('Please provide the correct password.')
    }

    const token = loggedInUser.createJWT()

    res.status(StatusCodes.PERMANENT_REDIRECT)
    .cookie('token', token)
    .redirect('/')
}

module.exports = {
    register,
    login
}