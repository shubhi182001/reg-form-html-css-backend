const express = require("express");
require("./db/conn");
const path = require("path");
const app = express();
const hbs = require("hbs");
const Register = require("./models/register");

const port = process.env.PORT || 8000;
app.use(express.json()); //we use it in case of postman
app.use(express.urlencoded({extended: false})); // in case we want to get data from frontend

//hbs part:
// console.log(path.join(__dirname , "../public"));
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

app.post("/register", async(req, res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerUser = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            const userSave =  await registerUser.save();
            res.status(201).render("home");
        }else{
            res.send("passwords are not matching");
        }
    }
    catch(e){
        res.status(400).send(e)
    }
})

app.post("/login", async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({email: email});
        // res.send(userEmail);
        // console.log(userEmail);
        if(userEmail.password === password){
            res.status(201).send("index");
        }
        else{
            res.send("password is incorrect");
        }
    }
    catch(e){
        res.status(400).send("invalid login details");
    }
})




app.listen(port, () =>{
    console.log(`server is running at ${port}`);
})