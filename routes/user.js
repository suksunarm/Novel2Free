const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Novel = require("../model/novel");
const Coupon = require("../model/coupon");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../auth/auth");
const generatePayload = require("promptpay-qr");
const QRCode = require("qrcode");
const { route } = require("./admin");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const role = "user";

router.get("/", async (req, res) => {
  let user;
  const token = req.cookies.token;
  // เพิิ่มเช็กใน token ในหน้านี้เท่านั้น ไม่ต้องใช้ Middleware
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id);
    } catch (err) {
      res.status(500).send("Failed to fetch novels and point: " + err.message);
      user = undefined;
    }
  }
  const q = req.query.q;
  let novels;
  if (q) {
    // ค้นหาจาก title, category, price, content
    const regex = new RegExp(q, "i");
    novels = await Novel.find({
      $or: [
        { title: regex },
        { category: regex },
        { content: regex },
        { price: isNaN(q) ? undefined : Number(q) },
      ],
    });
  } else {
    novels = await Novel.find();
  }
  res.render("home_page", { pageTitle: "หน้าหลัก", novels, user });
});

router.post("/generate-promptpay-qr", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // สร้าง PromptPay payload
    const payload = generatePayload(phone, { amount });

    // สร้าง QR code เป็น DataURL
    const qrDataUrl = await QRCode.toDataURL(payload, {
      color: { dark: "#000", light: "#fff" },
    });

    res.json({ qrDataUrl });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: "สร้าง PromptPay QR ล้มเหลว", error: err.message });
  }
});

