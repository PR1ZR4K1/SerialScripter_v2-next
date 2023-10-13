import { headers } from 'next/headers';

//ipManagement.js
// const express = require('express');
// const router = express.Router();

// Initialize arrays for the blacklist and whitelist
let blacklist = [];
let whitelist = [];

// Middleware to validate an IP address
const validateIPAddress = (req, res, next) => {
  const { ipAddress } = req.body;
  // Regular expression for a simple IP address format validation
  const ipPattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;

  console.log('Received IP:', ipAddress);

  if (!ipPattern.test(ipAddress)) {
    return res.status(400).json({ error: 'Invalid IP address format' });
  }

  next(); // Continue to the next middleware or route handler if the IP is valid
};

// Route to add an IP address to the blacklist
router.post('/blacklist/add', validateIPAddress, (req, res, next) => {
  const { ipAddress } = req.body;
  blacklist.push(ipAddress);
  res
    .status(201)
    .json({ message: 'IP address added to blacklist successfully' });
  console.log('Adding IP to blacklist:', ipAddress);
});

// Route to retrieve the blacklist
router.get('/blacklist/get', (req, res, next) => {
  res.json({ blacklist });
});

// Route to add an IP address to the whitelist
router.post('/whitelist/add', validateIPAddress, (req, res, next) => {
  const { ipAddress } = req.body;
  whitelist.push(ipAddress);
  res
    .status(201)
    .json({ message: 'IP address added to whitelist successfully' });
});

// Route to retrieve the whitelist
router.get('/whitelist/get', (req, res, next) => {
  res.json({ whitelist });
});

module.exports = router;
