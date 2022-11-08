//Requiring the modules
const dotenv = require('dotenv') 
const express = require('express')
const path = require('path')
let port = process.env.PORT || 5000
const mongoose = require('mongoose')
const SocketServer = require('./socketServer')
const {ExpressPeerServer} = require('peer')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const envFile = process.env.NODE_ENV === 'test' ? `.env.test` : '.env'
dotenv.config({path: envFile})
//Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection',socket => {
    SocketServer(socket)
})


//Create peer server
ExpressPeerServer(http,{path: '/'})

app.get("/findAllGroups",(req,res)=>{
    Group.find({})
    .then(data=>{
        res.send(data)
    })
    .catch(err=>{
        res.status(500).send({
            message : err.message || "Some error occurred while retrieving groups."
        })
    })
})


//Routes
app.use('/api',require('./routes/authRouter'))
app.use('/api',require('./routes/userRouter'))
app.use('/api',require('./routes/postRouter'))
app.use('/api',require('./routes/commentRouter'))
app.use('/api',require('./routes/notifyRouter'))
app.use('/api',require('./routes/messageRouter'))
app.use('/api',require('./routes/groupRouter'))

//Connecting the database for the blog
const URI = process.env.MONGODB_URL;
mongoose.connect(URI,{
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser : true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err
    console.log('Successfully connected to the mongodb database')
})

//default get request response
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    })
}

//Listening to the port
app.listen(port,()=>{
    console.log(`The server is running at port ${port}`)
})

module.exports = http