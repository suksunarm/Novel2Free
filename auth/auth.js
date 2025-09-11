const jwt = require("jsonwebtoken");
const User = require("../model/user");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token; // ดึงจาก cookie

  if (!token) {
    return res.redirect("/signin"); // ไม่มี token → redirect
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user; // เก็บข้อมูล user
    next();
  } catch (err) {
    return res.redirect("/signin"); // token ไม่ถูกต้อง → redirect
  }
}

module.exports = authMiddleware;
