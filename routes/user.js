const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Novel = require("../model/novel");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const novels = await Novel.find(); 
    res.render("home_page", { pageTitle: "หน้าหลัก" , novels });
  } catch (err) {
     res.status(500).send("Failed to fetch novels: " + err.message);
  }
});

router.get("/cart", (req, res) => {
  res.render("cart", { pageTitle: "ตะกร้าสินค้า" });
});

router.get("/point", (req, res) => {
  res.render("point", { pageTitle: "เติมพอยท์" });
});

router.get("/signup", (req, res) => {
  res.render("sign_up", { pageTitle: "สมัครสมาชิก" });
});

router.post("/create_user", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ msg: "this email is available" }); // check อีเมลซ้ำ
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      msg: "Register Success",
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Register Failed , error messsage:", error });
  }
});

router.get("/detail_novel/:id", async (req, res) => {
  const novelId = req.params.id;
  const novel = await Novel.findById(novelId);
  res.render("detail_novel", { pageTitle: novel.title , novel });
});

module.exports = router;
