import express from 'express';
import * as dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const router = express.Router();

const client = new InferenceClient(process.env.HF_API_KEY);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from Hugging Face API!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const image = await client.textToImage({
      provider: "nscale",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      parameters: { 
        num_inference_steps: 5,
        seed: Math.floor(Math.random() * 1000000)
      },
    });

    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    res.status(200).json({ photo: base64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || 'Something went wrong' });
  }
});

export default router;
