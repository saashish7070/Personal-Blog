const mongoose = require('mongoose')

const commentModel = new mongoose.Schema({
    content: {
        type: String,
        text: String,
        media: Array
    },
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId
},{
    timestamps: true
})

module.exports = mongoose.model('comment',commentSchema)