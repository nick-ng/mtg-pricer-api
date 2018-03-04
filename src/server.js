const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const {
  getClosestCard, getCardsSets, classifyCards, getCards, getSets,
} = require('./services/classifier');
const { ebaySearch } = require('./services/ebay');
const { simplifyListings } = require('./utils').ebayConditioner;
const { calculateStatistics } = require('./services/statistics');
const { fuzzyMatch } = require('./utils').string;

const PORT = process.env.PORT || 4000;
const PUBLIC_PATH = path.join(__dirname, 'public');
// const INDEX = path.join(__dirname, 'public', 'index.html');

console.log('Getting Card and Set information.');
getCards();
getSets();
console.log('Finished getting Card and Set information.');

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
  // Search ebay for listings
  const searchResults = await ebaySearch(`magic the gathering ${req.query.cardname}`);
  const listings = simplifyListings(searchResults);

  const cardName = (await getClosestCard(req.query.cardname)).closestName.name;
  const cardSets = await getCardsSets(cardName);

  const classifiedListings = classifyCards(listings, cardName, cardSets);


  // Calculate statistics about listing prices
  // const statistics = calculateStatistics(classifiedListings.map(listing => listing.price));
  // Store statistics in database

  // Return price information for each set
  res.json(Object.assign(
    {
      card: req.query.cardname,
    },
    {
      // statistics,
      classifiedListings,
    },
  ));
});

server.get('/test', async (req, res) => {
  const matchInfo = await getClosestCard(req.query.cardname);
  const test = await getCardsSets(matchInfo.closestName.name);
  res.json(test);
});

server.get('/test2', (req, res) => {
  const distance = fuzzyMatch(req.query.one, req.query.two);
  res.json({ distance });
});

server.get('/update-all-prices', (req, res) => {
  // Get prices for all cards in database.
  console.log('req', req);
  console.log('res', res);
});

server.use(express.static(PUBLIC_PATH));
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
