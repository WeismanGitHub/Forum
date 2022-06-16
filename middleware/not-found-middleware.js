const { StatusCodes } = require('http-status-codes');

const notFoundMiddleware = (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND)
    .render('not-found', { route: req.originalUrl })
}

module.exports = notFoundMiddleware