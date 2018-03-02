const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { closestCardName } = require('./services/classifier');
const { ebaySearch } = require('./services/ebay');

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

server.get('/check-card', async (req, res) => {
  // Get closest card name from mtg json
  console.log('getting cards');
  closestCardName(req.query.cardname);

  // Search ebay for listings
  const searchResults = await ebaySearch(`magic the gathering ${req.query.cardname}`);

  // Classify listings

  // Calculate statistics about listing prices

  // Store statistics in database

  // Return price information for each set
  res.json(searchResults);
});

server.get('/update-all-prices', (req, res) => {
  // Get prices for all cards in database.
  console.log('req', req);
  console.log('res', res);
});

server.use(express.static(PUBLIC_PATH));
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
