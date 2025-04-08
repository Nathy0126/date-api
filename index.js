// ✅ FILE: index.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/date', async (req, res) => {
  try {
    const input = req.body.input || '';
    const oggi = req.body.oggi || new Date().toISOString().split('T')[0];

    const prompt = `L'utente ha scritto: "${input}"
Oggi è: ${oggi}

Rispondi solo con una data nel formato YYYY-MM-DD.
Se non capisci, scrivi solo: errore.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0
    });

    const risposta = completion.choices[0].message.content.trim();
    return res.json({ data: risposta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Errore nel server.' });
  }
});

app.get('/', (req, res) => {
  res.send('API attiva: /date');
});

app.listen(port, () => {
  console.log(`✅ Server avviato su porta ${port}`);
});
