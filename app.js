const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

require('express-async-errors');
require('dotenv').config();

const notFoundMiddleware = require('./middleware/not-found-middleware')
const errorHandler = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication-middleware')

const authenticationRouter = require('./routers/authentication-router')
const frontEndRouter = require('./routers/frontend-router')
const commentRouter = require('./routers/comments-router')
const postRouter = require('./routers/posts-router')
const userRouter = require('./routers/users-router')

const port = process.env.PORT || 5000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(cors())

app.use('/comments/', authenticationMiddleware, commentRouter)
app.use('/users', authenticationMiddleware, userRouter)
app.use('/posts', authenticationMiddleware, postRouter)
app.use('/authentication', authenticationRouter)
app.use('/', frontEndRouter)

app.use(notFoundMiddleware)
app.use(errorHandler)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
        .then(console.log('Connected to database...'));
        
        app.listen(port, console.log(`Server is starting on ${port}...`));

    } catch (error) {
        console.error(error);
    };
};

start();
