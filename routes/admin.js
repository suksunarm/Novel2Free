const express = require("express");
const router = express.Router();
const path = require("path");
const Novel = require("../model/novel");
const Coupon = require("../model/coupon");
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


router.get("/dashboard", async (req, res) => {
    try {
        const novels = await Novel.find()
        res.render("dashboard_admin", { pageTitle: "แดชบอร์ด" , novels});
    } catch(err) {
        res.status(500).send("Failed to fetch novels: " + err.message);
    }
  
});

router.get("/novel/:id", async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) return res.status(404).json({ msg: "Novel not found" });
    res.json(novel);
  } catch (err) {
    res.status(500).json({ msg: "Error", err });
  }
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

router.put("/novel/:id", async (req, res) => {
  try {
    const { editName, editContent,  editImage, editPrice } = req.body;
    const novel = await Novel.findByIdAndUpdate(
      req.params.id,
      {
        title: editName,
        content: editContent,
        image_url: editImage,
        price: editPrice,
      },
      { new: true }
    );
    if (!novel) return res.status(404).json({ msg: "Novel not found" });
    res.json({ msg: "Edit Novel Success", novel });
  } catch (err) {
    res.status(500).json({ msg: "Add Novel Failed, error message:", err });
  }
});

router.delete("/novel/:id", async (req, res) => {
  try {
    const novel = await Novel.findByIdAndDelete(req.params.id);
    console.log(novel)
    if (!novel) {
        return res.status(404).json({ msg: "Novel not found" });
    }  
    res.json({ msg: "Delete Novel Success", novel });
  } catch (err) {
    res.status(500).json({ msg: "Delete Novel Failed", error: err.message });
  }
});

router.post("/add-Redeem-Code", async (req, res) => {
  try {
    const { nameCoupon, codeCoupon, pointsCoupon } = req.body;
    const coupon = new Coupon({
      Name: nameCoupon,
      code: codeCoupon,
      points: pointsCoupon,
    });

    await coupon.save();
    res.status(201).json({
      msg: "Add Redeem Success",
      coupon: {
        Name: coupon.Name,
        code: coupon.code,
        points: coupon.points,
      },
    });
    res.redirect('/dashboard')
  } catch (err) {
    res.status(500).json({ msg: "Add Coupon Failed, error message:", err });
  }
});

module.exports = router;