require('dotenv').config();

const mongoose = require("mongoose");
mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`).then(() => {
    console.log("connected to database");
}).catch((e) => {
    console.log(e);
})