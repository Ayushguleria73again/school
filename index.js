const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const port = process.env.PORT || 8000
const env = require("dotenv")
const app = express()
const signup = require("./routes/signup")
const routs = require("./routes/route")
app.use(cors())
app.use(express.json())
app.use("/signup", signup)
app.use("/api", routs)
env.config()

main().catch(error => console.log(error))

async function main() {
    await mongoose.connect(process.env.URL)
    console.log("connected to mongodb");

}

app.listen(port, () => {
    console.log("server is running");
})