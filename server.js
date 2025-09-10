require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const port = 3000;
const User = require('./model/user')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// เอาไว้เชื่อม DB
connectDB();

//Routing
const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/',userRoutes)
app.use('/admin',adminRoutes)

app.get("/signin", (req,res) => {
    res.render('sign_in', { pageTitle: 'เข้าสู่ระบบ'})
});

app.post("/login_user" , async (req,res) => {
    try {
        const { email , password } = req.body;
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({msg:'user not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({msg:'Invalid Password'})
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES_IN})
        console.log(token)

        res.status(200).json({
            token,
            msg:'Login Success',
            user : {
                email: user.email
            }
        })
    } 
    catch(error) {
        res.status(500).json({msg:'Login Failed',  error:error.message})
    }
})

app.use((req,res) => {
    res.status(404).render('404', { pageTitle: '404'})
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
