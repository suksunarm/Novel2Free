const express = require('express')
const router = express.Router()
const path = require('path')

// router.get("/add_novel", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","add_novel.html"));
// })

// router.get("/add_redeem", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","add_redeem_code.html"));
// })

// router.get("/dashboard", (req,res) => {
//     res.sendFile(path.join(__dirname,"..","views","dashboard_admin.html"));
// })

router.get("/add_novel", (req,res) => {
    res.render('add_novel', { pageTitle: 'เพิ่มนิยาย'});
})

router.get("/add_redeem", (req,res) => {
    res.render('add_redeem_code', { pageTitle: 'เพิ่มคูปอง'});
})

router.get("/dashboard", (req,res) => {
    res.render('dashboard_admin', { pageTitle: 'แดชบอร์ด'});
})

module.exports = router