// chatRouter.js
const express = require('express');
const fetch = require('node-fetch'); // Import fetch for Node.js
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { fromStatic } from "@aws-sdk/credential-providers";

// Replace with your actual AWS credentials
const awsAccessKeyId = 'YOUR_ACCESS_KEY_ID';
const awsSecretAccessKey = 'YOUR_SECRET_ACCESS_KEY';
const region = 'us-west-2'; // Replace with your AWS region

// Initialize ECS client with credentials
const ecsClient = new ECSClient({
  region,
  credentials: fromStatic({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  }),
});

// Hardcoded configuration
const cluster = 'inotebook-cluster'; // Replace with your ECS cluster name
const taskDefinition = ''; // Replace with your ECS task definition
const subnets = ['subnet-02e84ac3b1de8f3a2', 'subnet-0ed6f06358b32ab3d']; // Replace with your subnet IDs
const securityGroups = ['sg-0a7dfae4127f11b5a']; // Replace with your security group IDs

// POST API endpoint to launch an ECS task
app.post('/start-ecs-task', async (req, res) => {
  const params = {
    cluster,
    taskDefinition,
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
    const command = new RunTaskCommand(params);
    const response = await ecsClient.send(command);
    res.status(200).json({
      message: 'ECS Task started successfully.',
      data: response,
    });
  } catch (error) {
    console.error('Error starting ECS task:', error);
    res.status(500).json({
      message: 'Error starting ECS task.',
      error: error.message,
    });
  }
});
