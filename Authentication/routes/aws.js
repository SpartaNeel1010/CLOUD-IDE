// const dotenv = require("dotenv");
// dotenv.config();

// console.log(process.env)
// Import the AWS SDK and other modules
const {S3} = require("aws-sdk");
// const fs = require("fs");
// const path = require("path");



const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
})


async function copyS3Folder(sourcePrefix, destinationPrefix, continuationToken) {
    try {
        // List all objects in the source folder
        const listParams = {
            Bucket: process.env.S3_BUCKET || "",
            Prefix: sourcePrefix,
            // ContinuationToken: continuationToken,
        };
        console.log("Hello in the copy s3 folder")

        const listedObjects = await s3.listObjectsV2(listParams).promise();
        console.log(listedObjects)

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

        // Copy each object to the new location
        await Promise.all(listedObjects.Contents.map(async (object) => {
            if (!object.Key) return;
            const destinationKey = object.Key.replace(sourcePrefix, destinationPrefix);
            const copyParams = {
                Bucket: process.env.S3_BUCKET || "",
                CopySource: `${process.env.S3_BUCKET}/${object.Key}`,
                Key: destinationKey,
            };

            console.log(copyParams);

            await s3.copyObject(copyParams).promise();
            console.log(`Copied ${object.Key} to ${destinationKey}`);
        }));

        // Check if the list was truncated and continue copying if necessary
        if (listedObjects.IsTruncated) {
            await copyS3Folder(sourcePrefix, destinationPrefix, listedObjects.NextContinuationToken);
        }
    } catch (error) {
        console.error("Error copying folder:", error);
    }
}


module.exports = copyS3Folder

