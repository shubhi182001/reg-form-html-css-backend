const express = require("express");
require("./db/conn");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.static());
// const static_path = path.join(__dirname, "../public");

// console.log(path.join(__dirname , "../public"));

app.get("/", (req, res) => {
    res.send("hello from shubhi");
});

app.listen(port, () =>{
    console.log(`server is running at ${port}`);
})