const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    tokens: [
        {
            token:{
                type: String,
            required: true
            }
        }
    ]
})


//we can't use call back functions here because we need to use this keyword.
userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }
    catch(e){
        console.log(e);
    }
}


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 11);
        console.log(`the current password is ${this.password}`)

        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 11);;
    }
    next(); // it tells after this we need to move ahead and do the save process
})



const Register = new mongoose.model("Register", userSchema);
module.exports = Register;