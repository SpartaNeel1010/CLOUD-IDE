const express = require("express");
const fs = require("fs");
const yaml = require("yaml");
const path = require("path");
const cors = require("cors");
const k8s = require("@kubernetes/client-node");
const { errorMonitor } = require("events");
const dotenv=require("dotenv")
dotenv.config()

 
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

const kubeconfig = new k8s.KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(k8s.AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(k8s.NetworkingV1Api);

// Updated utility function to handle multi-document YAML files
const readAndParseKubeYaml = (filePath, projID, userId) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
        let docString = doc.toString();
        
        // Replace 'service_name' with replId
        docString = docString.replace(/service_name/g, projID);
        
        // Replace 'userID' with userId
        docString = docString.replace(/userId/g, userId);
        docString = docString.replace(/awsID/g, process.env.AWS_ACCESS_KEY_ID);
        docString = docString.replace(/awskey/g, process.env.AWS_SECRET_ACCESS_KEY);
        
        console.log(docString);
        return yaml.parse(docString);
    });
    return docs;
};

app.post("/disconnect", async (req, res) => {
    const { userId, projID } = req.body; // Assume unique identifier for user and repl
    const namespace = "default"; // Assuming a default namespace, adjust as needed

    try {
        // Delete Deployment, Service, and Ingress based on replId and userId
        // const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "../service.yaml"), projID, userId);
        
        // Delete resources one by one
        
        await appsV1Api.deleteNamespacedDeployment(projID, namespace);
        console.log(`Deleted Deployment: ${projID}`);
        await coreV1Api.deleteNamespacedService(projID, namespace);
        console.log(`Deleted Service: ${projID}`);
        await networkingV1Api.deleteNamespacedIngress(projID, namespace);
        console.log(`Deleted Ingress: ${projID}`);
    
    
        // console.log(error)
        // res.send(error)
        
        // for (const manifest of kubeManifests) {
        //     switch (manifest.kind) {
        //         case "Deployment":
        //             await appsV1Api.deleteNamespacedDeployment(replId, namespace);
        //             console.log(`Deleted Deployment: ${replId}`);
        //             break;
        //         case "Service":
        //             await coreV1Api.deleteNamespacedService(replId, namespace);
        //             console.log(`Deleted Service: ${replId}`);
        //             break;
        //         case "Ingress":
        //             await networkingV1Api.deleteNamespacedIngress(replId, namespace);
        //             console.log(`Deleted Ingress: ${replId}`);
        //             break;
        //         default:
        //             console.log(Unsupported kind: ${manifest.kind});
        //     }
        // }
        
        res.status(200).send({ message: "Resources cleaned up successfully" });
    } catch (error) {
        console.error("Failed to clean up resources", error);
        res.status(500).send({ message: "Failed to clean up resources" });
    }
});
const checkPodStatus = async (namespace, replId) => {
    const MAX_RETRIES = 30;
    const RETRY_DELAY = 3000; // 3 seconds

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const podList = await coreV1Api.listNamespacedPod(namespace);
            const pod = podList.body.items.find((p) => p.metadata.labels["app"] === replId);

            if (pod && pod.status.phase === "Running") {
                return true; // Pod is running
            }
        } catch (error) {
            console.error("Error checking pod status", error);
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Wait before retrying
    }
    return false; // Pod is not running within the retries
};
app.post("/start", async (req, res) => {
    const { userID, projID } = req.body; // Assume a unique identifier for each user
    const namespace = "default"; // Assuming a default namespace, adjust as needed

    try {
        const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "./service.yaml"), projID,userID);
        for (const manifest of kubeManifests) {
            switch (manifest.kind) {
                case "Deployment":
                    await appsV1Api.createNamespacedDeployment(namespace, manifest);
                    break;
                case "Service":
                    await coreV1Api.createNamespacedService(namespace, manifest);
                    break;
                case "Ingress":
                    await networkingV1Api.createNamespacedIngress(namespace, manifest);
                    break;
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`);
            }
        }
        const isPodRunning = await checkPodStatus(namespace, projID);
        if (isPodRunning) {
            res.status(200).send({ message: "Resources created and pod is running" });
        } else {
            res.status(500).send({ message: "Pod creation timed out" });
        }

    } catch (error) {
        console.error("Failed to create resources", error);
        res.status(500).send({ message: "Failed to create resources" });
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
