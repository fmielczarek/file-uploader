// "dependencies": {
//   "cors": "^2.8.5",
//   "express": "^4.18.2",
//   "multer": "1.4.5-lts.1"

// Instal nodemon globally
// Run with nodemon on new vscode instance

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(cors());
const singleUpload = multer({ dest: 'uploads/' }).single('file');
const multipleUpload = multer({ dest: 'uploads/' }).array('files', 10);

app.post('/upload-single', singleUpload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file was uploaded' });
  }
  fs.rename(req.file.path, 'uploads/' + req.file.originalname, (error) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json({ message: 'File uploaded successfully' });
  });
});

app.post('/upload-multiple', multipleUpload, (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files were uploaded' });
  }
  req.files.forEach((file) => {
    fs.rename(file.path, 'uploads/' + file.originalname, (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  });
  res.json({ message: 'Files uploaded successfully' });
});

app.listen(3000, () => {
  console.log('Local server is listening on port 3000');
});
