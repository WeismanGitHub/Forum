const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const PostSchema = require('./post-schema')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        minlength: 1,
        maxlength: 25,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 6,
        maxlength: 50,
        trim: true,
    },
    score: {
        type: Number,
        required: [true, 'All users must have a score. (Most likely a server error.)'],
        default: 0,
    }
},
{ timestamps: { createdAt: true, updatedAt: false } })

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('findOneAndUpdate', async function() {
    const user = this.getUpdate()

    if ((50 <= user.password.length) || (user.password.length <= 6)) {
        throw new Error('Please provide a valid password.\n(6-50 characters)')
    }

    if ((25 <= user.name.length) || (user.name.length <= 1)) {
        throw new Error('Please provide a valid name.\n(1-25 characters)')
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

UserSchema.pre('deleteOne', { document: true }, async function() {
    const userId = this._id

    await PostSchema.deleteMany({ creatorId: userId })
    await PostSchema.updateMany({
        comments: {
            $elemMatch: {
                creatorId: { $eq: userId }
            }
        }
    }, { $pull: { comments: { creatorId: userId }}})

})

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

UserSchema.methods.checkPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('users', UserSchema);