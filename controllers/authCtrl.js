const Users = require('../models/userModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const authCtrl = {
    register: async(req,res)=>{
        try{
            const {fullname,username,email,password,gender,isActive} = req.body;
            let newUserName = username.toLowerCase().replace(/ /g,'')

            const user_name = await Users.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg:"This user name already exists."})
            
            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: " This email already exists"})
            
            if(password.length < 6) return res.status(400).json({msg:"Password must be atleast 6 characters."})

            const passwordHash = await bcrypt.hash(password,12)

            const newUser = new Users({
                fullname,username: newUserName,email,password:passwordHash,gender,isActive
            })

            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken',refresh_token,{
                httpOnly: true,
                path:'/api/refresh_token',
                maxAge: 30*24*60*60*1000
            })
            await newUser.save()
            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    login: async(req,res)=>{
        try{
            const {email,username,password} = req.body;

            const user = await Users.findOne({email})
        if(!user) return res.status(400).json({msg: "This email doesnot exist."})
        if(!user.isActive || user.isActive === 'false') return res.status(400).json({msg: "This account has been deactivated. Log in with or create a new account."})

        const isMatch2 = (user.username === username)
        if(!isMatch2) return res.status(400).json({msg: "Wrong Username"})
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({msg: "Incorrect Password.Cannot login after 3 incorrect trials"})
        
        const access_token =createAccessToken({id: user._id})
        const refresh_token = createRefreshToken({id: user._id})

        res.cookie('refreshtoken',refresh_token,{
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30*24*60*60*1000
        })
        res.json({
            msg:'Login Success!',
            access_token,
            user:{
                ...user._doc,
                password:''
            }
        })
    }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    logout: async(req,res)=>{
        try{
            res.clearCookie('refreshtoken',{path:'/api/refresh_token'})
            return res.json({msg:"Logged Out!"})
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    generateAccessToken:async(req,res)=>{
        try{
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg:"Please login now!"})

            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,async(err,result)=>{
                if(err) return res.status(400).json({msg: "Please login now!"})
                const user = await Users.findById(result.id).select("-password")
                if(!user) return res.status(400).json({msg:"This does not exist."})

                const accesstoken = createAccessToken({id: result.id})
                res.json({
                    accesstoken,
                    user
                })
            })
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    }    
}

const createAccessToken = (payload) =>{
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createRefreshToken = (payload) =>{
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'30d'})
}
module.exports = authCtrl