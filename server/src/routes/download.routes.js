const express = require('express');
const path = require('path');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/windows', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../../downloads/ohms-gate-standard-1.0.0.rar'
  );

  res.download(filePath, 'ohms-gate-standard-1.0.0.rar');
});

router.get('/quest', (req, res) => {
  const filePath = path.join(
    __dirname,
    '../../downloads/ohms-gate-quest-standard-1.0.0.rar'
  );

  res.download(filePath, 'ohms-gate-quest-standard-1.0.0.rar');
});

router.get('/protected/:fileName', authenticateToken, (req, res) => {
  const fileName = req.params.fileName;

  const filePath = path.join(__dirname, '../../downloads', fileName);

  res.download(filePath, fileName, (error) => {
    if (error) {
      res.status(404).json({ message: 'File not found' });
    }
  });
});

module.exports = router;