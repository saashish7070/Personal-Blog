const mongoose = require('mongoose')

const group = {
    name: {
        type: String,
        required: true,
        unique:false
    },
    tags: {
        type: [String]
    },
    privacy: {
        type: Boolean,
        required: true,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    admins: {
        type:{type: mongoose.Types.ObjectId,ref: 'user'},
    },
    users: {
        type:{type: mongoose.Types.ObjectId,ref: 'user'},
    },
    posts: {
        type:{type: mongoose.Types.ObjectId,ref: 'post'},
    },
    deletedPosts: {
        type: [String],
        default:[],
        required: true
    },
    joinRequests:{
        type:{type: mongoose.Types.ObjectId,ref: 'user'},
        default: []
    },
    invitedUsers:{
        type:{type: mongoose.Types.ObjectId,ref: 'user'},
        default: []
    },
};

const groupSchema = new mongoose.Schema(group,{
    timestamps: true
})

module.exports = mongoose.exports('group',groupSchema)