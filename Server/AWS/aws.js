const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const dotenv=require('dotenv')
dotenv.config()


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
});

const fetchS3Folder = async (key, localPath) => {
   
    try {
        const params = {
            Bucket: process.env.S3_BUCKET || "",
            Prefix: key
        };

        const response = await s3.listObjectsV2(params).promise();
        // console.log(response.Contents.slice(1))
        if (response.Contents) {
            // Use Promise.all to run getObject operations in parallel
            await Promise.all(response.Contents.slice(1).map(async (file) => {
                const fileKey = file.Key;
                if (fileKey) {
                    // console.log(fileKey)
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET || "",
                        Key: fileKey
                    };

                    const data = await s3.getObject(getObjectParams).promise();
                    // console.log(data)
                    if (data.Body) {
                        const fileData = data.Body;
                        const filePath = `${localPath}/${fileKey.replace(key, "")}`;
                        
                        await writeFile(filePath, fileData);

                        console.log(`Downloaded ${fileKey} to ${filePath}`);
                    }
                }
            }));
        }
    } catch (error) {
        console.error('Error fetching folder:', error);
    }
};

function writeFile(filePath, fileData) {
    return new Promise(async (resolve, reject) => {
        await createFolder(path.dirname(filePath));

        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function createFolder(dirName) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

const saveToS3 = async (key, filePath, content) => {
    const params = {
        Bucket: process.env.S3_BUCKET || "",
        Key: `${key}${filePath}`,
        Body: content
    };
    // console.log(key)
    // console.log(filePath)
    // console.log(content)
    await s3.putObject(params).promise();

};


module.exports = { fetchS3Folder, saveToS3 };
