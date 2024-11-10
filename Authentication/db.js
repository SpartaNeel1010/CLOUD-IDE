const moongose= require('mongoose')
const mongoURI= process.env.MONGODB_URI || "mongodb+srv://neel:t8feV0YnA40PBVFU@inotebook-cluster.kba4w.mongodb.net/CloudIDE"
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

