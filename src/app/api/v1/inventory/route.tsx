//inventory.js
// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res, next) => {
//   res.json({ ping: 'pong' });
// });

// module.exports = router;

import { headers } from 'next/headers';

export async function GET(request: Request) {
  return Response.json({ my: 'data' }, { status: 200, statusText: 'OK' });
}
