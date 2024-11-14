const express = require('express')
const router=express.Router()
const Project=require("../models/project")
const { check, validationResult } = require('express-validator');
const fetchuser=require('../middleware/fetchuser.js')


// fetch all the notes belonging to the logged in user 
router.get("/fetchallprojects",fetchuser,async (req,res)=>{
    const projects=await Project.find({userID:req.body._id})
    res.json(projects)
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
    let project=new Project({
        title,
        userID:req.body._id,
        date:new Date()
    })
    // console.log(req.body._id)
    // console.log(project)
    try {
        let projectsaved=await project.save()
        res.send(projectsaved)
        
    } catch (error) {
        // console.log(error)
        res.status(500).send(error)
        
    }


})

// router.put("/updatenote/:id",fetchuser,async (req,res)=>{
//     const noteID=req.params.id;
//     let {title,description,tag}=req.body
//     let newNote= {}
//     if(title){newNote.title=title}
//     if(description){newNote.description=description}
//     if(tag){newNote.tag=tag}
    

//     try {
//         let note=await Note.findOne({_id:noteID})
//         console.log(note)
//         if(!note)
//             return res.status(404).send("No note found")
//         console.log(note.userID)
//         console.log(req.body._id)
//         console.log(noteID)
        
//         if(note.userID!=req.body._id)
//            return res.status(401).send("Unauthorized")
//         console.log(newNote)
//         const updatedNote = await Note.findByIdAndUpdate(
//             noteID, // The ID of the note to update
//             newNote, // Fields to update
//             { new: true } // Return the updated note
//           );
          
//           if (updatedNote) {
//             console.log('Note updated successfully:', updatedNote);
//           } else {
//             console.log('Note not found');
//           }
//         return res.json(updatedNote)
        
//     } catch (error) {
//         res.send(error)
        
//     }
// })

router.delete('/deleteproject/:id',fetchuser,async(req,res)=>{
    const projID=req.params.id;
    try
    {
        console.log(projID)
        let project=await Project.findOne({_id:projID})
        console.log(project)
        if(!project)
            return res.status(404).send("No note found")
        console.log(project.userID)
        console.log(req.body._id)
        
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