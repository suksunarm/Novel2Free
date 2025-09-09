const express = require('express')
const router = express.Router()
const path = require('path')

router.get("/", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","home_page.html"));
})

router.get("/cart", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","cart.html"));
})

router.get("/point", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","point.html"));
})

router.get("/signup", (req,res) => {
    res.sendFile(path.join(__dirname,"..","views","sign_up.html"));
})

module.exports = router