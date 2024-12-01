import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY // You'll need to set this up
});

const app = express();
app.use(cors({
  origin: [
    'https://victors-spectacular-site-73208d799ee16f.webflow.io', 
    'https://www.memir.io',
    'https://memir.io',
    'http://www.memir.io',
    'http://memir.io'
  ],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.post('/analyze-role', async (req, res) => {
  try {
    const { jobTitle } = req.body;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional job analyst. Your task is to provide detailed, professional descriptions of job roles."
        },
        {
          role: "user",
          content: `Please provide a summarized description for the role of: ${jobTitle}.The description should be 140 words or less. Only Include: 
          1. Brief overview and envrioment of their work
          2. Key responsibilities
          Keep it realistic.`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
    });

    res.json({
      description: completion.choices[0]?.message?.content
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze role' });
  }
});

app.post('/analyze-lifestyle', async (req, res) => {
  try {
    const { jobTitle } = req.body;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional work-life balance analyst. Your task is to provide realistic insights about how different jobs affect people's daily lives and schedules."
        },
        {
          role: "user",
          content: `Please describe the typical lifestyle and work-life balance for a ${jobTitle}. The description should be 140 words or less. Only Include:
          1. Typical work schedule (hours, flexibility, overtime expectations)
          2. Impact on personal life and family time
          3. Common stress factors and how they affect life outside work
          Keep it realistic.`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
    });

    res.json({
      lifestyle: completion.choices[0]?.message?.content
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze lifestyle' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Role Analyzer API is running' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});