const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const DATA_FILE = './db.json';

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/obituaries', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/obituaries', upload.single('image'), (req, res) => {
  const data = readData();
  const newObituary = {
    id: Date.now(),
    name: req.body.name,
    dob: req.body.dob,
    dod: req.body.dod,
    message: req.body.message,
    image: req.file ? '/uploads/' + req.file.filename : ''
  };
  data.push(newObituary);
  writeData(data);
  res.status(201).json({ success: true, id: newObituary.id });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
