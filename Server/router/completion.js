// chatRouter.js
const express = require('express');
const fetch = require('node-fetch'); // Import fetch for Node.js
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Define the route to hit the OpenAI API
router.post('/', async (req, res) => {
    const { messages } = req.body; // Expecting an array of messages
    console.log(messages)

    if (!messages || messages.length === 0) {
        return res.status(400).send({ error: 'Messages are required' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "openai/gpt-3.5-turbo",
              "messages": [
                {
                  "role": "user",
                  "content": messages
                }
              ]
            })
          });

        // If response is successful, parse and send the data
        console.log(response)
        if (!response.ok) {
            throw new Error('Failed to fetch from OpenAI');
        }

        const data = await response.json();
        res.json(data.choices[0].message.content);
    } catch (error) {
        // console.error(error);
        res.status(500).send({ error: 'An error occurred while communicating with OpenAI' });
    }
});

module.exports = router;
