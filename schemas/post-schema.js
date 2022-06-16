const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide an author. (Most likely a server error.)'],
        immutable: true,
    },
    body: {
        type: String,
        required: [true, 'Please provide a body.'],
        minlength: 1,
        maxlength: 500,
        trim: true,
    }
},
{ timestamps: { createdAt: true, updatedAt: false } })

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title.'],
        minlength: 1,
        maxlength: 100,
        trim: true,
    },
    body: {
        type: String,
        required: [true, 'Please provide a body.'],
        minlength: 1,
        maxlength: 1000,
        trim: true,
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide an uploader. (Most likely a server error.)'],
        immutable: true,
    },
    upvotes: [{ type: mongoose.Types.ObjectId }],
    downvotes: [{ type: mongoose.Types.ObjectId }],
    score: {
        type: Number,
        required: [true, 'All users must have a score. (Most likely a server error.)'],
        default: 0,
    },
    comments: [ CommentSchema ]
},
{ timestamps: { createdAt: true, updatedAt: false } })

PostSchema.pre('deleteOne', { document: true }, async function() {
    await CommentSchema.deleteMany({ post: this._id })
})

PostSchema.pre('$addToSet', async function() {
    if ('upvoted') {
        //add one to post score
        //add one to user score
    }

    if ('downvoted') {
        //subtract one from post score
        //subtract one from user score
    }
});

PostSchema.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidatorsAndSetNew);
    schema.pre('updateOne', setRunValidatorsAndSetNew);
});

CommentSchema.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidatorsAndSetNew);
    schema.pre('updateOne', setRunValidatorsAndSetNew);
});

function setRunValidatorsAndSetNew() {
    this.setOptions({ runValidators: true, new: true });
}

module.exports = mongoose.model('posts', PostSchema);