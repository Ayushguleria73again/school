require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const port = process.env.PORT || 8000

const app = express()
const signup = require("./routes/signup")
const routs = require("./routes/route")
const path = require("path")
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
app.use("/signup", signup)
app.use("/api", routs)
app.use("/files", express.static(path.join(__dirname, "files")))
main().catch(error => console.log(error))


async function main() {
    await mongoose.connect(process.env.URL)
    console.log("connected to mongodb");
}

app.listen(port, () => {
    console.log("server is running", port);
})