const mongoose = require('mongoose')

const user = {
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    isActive: {
        type: Boolean,
    },
    avatar:{
        type: String,
    },
    role:{
        type: String,
        default: 'user'
    },
    gender:{
        type: String
    },
    mobile: {
        type: String,
        default:''
    },
    address: {
        type: String,
        default: ''
    },
    groups: [{type:mongoose.Types.ObjectId, ref: 'group'}] 
} 
const userSchema = new mongoose.Schema(user,{
    timestamps: true
})

module.exports = mongoose.model('user',userSchema)