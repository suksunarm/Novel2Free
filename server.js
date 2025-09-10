const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

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

app.use((req,res) => {
    res.status(404).render('404', { pageTitle: '404'})
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});