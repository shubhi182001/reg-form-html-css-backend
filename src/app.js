const express = require("express");
require("./db/conn");
const path = require("path");
const app = express();
const hbs = require("hbs");

const port = process.env.PORT || 8000;
app.use(express.json()); 

//hbs part:
console.log(path.join(__dirname , "../public"));
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path)
app.get("/", (req, res) => {
    res.render("index");
});


app.listen(port, () =>{
    console.log(`server is running at ${port}`);
})