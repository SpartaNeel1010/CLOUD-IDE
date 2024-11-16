const dotenv = require("dotenv");
dotenv.config();
const mongoConnect=require('./db')
const express=require('express')
const cors = require('cors');

const app= express()
app.use(cors())
app.use(express.json())
mongoConnect()

app.get("/health",(req,res)=>{
    res.send("Backend is working fine")
})
// const NoteRoute=require("./routes/notes")
// app.use("/notes",NoteRoute)

// route for all user related endpoints 
const UserRoutes=require("./routes/user")
const projectRoutes=require("./routes/project")


app.use("/user",UserRoutes)
app.use("/project",projectRoutes)

const port = process.env.PORT || 5001
app.listen(port,()=>{
    console.log(`Listening at ${port}`)

})
