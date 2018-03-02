const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
const PUBLIC_PATH = path.join(__dirname, 'public');
// const INDEX = path.join(__dirname, 'public', 'index.html');

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  // res.set('content-type', 'application/json; charset=utf-8');
  next();
});

server.post('/checkCard', (req, res) => {
  // Add card to database and get price.
  console.log('req', req);
  console.log('res', res);
});

server.post('/updateAllPrices', (req, res) => {
  // Get prices for all cards in database.
  console.log('req', req);
  console.log('res', res);
});

server.use(express.static(PUBLIC_PATH));
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
