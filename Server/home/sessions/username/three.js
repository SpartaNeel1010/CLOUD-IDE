const express=require('express')
const fs = require('fs');
const path=require('path')
const router= express.Router()

const dir = '/usr/src/app/home/sessions/username';

router.get("/getallfiles",(req,res)=>{

    fs.readdir(dir, (err, files) => {
    if (err) {
        res.json({'Error reading directory:': err});
        return;
    }
    console.log('Files in directory:', files);
    res.json({"files":files})
    });
})

router.post("/getdata",(req,res)=>{
    const filename= req.body.filename

    const filePath=path.join(dir,filename)

    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)
        {
            return res.status(500).json({ error: 'Error reading file' });
        }
        res.json({content: data});
    })
})
module.exports = router;
