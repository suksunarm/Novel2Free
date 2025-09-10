const express = require('express')
const router = express.Router()
const path = require('path')

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