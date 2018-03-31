const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const {
  getClosestCard,
  getCardsSets,
  classifyCards,
  getCards,
  getSets,
  getCardNames,
  getMatchedCards,
} = require('./services/classifier');
const { ebaySearch } = require('./services/ebay');
const { simplifyListings } = require('./utils').ebayConditioner;
const { calculateStatistics } = require('./services/statistics');
const { fuzzyMatch } = require('./utils').string;
const dbClient = require('./database/db-client');
const db = require('./services/db')(dbClient);

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
  const cards = await getMatchedCards(req.query.cardname);
  // Search ebay for listings
  const card = cards[0];

  const searchResults = await ebaySearch(`magic the gathering ${card.normalizedName}`);
  const listings = simplifyListings(searchResults);
  const namesToExclude = card.namesToExclude.map(x => x.toLowerCase());
  const filteredListings = listings.filter(x => !namesToExclude.some(n => x.title.toLowerCase().includes(n)));

  const cardSets = await getCardsSets(card.normalizedName);

  const classifiedListings = classifyCards(filteredListings, card.normalizedName, cardSets);
  const clonedListings = JSON.parse(JSON.stringify(classifiedListings));

  // Calculate statistics about listing prices
  Object.keys(clonedListings).forEach((setCode) => {
    Object.keys(clonedListings[setCode]).forEach((premiumType) => {
      const listingsBySetAndPremium = clonedListings[setCode][premiumType];
      const listingPrices = listingsBySetAndPremium
        .filter(listing => listing.daysLeft < 7)
        .map(listing => listing.price);
      let statistics = {};
      if (listingPrices.length > 0) {
        statistics = calculateStatistics(listingPrices);
      }
      clonedListings[setCode][premiumType] = statistics;
    });
  });

  const priceInfo = {
    input: req.query.cardname,
    card: card.normalizedName,
    prices: clonedListings,
    classifiedListings,
  };
  // Store statistics in database

  // Return price information for each set
  res.json(priceInfo);
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

server.get('/card-names', async (req, res) => {
  const names = await getCardNames();
  res.json(names);
});

server.get('/matched-cards', async (req, res) => {
  const cards = await getMatchedCards(req.query.cardname);
  res.json(cards);
});

server.get('/update-all-prices', (req, res) => {
  // Get prices for all cards in database.
  console.log('req', req);
  console.log('res', res);
});

server.use(express.static(PUBLIC_PATH));
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
