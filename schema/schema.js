const { required } = require("joi")
const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    last:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    files:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})
const students = mongoose.model("studentdatas",schema)
module.exports = students