const express = require("express");
const joi = require("joi");
const multer = require("multer");
const signup = express.Router();
const schema = require("../schema/schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });

signup.post("/", upload.single("files"), async (req, res) => { 
  
  const students = joi.object({
    name: joi.string().required(),
    middle: joi.string().allow(""),
    last: joi.string().required(),
    age: joi.number().required(),
    gender: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().length(10).required(),
    password: joi.string().min(6).max(20).required(),
  
  });


  const { error } = students.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  try {

    const checkuser = await schema.findOne({ phone: req.body.phone });
    if (checkuser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists"
      });
    }

  
    const hashpassword = await bcrypt.hash(req.body.password, 10);

   
    const tokenstore = jwt.sign({ _id: Date.now() }, process.env.KEY, { expiresIn: '1h' });

    const newStudent = new schema({
      name: req.body.name,
      middle: req.body.middle,
      last: req.body.last,
      age: req.body.age,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      password: hashpassword,
      token: tokenstore,
    
      files: req.file ? req.file.path : null, 
    });


    const savedStudent = await newStudent.save();

 
    res.status(201).json({
      success: true,
      message: "User saved successfully",
      data: savedStudent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "An error occurred"
    });
  }
});

module.exports = signup;
