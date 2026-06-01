import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Hugging Face API!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            seed: Math.floor(Math.random() * 1000000)
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API Error: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    res.status(200).json({ photo: base64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || 'Something went wrong' });
  }
});

export default router;
