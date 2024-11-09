// routes/chatRouter.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');


dotenv.config();

router.post('/', async (req, res) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: req.body.messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data.choices[0].message.content)
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error calling OpenAI API');
  }
});

module.exports = router;
