import express from 'express';

const app = express();
const port = 3002;

app.use(express.json());

app.post('/match', (req, res) => {
  res.json({ message: '🧩 Matcher received', data: req.body });
});

app.listen(port, () => {
  console.log(`🧩 matcher-api running on http://localhost:${port}`);
});