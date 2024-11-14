
// serves User routes 
//   /user

const express=require("express")
const jwt=require('jsonwebtoken')
const router=express.Router()
const { check, validationResult } = require('express-validator');
const User = require("../models/User"); //user model imported 
const bcrypt=require('bcrypt')

const secretKey="Hello@234"

// serves /createuser route 

router.post("/createuser",[
    // checking name email age 
    check('name').isLength({min:0}).withMessage("Name cannot be empty"),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').isLength({min:0}).withMessage("Password cannot be empty")
],async (req,res)=>{
    let success=false
    console.log(req.body)
    const errors = validationResult(req);
    // If error occurs returning array of errors
  
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    // creating new user object with help of the model
    let userAlready=await User.findOne({email:req.body.email})
    // console.log(req.body.email)
    // console.log(userAlready)
    if(userAlready)
    {
        return res.status(400).json({success,error:"User with this email already exist"})
    }
    // encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password=hashedPassword
    const user=new User(req.body)
    // saving the user object and checking for errors
    
    
    try{
        let u=await user.save()
        console.log(u)
        const token = jwt.sign({ id: u._id, email: u.email }, secretKey, {
            expiresIn: '12h' 
          });
        console.log(token)
        success=true
        res.json({success,"token":token})
    }
    catch(error)
    {
        res.status(400).json({success,error})
    }

})

// serves /login route 

router.post("/login",[
    check('email').isEmail().withMessage('Enter valid email id'),
    check('password').isLength({min:0}).withMessage("Password cannot be empty")

],async (req,res)=>{
    let success=false
    const errors = validationResult(req);
    // If error occurs returning array of errors
  
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        let {email,password}=req.body
        console.log(email)
        console.log(password)
        let user= await User.findOne({email})
        console.log(user)
        if(!user)
        {
            return res.status(400).json({success,"error":"Enter valid credentials"})
        }
        bcrypt.compare(password,user.password).then((result)=>{
            const token = jwt.sign({ _id:user._id ,name: user.name, email: user.email }, secretKey, {
                expiresIn: '12h' 
              });
            // console.log(token)
            success=true
            res.json({name:user.name,success,token})

        }).catch((error)=>{
            console.log(error)
            return res.status(400).json({success,"error":"Enter valid credentials"})
            
        })

        
    } catch (error) {
        console.log(error)
        return res.status(400).json({success,"error":"Enter valid credentials"})
    }
    

})

const fetchuser=require('../middleware/fetchuser.js')
router.get('/getuser',fetchuser,async (req,res)=>{
    try{
        let userid=req.body._id
        let user=await User.findOne({_id:userid}).select("-password")
        // console.log(user)
        res.send(user)

    }
    catch(error)
    {
        console.log(error)
        res.status(500).send("Internal server error")
    }
})



module.exports =router