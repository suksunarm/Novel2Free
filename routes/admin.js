const express = require('express')
const router = express.Router()
const path = require('path')
const Novel = require('../model/novel');

router.get("/add_novel", (req,res) => {
    res.render('add_novel', { pageTitle: 'เพิ่มนิยาย'});
})

router.get("/add_redeem", (req,res) => {
    res.render('add_redeem_code', { pageTitle: 'เพิ่มคูปอง'});
})

router.get("/dashboard", (req,res) => {
    res.render('dashboard_admin', { pageTitle: 'แดชบอร์ด'});
})

router.post("/addNovel", async (req,res) => {
    try {
        const { nameNovel, contentNovel, priceNovel } = req.body
        const novel = new Novel({
            title:nameNovel,
            content:contentNovel,
            price:priceNovel
        })

        await novel.save()
        res.status(201).json({
            msg:'Add Novel Success',
            novel : {
                title: novel.title,
                content: novel.content,
                price: novel.price,
            }
        })
    }
    catch(err) {
        res.status(500).json({msg:'Add Novel Failed, error message:',err})
    }
})

module.exports = router