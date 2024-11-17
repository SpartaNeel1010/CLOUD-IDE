const express = require("express");
const fs = require("fs");
const yaml = require("yaml");
const path = require("path");
const cors = require("cors");
const k8s = require("@kubernetes/client-node");
 
const app = express();
app.use(express.json());
app.use(cors());

const kubeconfig = new k8s.KubeConfig();
kubeconfig.loadFromDefault();
const coreV1Api = kubeconfig.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(k8s.AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(k8s.NetworkingV1Api);

// Updated utility function to handle multi-document YAML files
const readAndParseKubeYaml = (filePath, replId, userId) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
        let docString = doc.toString();
        
        // Replace 'service_name' with replId
        docString = docString.replace(/service_name/g, replId);
        
        // Replace 'userID' with userId
        docString = docString.replace(/userId/g, userId);
        
        console.log(docString);
        return yaml.parse(docString);
    });
    return docs;
};


app.post("/start", async (req, res) => {
    const { userId, replId } = req.body; // Assume a unique identifier for each user
    const namespace = "default"; // Assuming a default namespace, adjust as needed

    try {
        const kubeManifests = readAndParseKubeYaml(path.join(__dirname, "../service.yaml"), replId,userId);
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
        res.status(200).send({ message: "Resources created successfully" });
    } catch (error) {
        console.error("Failed to create resources", error);
        res.status(500).send({ message: "Failed to create resources" });
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
