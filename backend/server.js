import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'records.json');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function readRecords() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeRecords(records) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// GET all records
app.get('/api/records', (req, res) => {
  const records = readRecords();
  res.json(records);
});

// GET single record
app.get('/api/records/:id', (req, res) => {
  const records = readRecords();
  const record = records.find((r) => r.id === req.params.id);
  if (!record) {
    return res.status(404).json({ message: 'Record not found' });
  }
  res.json(record);
});

// POST create a record
app.post('/api/records', (req, res) => {
  const { studentName, registerNumber, bookName, bookId, borrowDate, returnDate, status } = req.body;
  if (!studentName || !registerNumber || !bookName || !bookId || !borrowDate || !returnDate || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const records = readRecords();
  const newRecord = {
    id: Date.now().toString(),
    studentName,
    registerNumber,
    bookName,
    bookId,
    borrowDate,
    returnDate,
    status,
  };
  records.push(newRecord);
  writeRecords(records);
  res.status(201).json(newRecord);
});

// PUT update a record
app.put('/api/records/:id', (req, res) => {
  const { studentName, registerNumber, bookName, bookId, borrowDate, returnDate, status } = req.body;
  const records = readRecords();
  const index = records.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }
  records[index] = {
    ...records[index],
    studentName: studentName ?? records[index].studentName,
    registerNumber: registerNumber ?? records[index].registerNumber,
    bookName: bookName ?? records[index].bookName,
    bookId: bookId ?? records[index].bookId,
    borrowDate: borrowDate ?? records[index].borrowDate,
    returnDate: returnDate ?? records[index].returnDate,
    status: status ?? records[index].status,
  };
  writeRecords(records);
  res.json(records[index]);
});

// DELETE a record
app.delete('/api/records/:id', (req, res) => {
  const records = readRecords();
  const index = records.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }
  records.splice(index, 1);
  writeRecords(records);
  res.json({ message: 'Record deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
