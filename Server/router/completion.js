const express = require('express');
const {Copilot} = require( 'monacopilot');


const router= express.Router()



openaiKEy="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"
const copilot = new Copilot(openaiKEy, {
  provider: 'openai',
  model: 'gpt-4o',
});



router.post('/complete', async (req, res) => {
  console.log("Hii")
  const {completion, error, raw} = await copilot.complete({
    body: req.body,
  });

  
  if (raw) {
    calculateCost(raw.usage.input_tokens);
  }

  // Handle errors if present
  if (error) {
    console.error('Completion error:', error);
    res.status(500).json({completion: null, error});
  }

  res.status(200).json({completion});
});

module.exports=router