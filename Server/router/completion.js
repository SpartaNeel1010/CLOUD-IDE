const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
// Initialize OpenAI configuration

const dotenv=require('dotenv')
dotenv.config()
console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Use environment variable for API key
});
// Completion endpoint
router.post('/', async (req, res) => {
    const { prompt, max_tokens = 50, temperature = 0.7, model = 'gpt-3.5-turbo' } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
      // Format the prompt for better code completions (optional formatting logic)
      const formattedPrompt = "Complete the following code:\n\n${prompt}";
  
      // Call OpenAI API to generate code completion
      const completion = await openai.chat.completions.create({
        model: model,  // Use the specified model from the request body
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: formattedPrompt }
        ],
        max_tokens: max_tokens,      // Set max_tokens from the request body
        temperature: temperature     // Set temperature from the request body
      });
  
      // Send the result back to the client
      res.json(completion.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({
        error: 'Error generating completion',
        details: error.message
      });
    }
  });
  module.exports = router;