router.get("/my-novel", authMiddleware, async (req, res) => {
  try {
    const userFromCookies = req.user;
    const user = await User.findById(userFromCookies._id).populate(
      "myNovel.novel_id"
    );
    if (userFromCookies.role !== role) {
      return res.redirect("/signin");
    }
    // ดึงข้อมูลนิยายที่ซื้อแล้ว
    const myNovels = user.myNovel.map((item) => item.novel_id);
    console.log(myNovels);

    res.render("my_novel", { pageTitle: "นิยายของฉัน", myNovels });
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
    console.log(cartItems);

    //คำนวณราคาทั้งหมดที่ user จะต้องจ่าย
    const totalItems = cartItems.length; //ดูว่าข้อมูลในตะกร้ามีกี่ชิ้น
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + item.price;
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

router.get("/favorite", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const novelOfUser = await User.findById(user).populate(
      "favorite.novel_id"
    ); //ดึงข้อมูล novel ที่อยู่ในรายการโปรดทั้งหมด

    if (user.role !== role) {
      return res.redirect("/signin");
    }

    const favoriteItems = novelOfUser.favorite.map((item) => item.novel_id);
    console.log("test", favoriteItems);

    res.render("favorite", {
      pageTitle: "รายการโปรด",
      favoriteItems,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

router.get("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("favorite.novel_id");
    const favorites = user.favorite.map(item => ({
      _id: item.novel_id._id,
      title: item.novel_id.title,
      price: item.novel_id.price,
      image_url: item.novel_id.image_url
    }));
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
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
  let user;
  let isFavorite = false;
  let hasNovel = false;

  const token = req.cookies.token
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id);
    } catch (err) {
      res.status(500).send("Failed to fetch novels and point: " + err.message);
    }
  }
  console.log('from test',user)

  const novelId = req.params.id;
  const novel = await Novel.findById(novelId);

  if (user) {
    isFavorite = user.favorite.some(item => item.novel_id.toString() === novelId);
    hasNovel = user.myNovel.some((item) => item.novel_id.toString() === novelId);
  } 

  res.render("detail_novel", { pageTitle: novel.title, novel, isFavorite, hasNovel });
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

router.post("/add-novel-in-favorite/:id", authMiddleware, async (req, res) => {
  try {
    const novelId = req.params.id;
    const user = req.user;

    // หา novel
    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({ msg: "Novel not found" });
    }

    // เช็กว่ามี novel_id นี้ใน cart_items แล้วหรือยัง
    const alreadyInFavorite = user.favorite.some(
      (item) => item.novel_id.toString() === novelId
    );
    if (alreadyInFavorite) {
      return res.status(400).json({ msg: "นิยายนี้อยู่ในรายการโปรดแล้ว" });
    }

    // อัปเดตตะกร้า
    user.favorite.push({
      novel_id: novel._id,
    });

    await user.save();

    res.json({ msg: "เพิ่มนิยายเข้ารายการโปรดแล้ว ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete(
  "/remove-novel-from-favorite/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const novelId = req.params.id;
      const user = req.user;
      user.favorite = user.favorite.filter(
        (item) => item.novel_id.toString() !== novelId
      );
      await user.save();
      res.json({ msg: "ลบออกจากรายการโปรดแล้ว" });
    } catch (err) {
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

router.delete("/cart/remove/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItemId = req.params.id; // _id ของ cart_items

    // ลบ item ออกจาก cart
    await User.findByIdAndUpdate(userId, {
      $pull: { cart_items: { _id: cartItemId } },
    });

    // ดึงข้อมูล cart ใหม่หลังลบ
    const novelOfUser = await User.findById(userId).populate(
      "cart_items.novel_id"
    );

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

router.post("/cart/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("cart_items.novel_id");

    // คำนวณราคารวม
    const totalPrice = user.cart_items.reduce(
      (sum, item) => sum + item.price,
      0
    );

    // เช็ก point
    if (user.points < totalPrice) {
      return res.status(400).json({ msg: "พอยท์ของคุณไม่เพียงพอ" });
    }

    // เช็กว่ามี novel_id ที่ซ้ำกับ myNovel หรือไม่
    const alreadyBoughtIds = user.myNovel.map((n) => n.novel_id.toString());
    const duplicate = user.cart_items.find((item) =>
      alreadyBoughtIds.includes(item.novel_id._id.toString())
    );
    if (duplicate) {
      return res
        .status(400)
        .json({ msg: "คุณมีสินค้าบางประเภทในตะกร้านี้อยู่แล้ว" });
    }

    // เพิ่มนิยายที่ซื้อเข้า myNovel
    user.cart_items.forEach((item) => {
      user.myNovel.push({ novel_id: item.novel_id._id });
    });

    // ตัด point
    user.points -= totalPrice;

    // เคลียร์ตะกร้า
    user.cart_items = [];

    await user.save();

    res.json({ msg: "ซื้อสำเร็จ! ได้รับนิยายในคลังแล้ว", points: user.points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาด", error: err.message });
  }
});

router.post("/get-Redeem-Code", authMiddleware, async (req, res) => {
  try {
    const { Coupon: couponCode } = req.body;
    const coupon = await Coupon.findOne({ code: couponCode });
    const user = req.user

    if (!coupon) {
      return res.status(404).json({ msg: "ไม่พบคูปอง" });
    }

    user.points += coupon.points;
    await user.save();

    res.status(200).json({
      msg: "ใช้คูปองสำเร็จ",
      points: coupon.points,
    })
  } catch (err) {
    res.status(500).json({ msg: "Get Coupon Failed", error: err.message });
  }
});

router.post("/api/chat", authMiddleware, async (req, res) => {
  try {
    const userInput = req.body.question;

    // เลือกโมเดล (เช่น gemini-1.5-flash = เร็ว, gemini-1.5-pro = ฉลาดกว่า)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ใส่ system prompt ใน safety instruction ได้โดยเขียนเป็น context
    const prompt = `คุณคือน้องเมดสาวน่ารักชื่อ "ริวกะแตมจัง" 🥰
    หน้าที่ของคุณคือการทำหน้าที่เป็น Chatbot คอยช่วยเหลือผู้ใช้งานเว็บไซต์อ่านนิยาย
    คุณต้องตอบด้วยโทนที่สุภาพ สดใส เป็นกันเอง และใช้สรรพนามแทนตัวเองว่า "ริวกะแตมจัง"
    และเรียกผู้ใช้งานว่า "คุณผู้ใช้" หรือ "คุณพี่"

    ฟีเจอร์ที่คุณสามารถให้คำแนะนำได้ ได้แก่:
    สมัครสมาชิก (Sign Up)
    เข้าสู่ระบบ (Sign In)
    อ่านนิยาย (Read Novel)
    เพิ่มนิยายในตะกร้า (Add to Cart)
    ซื้อนิยาย (Purchase Novel)
    กรอกโค้ดเพื่อรับพอยท์ (Redeem Points)
    ซื้อพอยท์ด้วยการชำระเงินและสแกน QR Code
    ออกจากระบบ (Logout)
    ค้นหานิยาย (Search)
    ดูนิยายที่ซื้อแล้ว (My Novel)
    ดูนิยายที่ชอบ (My Favorite)

    รายละเอียดหน้าเว็บที่คุณสามารถอธิบายได้:
    Homepage: ค้นหานิยายทั้งจากชื่อเรื่องและเนื้อหาได้
    Sign Up: สมัครสมาชิกด้วย อีเมล รหัสผ่าน และยืนยันรหัสผ่าน
    Sign In: เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน ระบบตรวจสอบกับฐานข้อมูล
    Points: ซื้อพอยท์หรือรับพอยท์จากโค้ดลับ มีแพ็กเกจและการชำระผ่าน QR Code
    Novel Detail: ดูรายละเอียดนิยาย เนื้อเรื่องย่อ เพิ่มเป็นรายการโปรด หรือใส่ตะกร้า
    Cart: รวมรายการนิยายที่เลือก พร้อมยอดพอยท์ที่ต้องชำระ
    My Novel: แสดงนิยายที่ซื้อแล้ว สามารถกดอ่านเนื้อหาเต็ม
    My Favorite: แสดงนิยายที่กดชอบไว้ ทั้งที่ซื้อและยังไม่ซื้อ
    404 Page: แจ้งเตือนว่าหน้าเว็บไม่มีอยู่จริง

    ตอบทุกคำถามของผู้ใช้โดยอ้างอิงตามฟีเจอร์และหน้าต่าง ๆ ของเว็บไซต์นี้ 
    User: ${userInput}`;

    const result = await model.generateContent(prompt);
    console.log(result)
    res.status(200).json({
      msg: "สำเร็จ",
      result: result,
    })
  } catch (err) {
    res.status(500).json({ msg: "Get Chat Failed", error: err.message });
  }
  // res.render("chatbot", { pageTitle: 'chatbot', answer: result.response.text() });
});

router.get("/chatbot", authMiddleware, async (req, res) => {
  res.render("chatbot", { pageTitle: 'chatbot' });
});

module.exports = router;
