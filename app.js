require("dotenv").config({ path: "./config/.env" })

const express = require("express")
const connectDatabase = require("./config/database")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


connectDatabase()              // Connect with the database

const userRoute = require("./routes/userRoute")
app.use("/", userRoute)




// App Starts from this route
app.get("/", function (req, res) {
    res.send("Working Bro")
})


// Connection with the server
const server = app.listen(process.env.PORT, function () {
    console.log(`Server is working.`)
})