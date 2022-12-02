const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,

    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }, 
    confirmpassword:{
        type: String,
        required: true
    }
})

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 11);
        console.log(`the current password is ${this.password}`)

        this.confirmpassword = undefined;
    }
    next(); // it tells after this we need to move ahead and do the save process
})



const Register = new mongoose.model("Register", userSchema);
module.exports = Register;