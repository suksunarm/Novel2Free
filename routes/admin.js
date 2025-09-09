const express = require('express')
const router = express.Router()
const path = require('path')

router.get("/add_novel", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","add_novel.html"));
})

router.get("/add_redeem", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","add_redeem.html"));
})

router.get("/dashboard", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","dashboard_admin.html"));
})

module.exports = router