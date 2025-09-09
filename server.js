const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.get("/", (req,res) => {
    res.send("<h1>Test github</h1>")
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});