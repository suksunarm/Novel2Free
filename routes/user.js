const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Novel = require("../model/novel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../auth/auth");

const role = "user";

router.get("/", async (req, res) => {
  try {
    const novels = await Novel.find();
    res.render("home_page", { pageTitle: "หน้าหลัก", novels });
  } catch (err) {
    res.status(500).send("Failed to fetch novels: " + err.message);
  }
});

router.get("/cart", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const novelOfUser = await User.findById(user._id).populate(
      "cart_items.novel_id"
    ); //ดึงข้อมูล novel ที่อยู่ในตะกร้าทั้งหมด
    // console.log("ข้อมูล User และนิยายที่อยู่ในตะกร้า", novelOfUser);

    if (user.role !== role) {
      return res.redirect("/signin");
    }

    const cartItems = novelOfUser.cart_items;
    console.log(cartItems)

    //คำนวณราคาทั้งหมดที่ user จะต้องจ่าย
    const totalItems = cartItems.length; //ดูว่าข้อมูลในตะกร้ามีกี่ชิ้น
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + item.price 
    }, 0);

    res.render("cart", {
      pageTitle: "ตะกร้าสินค้า",
      cartItems,
      totalItems,
      totalPrice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

router.get("/point", authMiddleware, async (req, res) => {
  const user = req.user;
  if (user.role !== role) {
    return res.redirect("/signin");
  }
  res.render("point", { pageTitle: "เติมพอยท์", user });
});

router.post("/addPoint", authMiddleware, async (req, res) => {
  try {
    const { point } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: point } },
      { new: true } // return document หลังอัปเดต
    );
    res.json({
      msg: "เติมพอยท์สำเร็จ",
      points: updatedUser.points, // ส่งค่าปัจจุบันของ user กลับ
    });
  } catch (err) {
    res.status(500).json({ msg: "เติมพอยท์ล้มเหลว", error: err.message });
  }
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
  res.render("detail_novel", { pageTitle: novel.title, novel });
});

// เพิ่มนิยายเข้าตะกร้า
router.post("/add-novel-in-cart/:id", authMiddleware, async (req, res) => {
  try {
    const novelId = req.params.id;
    console.log("from add", novelId);
    const user = req.user;

    // หา novel
    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({ msg: "Novel not found" });
    }

    // เช็กว่ามี novel_id นี้ใน cart_items แล้วหรือยัง
    const alreadyInCart = user.cart_items.some(
      (item) => item.novel_id.toString() === novelId
    );
    if (alreadyInCart) {
      return res.status(400).json({ msg: "นิยายนี้อยู่ในตะกร้าแล้ว" });
    }

    // อัปเดตตะกร้า
    user.cart_items.push({
      novel_id: novel._id,
      price: novel.price || 0,
    });

    await user.save();

    res.json({ msg: "เพิ่มนิยายเข้าตะกร้าแล้ว ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/cart/remove/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItemId = req.params.id; // _id ของ cart_items

    // ลบ item ออกจาก cart
    await User.findByIdAndUpdate(
      userId,
      { $pull: { cart_items: { _id: cartItemId } } }
    );

    // ดึงข้อมูล cart ใหม่หลังลบ
    const novelOfUser = await User.findById(userId).populate("cart_items.novel_id");

    const cartItems = novelOfUser.cart_items;

    // คำนวณราคาและจำนวนใหม่
    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    // render หน้า cart ใหม่
    res.json({
      pageTitle: "ตะกร้าสินค้า",
      cartItems,
      totalItems,
      totalPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error!");
  }
});

// router.delete("/novel/:id", async (req, res) => {
//   try {
//     const novel = await Novel.findByIdAndDelete(req.params.id);
//     console.log(novel);
//     if (!novel) {
//       return res.status(404).json({ msg: "Novel not found" });
//     }
//     res.json({ msg: "Delete Novel Success", novel });
//   } catch (err) {
//     res.status(500).json({ msg: "Delete Novel Failed", error: err.message });
//   }
// });

module.exports = router;
