const mongoose = require('mongoose')

const post = {
    content: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: false
    },
    groupId: {
        type: mongoose.Types.ObjectId,
        ref: 'group',
        required: true
    },
    likes:[{type: mongoose.Types.ObjectId, ref:'user'}],
    comments:[{type: mongoose.Types.ObjectId, ref:'comment'}],
    user:[{type: mongoose.Types.ObjectId, ref:'user'}],
    isHidden: {
        type: Boolean,
        default: false,
        required: true
    },
    isFlagged: {
        type: Boolean,
        default: false,
        required: true
    }
}

const postSchema = new mongoose.Schema(post,{
    timestamps: true
})

module.exports = mongoose.model('post',postSchema)