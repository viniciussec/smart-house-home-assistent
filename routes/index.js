/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

module.exports = router;
