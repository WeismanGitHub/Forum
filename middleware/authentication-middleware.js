const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        res.status(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED).render('authentication');
        return
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: payload.userId, name: payload.name };
        next();
    } catch (error) {
        res.status(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED).render('authentication');
    }
};

module.exports = authenticationMiddleware;