const moongose= require('mongoose')
const mongoURI= process.env.MONGODB_URI || ""
console.log(process.env.MONGODB_URI)
const mongoConnect =  ()=>{
     moongose.connect(mongoURI).then(()=>{
        console.log("Connected to inotebook cluster hosted on mongodb atlas")
    }).catch((e)=>{
        console.log(e)
        console.log("Unable to connect to inotebook cluster hosted on mongodb atlas")
    })
    
}

module.exports=mongoConnect

