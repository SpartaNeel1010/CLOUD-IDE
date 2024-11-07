const express=require('express')
const fs = require('fs');
const path=require('path')
const router= express.Router()

const dir = '/usr/src/app/home/sessions/username';



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

module.exports = router;
