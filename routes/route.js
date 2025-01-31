const express = require("express")
const schema = require("../schema/schema")
const nodemailer = require("nodemailer")
const bcrypt = require('bcryptjs');
const route = express.Router()
const multer = require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
  });
  
  const upload = multer({ storage: storage });

route.get("/", async (req, res) => {
    try {
        const users = await schema.find({})
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            success: false,
            message: "internal server eror"
        })
    }
}).get("/:id", async (req, res) => {
    const {id}=req.params;
    try {
        const users = await schema.findOne({_id:id})
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            success: false,
            message: "internal server eror"
        })
    }
}).delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await schema.findByIdAndDelete({ _id: id })
        res.status(200).json({
            success: true,
            message: "user delete successfully"
        })
    } catch (error) {
        console.log("error");
        res.status(404).json({
            success: false,
            message: "internal server error",
        })
    }
}).patch("/:id",upload.single("files"), async (req, res) => {
    const { id } = req.params;
    let updateData = req.body; 
    if (updateData.password) {
        try {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData.password = hashedPassword; 
        } catch (error) {
            console.error("Error hashing password:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during password hashing"
            });
        }
    }
    if(req.file){
        updateData.file=req.file.path
    }
    try {
        const updatedDocument = await schema.findOneAndUpdate(
            { _id: id },
            { $set: updateData }
        );
        res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: updatedDocument
        });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
route.post("/email",(req,res)=>{
    const {email,name,message,subject} = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "ayushguleria73@gmail.com",
          pass: "lqvmlfppwzdtpcaf",
        },
      });
      async function main() {
        const info = await transporter.sendMail({
          from: email,
          to: "ayushguleria73@gmail.com", 
          subject: subject,
          text: name, 
          html: `<p>${message}</p>`, 
        });
      
        console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
})
route.post("/login", async(req,res)=>{
    try {
        const findemail  = await schema.findOne({email:req.body.email})
        if(!findemail){
            return res.status(400).json({
                message:"invalid email"
            })
        }
        const comparePass = await bcrypt.compare(req.body.password,findemail.password)
        if(!comparePass){
            return res.status(400).json({
                message:"invalid password"
            })
        }
        res.status(200).json({
            message:"login successfull"
        })
    } catch (error) {
        res.status(500).json({
            message:"internal server error"
        })
    }
})

module.exports = route