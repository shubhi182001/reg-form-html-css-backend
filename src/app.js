require('dotenv').config()
const express = require("express");
require("./db/conn");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const Register = require("./models/register");
const auth = require("./middleware/auth")

const port = process.env.PORT || 8000;
app.use(express.json()); //we use it in case of postman
app.use(express.urlencoded({extended: false})); // in case we want to get data from frontend
app.use(cookieParser());

//hbs part:
// console.log(path.join(__dirname , "../public"));
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path)


app.get("/",  (req, res) => {
    res.render("index");
});



//we can only access this page when cookie is matched . After login we are getting cookie here on this page:
app.get("/secret" ,auth, (req, res) => {
    // console.log(`requesting cookie after login ${req.cookies.jwt}`);
    res.render("secret");
})

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

            const token  = await registerUser.generateAuthToken(); //middleware

            //res.cookie() function is used to set the cookie name to value.The value parameter may be a string or object converted to json.

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 600000),
                httpOnly:true,  //client side scripting language can't modify or delete this value
                // secure: true //it will only work with https i.e secure connection only.   
            });
            const userSave =  await registerUser.save();
            res.status(201).render("home");
            // res.send("Registered Successfully");
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
        const isMatch = await bcrypt.compare(password, userEmail.password);

        const token  = await userEmail.generateAuthToken();
        res.cookie('jwt' , token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true  
        });
        
        console.log("login:" , token);
        if(isMatch){
            res.status(201).render("home");  //on successful login it will render the home page.
            // res.send("Logged in successfully");
            
        }
        else{
            res.send("password is incorrect");
        }
    }
    catch(e){
        res.status(400).send("invalid login details");
    }
})



// const jwt = require("jsonwebtoken");
// //creating token
// //npm i jsonwebtoken
// const createToken = async () => {
//     const token = await jwt.sign({id:"uygdas78gduys"}, "ncajksckjdcdbchvhbfhvbfvbhfbvhfd",{
//         expiresIn:"2 seconds"
//     })
//     console.log(token);
    

//     //it will return the id. i.e it tells the user is valid.
//     const userver = await jwt.verify(token, "ncajksckjdcdbchvhbfhvbfvbhfbvhfd" );
//     console.log(userver);
    
// }


// createToken();


//bcrypt.js ->
//npm i bcryptjs

// const bcrypt = require("bcryptjs");

// const securePassword = async (password) => {
//     const passhash = await bcrypt.hash(password, 10);
//     console.log(passhash);

//     const passmatch = await bcrypt.compare(password, passhash);
//     console.log(passmatch);
// }

// securePassword("Shubhi@1801")





app.listen(port, () =>{
    console.log(`server is running at ${port}`);
})