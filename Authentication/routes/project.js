const express = require('express')
const router=express.Router()
const Project=require("../models/project")
const { check, validationResult } = require('express-validator');
const fetchuser=require('../middleware/fetchuser.js')
const copyS3Folder=require("./aws.js")
const mongoose = require('mongoose');


// fetch all the notes belonging to the logged in user 
router.get("/fetchallprojects",fetchuser,async (req,res)=>{
    const projects=await Project.find({userID:req.body._id})
    res.json(projects)
})
router.get("/fetchprojectname/:projUrl",async (req,res)=>{
    const projUrl = req.params.projUrl; // Access projID from the route parameter
    console.log("-----",projUrl)
    console.log("first")

    const project = await Project.findOne({url:projUrl}); // findById is more concise for fetching by _id
    if (!project) {
        return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
})
// Save a note created by the user  
router.post("/createproject",fetchuser,[
    check('title').isLength({min:0}).withMessage("Name cannot be empty"),
],async (req,res)=>{
    const errors = validationResult(req);
    // If error occurs returning array of errors
  
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let {title}=req.body
    const customId = `x${new mongoose.Types.ObjectId().toHexString()}`;
    let project=new Project({
        url: customId,
        title,
        userID:req.body._id,
        date:new Date()
    })
    // console.log(req.body._id)
    // console.log(project)
    // project._id=`x${project._id}`
    try {
        let projectsaved=await project.save()
        console.log(req.body._id)
        console.log(project.title)
        console.log(process.env.S3_BUCKET)
        await copyS3Folder("base-code/java-script/",`code/${req.body._id}/${project.url}/`)

        res.send(projectsaved)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
        
    }


})

router.delete('/deleteproject/:id',fetchuser,async(req,res)=>{
    const projID=req.params.id;
    try
    {
        // console.log(projID)
        let project=await Project.findOne({_id:projID})
        console.log(project)
        if(!project)
            return res.status(404).send("No note found")
        // console.log(project.userID)
        // console.log(req.body._id)
        
        // if(note.userID!==req.body._id)
        //     return res.status(401).send("Unauthorized")

        console.log("first")
        const deleteProject=await Project.findByIdAndDelete(projID)

        if(deleteProject)
        res.send(deleteProject)
        else
        res.send("Delete project unsuccesfull")
    }
    catch(error)
    {
        res.send(error)
    }


})


module.exports=router