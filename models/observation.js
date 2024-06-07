const mongoose = require('mongoose');

const observationSchema = ({
    location : String,
    problem : String,
    target : String,
    status : String,
    persion : String,
    corrction : String,
    action: String
});

module.exports = new mongoose.model("observation", observationSchema)