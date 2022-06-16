const UserSchema = require('../schemas/user-schema')
const PostSchema = require('../schemas/post-schema')
const {StatusCodes} = require('http-status-codes')
const mongoose = require('mongoose');

const commentCreationPage = async function (req, res) {
    res.status(StatusCodes.OK)
    .render('create-comment', { loggedInUser: req.user, postId: req.params.postId })
}

const createComment = async function (req, res) {
    const postId = req.params.postId

    await PostSchema.updateOne(
        { _id: postId },
        { $addToSet: { comments: {
            creatorId: req.user._id,
            body: req.body.body
        }}
    })

    res.status(StatusCodes.PERMANENT_REDIRECT)
    .redirect(`/posts/${postId}`)
}

const getComment = async function (req, res) {
    const commentId = req.params.commentId
    let comment;

    try {
        comment = (await PostSchema.findOne({
            comments : { $elemMatch : { _id: new mongoose.Types.ObjectId(commentId) }}
        },
        {
            comments: {
                "$filter": {
                    "input": "$comments",
                    "as": "comment",
                    "cond": { "$eq": ["$$comment._id", new mongoose.Types.ObjectId(commentId)] }
                }
            }
        }).lean())['comments'][0]
    } catch(err) {
        throw new Error('Comment does not exist.')
    }

    comment.creator = await UserSchema.findOne({ _id: comment.creatorId }).select('name').lean()

    res.status(StatusCodes.OK)
    .render('comment', { loggedInUser: req.user, comment: comment })
}

const commentEditingPage = async function (req, res) {
    const loggedInUser = req.user
    const commentId = req.params.commentId
    let comment;

    try {
        comment = (await PostSchema.findOne({
            creatorId: loggedInUser._id,
            comments : { $elemMatch : { _id: new mongoose.Types.ObjectId(commentId) }}
        },
        {
            comments: {
                "$filter": {
                    "input": "$comments",
                    "as": "comment",
                    "cond": { "$eq": ["$$comment._id", new mongoose.Types.ObjectId(commentId)] }
                }
            }
        }).lean())['comments'][0]
    } catch(err) {
        throw new Error('Comment does not exist.')
    }

    res.status(StatusCodes.OK)
    .render('edit-comment', { loggedInUser: loggedInUser, comment: comment })
}

const editComment = async function (req, res) {
    const commentId = req.params.commentId

    await PostSchema.updateOne({
        comments: {
            $elemMatch: {
                _id: { $eq: commentId },
                creatorId: { $eq: req.user._id }
            }
        }
    },
    { $set: { 'comments.$.body': req.body.body }})
    
    res.status(StatusCodes.PERMANENT_REDIRECT)
    .redirect(`/comments/${commentId}`)
}

const deleteComment = async function (req, res) {
    const commentId = req.params.commentId

    const post = await PostSchema.findOneAndUpdate({
        comments: {
            $elemMatch: {
                _id: { $eq: commentId },
                creatorId: { $eq: req.user._id }
            }
        }
    }, { $pull: { comments: { _id: commentId }}}).select('_id').lean()

    res.status(StatusCodes.PERMANENT_REDIRECT)
    .redirect(`/posts/${post._id}`)
}

module.exports = {
    commentCreationPage,
    commentEditingPage,
    createComment,
    editComment,
    getComment,
    deleteComment,
}