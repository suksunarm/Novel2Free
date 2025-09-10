const express = require("express");
const mongoose = require("mongoose");
const app = express();

//Model Schema
const Coupon = require("../model/coupon");
const User = require("../model/user");
const Novel = require("../model/novel");

const mongoDBUri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBUri);
        console.log("เชื่อมต่อ MongoDB สำเร็จค้าบ")
    } catch (err) {
        console.error("เชื่อมต่อ MongoDB ล้มเหลว" , err.message);
        process.exit(1);
    }
};

module.exports = connectDB;