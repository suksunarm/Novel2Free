const express = require("express");
const router = express.Router();
const path = require("path");
const Novel = require("../model/novel");
const authMiddleware = require("../auth/auth");

const role = "admin"

router.get("/add_novel", authMiddleware, (req, res) => {
  if (req.user.role !== role) {
    return res.redirect("/signin");
  }
  res.render("add_novel", { pageTitle: "เพิ่มนิยาย" });
});

router.get("/add_redeem", authMiddleware, (req, res) => {
  if (req.user.role !== role) {
    return res.redirect("/signin");
  }
  res.render("add_redeem_code", { pageTitle: "เพิ่มคูปอง" });
});

router.get("/dashboard", authMiddleware, (req, res) => {
  if (req.user.role !== role) {
    return res.redirect("/signin");
  }
  res.render("dashboard_admin", { pageTitle: "แดชบอร์ด" });
});

router.post("/addNovel", async (req, res) => {
  try {
    const { nameNovel, contentNovel, imgNovel, priceNovel } = req.body;
    const novel = new Novel({
      title: nameNovel,
      content: contentNovel,
      image_url: imgNovel,
      price: priceNovel,
    });

    console.log("api เส้น add Novel");

    await novel.save();
    res.status(201).json({
      msg: "Add Novel Success",
      novel: {
        title: novel.title,
        content: novel.content,
        image_url: novel.image_url,
        price: novel.price,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Add Novel Failed, error message:", err });
  }
});

module.exports = router;
