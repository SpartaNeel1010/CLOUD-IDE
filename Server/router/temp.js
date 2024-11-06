const express=require('express')
const fs = require('fs');
const path=require('path')
const router= express.Router()

const dir = '../home/sessions/username';


function generateFileTree(directory){
    tree={}
     function buildTree(directory,currTree)
    {
        let files = fs.readdirSync(directory)
        for(const file in files)
        {
            const filepath = path.join(directory,files[file])
            console.log(filepath)
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
console.log(generateFileTree(dir))