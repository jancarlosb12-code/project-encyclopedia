const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'items.json');

app.use(cors());
app.use(express.json());

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2), 'utf8');
  }
}

function readItems() {
  ensureDataFile();
  const raw = fs.readFileSync(dataFile, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeItems(items) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf8');
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Project encyclopedia API is running.' });
});

app.get('/api/items', (req, res) => {
  const { date } = req.query;
  const items = readItems();

  if (date) {
    const filtered = items.filter((item) => item.date === date);
    return res.json(filtered);
  }

  return res.json(items);
});

app.get('/api/items/:date', (req, res) => {
  const { date } = req.params;
  const items = readItems();
  const filtered = items.filter((item) => item.date === date);
  res.json(filtered);
});

app.post('/api/items', (req, res) => {
  const { date, content } = req.body || {};

  if (!date || !content || !String(content).trim()) {
    return res.status(400).json({ error: 'Both date and content are required.' });
  }

  const items = readItems();
  const newItem = {
    id: Date.now(),
    date,
    content: String(content).trim(),
    createdAt: new Date().toISOString()
  };

  items.push(newItem);
  writeItems(items);

  res.status(201).json(newItem);
});

app.listen(PORT, () => {
  console.log(`Project Encyclopedia API is running on http://localhost:${PORT}`);
});
