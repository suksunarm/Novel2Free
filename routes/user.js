const express = require('express')
const router = express.Router()
const path = require('path')
const bcrypt = require('bcrypt');
const User = require('../model/user')
const jwt = require("jsonwebtoken")

// router.get("/", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","home_page.html"));
// })

// router.get("/cart", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","cart.html"));
// })

// router.get("/point", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","point.html"));
// })

// router.get("/signup", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","sign_up.html"));
// })

router.get("/", (req,res) => {
    res.render('home_page', { pageTitle: 'หน้าหลัก'})
})

router.get("/cart", (req,res) => {
    res.render('cart', { pageTitle: 'ตะกร้าสินค้า'})
})

router.get("/point", (req,res) => {
    res.render('point', { pageTitle: 'เติมพอยท์'})
})

router.get("/signup", (req,res) => {
    res.render('sign_up', { pageTitle: 'สมัครสมาชิก'})
})

router.post("/create_user" , async (req, res) => {
    try {
        const { email , password , role } = req.body 
        const checkEmail = await User.findOne({email});
        if(checkEmail) {
            return res.status(400).json({msg:'this email is available'}) // check อีเมลซ้ำ
        }

        const hashPassword = await bcrypt.hash(password,10)

        const user = new User({
            email,
            password : hashPassword,
            role,
        })

        await user.save()

        res.status(201).json({
            msg:'Register Success',
            user : {
                email: user.email
            }
        })
    } catch(error) {
        res.status(500).json({msg:'Register Failed , error messsage:',error})
    }
    
})

router.get("/detail_novel", (req,res) => {
    res.render('detail_novel', { pageTitle: 'นิยาย'})
})

module.exports = router