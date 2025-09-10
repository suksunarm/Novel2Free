const express = require('express')
const router = express.Router()
const path = require('path')

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

router.get("/detail_novel", (req,res) => {
    res.render('detail_novel', { pageTitle: 'นิยาย'})
})

module.exports = router