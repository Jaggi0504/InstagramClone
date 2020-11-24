const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const User = require('../models/user');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup',(req,res) =>{
    const {name,email,password} =req.body;
    if(!email || !name || !password){
        res.status(422).json({error:"Please Add all the fields"})
    }
    else{
    User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
             res.status(422).json({error:'User Already Exsists'})
            }else{
                bcrypt.hash(password,12)
                        .then(hashedPassword =>{
                            const user1 = new User({
                                name,
                                email,
                                password:hashedPassword
                            }) 
                            user1.save()
                                .then(user =>{
                                    res.status(200).json({msg:'User Added successfully'})
                                })
                                .catch((err)=>{
                                    console.log(err);
                                })
                        })

            }
        })
        .catch(err =>{
            console.log(err)
        })
    }
})


router.post('/signin',(req,res) =>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please fill the required fields!"})
    }
    User.findOne({email:email})
        .then(savedUser =>{
            if(!savedUser){
                return res.status(422).json({error:"Invalid Email!!"})
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch =>{
                    if(doMatch){
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        const {_id,email,name,followers,following} = savedUser
                        return res.json({token,user:{_id,email,name,followers,following}})
                    }else{
                        return res.status(422).json({error:"Invalid Password"})
                    }
                })
        })
        .catch(err => console.log(err))
})

router.get('/protected',requireLogin,(req,res) =>{
    res.send("protected!!!");
})

module.exports = router