const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')

app.use('/',userRoutes)
app.use('/admin',adminRoutes)

app.get("/signin", (req,res) => {
    res.sendFile(path.join(__dirname, "views", "sign_in.html"))
});

app.use((req,res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});