const  mongoose  = require("mongoose");

const userSchema = mongoose.Schema({
    organisation_name : String,
    name : String, 
    mobile_number : Number,
    email : String,
    password : String, 
    address : String,
    token : String,
    linkExpiryTime : Date
});

module.exports = new mongoose.model("user", userSchema);