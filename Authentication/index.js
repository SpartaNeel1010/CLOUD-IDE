const mongoConnect=require('./db')
const express=require('express')
const cors = require('cors');

const app= express()
app.use(cors())
app.use(express.json())
mongoConnect()

app.get("/health",(req,res)=>{
    res.send("Hello this is the backend of our app")
})
// const NoteRoute=require("./routes/notes")
// app.use("/notes",NoteRoute)

// route for all user related endpoints 
const UserRoutes=require("./routes/user")


app.use("/user",UserRoutes)

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Listening at ${port}`)

})
