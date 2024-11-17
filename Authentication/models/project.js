const mongoose= require('mongoose')

const ProjectSchema=mongoose.Schema({
    userID:{
        type: String,
        required:true,
        unique:false
    },
    url:{
        type: String,
        required:true,
        unique:false
    },
    title:{
        type: String,
        required: true, 
        unique:false
    },
    date:{
        type:Date,
        required:false,
        unique:false
    }
})
const Project=mongoose.model('project',ProjectSchema)
module.exports=Project