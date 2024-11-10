// chatRouter.js
const express = require('express');
const fetch = require('node-fetch'); // Import fetch for Node.js
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const { ECSClient, CreateServiceCommand } = require("@aws-sdk/client-ecs");

const { fromStatic } =  require("@aws-sdk/credential-providers");

// Replace with your actual AWS credentials


// Initialize ECS client with credentials
const ecsClient = new ECSClient();

// Hardcoded configuration
const cluster = 'test-server'; // Replace with your ECS cluster name
const taskDefinition = 'backend'; // Replace with your ECS task definition
const subnets = ['subnet-02e84ac3b1de8f3a2', 'subnet-0ed6f06358b32ab3d']; // Replace with your subnet IDs
const securityGroups = ['sg-0a7dfae4127f11b5a']; // Replace with your security group IDs

// POST API endpoint to launch an ECS task
router.post('/start-ecs-task', async (req, res) => {
  const params = {
    desiredCount: 1,
    cluster,
    taskDefinition,
    serviceName : "user_1_container",
    launchType: 'FARGATE',
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets, // Hardcoded subnet IDs
        securityGroups, // Hardcoded security group IDs
        assignPublicIp: 'ENABLED',
      },
    },
  };

  try {
    const command = new CreateServiceCommand(params);
    const response = await ecsClient.send(command);
    res.status(200).json({
      message: 'ECS Service started successfully.',
      data: response,
    });
  } catch (error) {
    console.error('Error starting ECS Service:', error);
    res.status(500).json({
      message: 'Error starting ECS Service.',
      error: error.message,
    });
  }
});

module.exports = router;
