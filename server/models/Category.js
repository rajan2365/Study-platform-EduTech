const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: { type: String },
    
    //course ka data category me show krega full, data
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
});

module.exports = mongoose.model("Category",categorySchema);