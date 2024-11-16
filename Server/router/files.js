const express=require('express')
const fs = require('fs');
const path=require('path')
const router= express.Router()
const { exec } = require('child_process');
const {fetchS3Folder, saveToS3} =require('../AWS/aws')
// console.log(__dirname)

const dir =  __dirname.replace("/router","") + '/home/sessions/username';



function generateFileTree(directory){
    tree={}
     function buildTree(directory,currTree)
    {
        let files = fs.readdirSync(directory)
        for(const file in files)
        {
            const filepath = path.join(directory,files[file])
            // console.log(filepath)
            const stat=fs.statSync(filepath)

            if(stat.isDirectory())
            {
                currTree[files[file]]={}
                buildTree(filepath,currTree[files[file]])
            }
            else
            currTree[files[file]]=null
        }
    }
    buildTree(directory,tree)
    return tree;
}




router.get("/getallfiles",(req,res)=>{
    res.json(generateFileTree(dir))

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


router.post('/create-file', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'File name is required' });
    }
    
    const filePath = path.join(dir, name);

    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ message: 'Failed to create file' });
        }
        
        res.status(201).json({ message: 'File created successfully', filePath });
    });
});

// Endpoint to create a folder
router.post('/create-folder', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Folder name is required' });
    }
    
    const folderPath = path.join(dir, name);

    fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating folder:', err);
            return res.status(500).json({ message: 'Failed to create folder' });
        }
        
        res.status(201).json({ message: 'Folder created successfully', folderPath });
    });
});

router.post('/runcode', (req, res) => {
    const { path: filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({ error: 'Path is required in the request body' });
    }

    // Resolve to an absolute path to avoid any path traversal issues
    // var fullPath = process.env.PWD;
    // fullPath += '/home/sessions/username';
    // fullPath += filePath;
    const fullPath = path.join(dir, filePath);
    
    // Escape spaces and special characters in the path
    console.log(fullPath)
    const escapedPath = `"${fullPath.replace(/"/g, '\\"')}"`;
    
    console.log('Executing file:', escapedPath);

    // Run the specified JavaScript file using `node` with the escaped path
    exec(`node ${escapedPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            return res.json({ output: stderr });
        }
        if (stderr) {
            console.error(`Execution stderr: ${stderr}`);
            return res.json({ output: stderr });
        }

        // Send back the output as a JSON response
        res.json({ output: stdout });
    });
});

router.post("/fetchfroms3",async(req,res)=>{
    
    // req.body.projID
    console.log(req.body.userID)
    console.log(req.body.projID)
    await fetchS3Folder(`code/${req.body.userID}/${req.body.projID}/`,`./home/sessions/username`)
    res.status(200).send("Fetched")
})



 function deleteFolderContents(folderPath) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively delete subdirectories
            deleteFolderContents(filePath);
            fs.rmdirSync(filePath); // Remove empty directory
        } else {
            fs.unlinkSync(filePath); // Remove file
        }
    }
}
router.delete("/deleteallthing",async(req,res)=>{
    const folderPath=dir
    console.log(folderPath)
    // res.send(`All contents of ${folderPath} have been deleted.`);
    try {
        deleteFolderContents(folderPath);
        res.send(`All contents of ${folderPath} have been deleted.`);
    } catch (error) {
        res.status(500).send(`Error deleting contents: ${error.message}`);
    }

})

module.exports = router;
