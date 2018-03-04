const fs = require('fs');
const getMtgJson = require('mtg-json');
const { fuzzyMatch } = require('../utils').string;
const extraSetInfo = require('./extraSetInfo.json');
const premiumInfo = require('./premiumInfo.json');

console.log('premiumInfo', premiumInfo);

const DATA_PATH = `${__dirname}/../../data`;

function isSplitCard(cardName) {
  return cardName.includes(' // ');
}

// MTG JSON Classifier

async function loadCards() {
  const cardPath = `${DATA_PATH}/AllCards.json`;

  if (fs.existsSync(cardPath)) {
    return Promise.resolve(require(cardPath)); // eslint-disable-line
  }

  return getMtgJson('cards', DATA_PATH);
}

function getNormalizedName(card) {
  return card.names
    ? card.names.join(' // ')
    : card.name;
}

async function getCards() {
  const cards = await loadCards();

  return Object.values(cards)
    .map(x => Object.assign(x, { normalizedName: getNormalizedName(x) }));
}

async function getCardNames() {
  const cards = await getCards();
  const uniqueCards = new Set();
  Object.values(cards).forEach((card) => {
    if (card.names) {
      uniqueCards.add(card.names.join(' // '));
    } else {
      uniqueCards.add(card.name);
    }
  });
  return Array.from(uniqueCards);
}

let allSets;
async function getSets() {
  const setPath = `${DATA_PATH}/AllSets.json`;
  if (fs.existsSync(setPath)) {
    return Promise.resolve(require(setPath)); // eslint-disable-line
  }
  if (allSets) {
    return Promise.resolve(allSets);
  }
  return getMtgJson('sets', DATA_PATH);
}

function scoreMatch(name, actualName) {
  return fuzzyMatch(name, actualName);
}

function shouldExclude(name, actualName) {
  if (name.length <= actualName.length) {
    return false;
  }

  return name.includes(actualName);
}

async function getMatchedCards(cardName) {
  const cards = await getCards();
  const cardNames = cards.map(x => x.normalizedName);

  const relevantCards = cards
    .map(x => ({
      ...x,
      matchScore: scoreMatch(cardName, x.normalizedName),
      namesToExclude: cardNames.filter(n => shouldExclude(n, x.normalizedName)),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return relevantCards.slice(0, 10);
}

async function getClosestCard(cardName) {
  const cardNames = await getCardNames();
  const closestName = cardNames.reduce((accumulator, name) => {
    const distance = fuzzyMatch(cardName.toLowerCase(), name.toLowerCase());
    if (name.length === 1) {
      if (distance === 1) {
        return {
          distance,
          name,
        };
      }
      return accumulator;
    }
    if (accumulator.distance < distance) {
      return {
        distance,
        name,
      };
    }
    return accumulator;
  }, { distance: 0 });

  return {
    input: cardName,
    closestName,
  };
}

async function getCardsSets(cardName) {
  const sets = await getSets();
  const matchingSets = Object.values(sets).filter((set) => {
    const setCards = set.cards.map((card) => {
      if (isSplitCard(cardName)) {
        return card.names ? card.names.join(' // ') : null;
      }
      return card.name;
    });
    return setCards.includes(cardName);
  });
  return matchingSets.map(set => (Object.assign({
    name: set.name,
    code: set.code,
    gathererCode: set.gathererCode,
    oldCode: set.oldCode,
    magicCardsInfoCode: set.magicCardsInfoCode,
    regular: true,
  }, extraSetInfo[set.code])));
}

// Listing classifications
function removeMatches(array, matchFunction) {
  const matches = [];
  let i = array.length;
  while (i--) {
    if (matchFunction(array[i])) {
      matches.push(array.splice(i, 1)[0]);
    }
  }
  return {
    matches,
    array,
  };
}

function matchAnyTerms(input, terms) {
  const filteredTerms = terms.filter(a => a);
  return filteredTerms.some(term => input.toLowerCase().includes(term.toLowerCase()));
}

function getCount(str) {
  const matches = str.match(/((^|\s+)x\d($|\s+)|(^|\s+)\dx($|\s+)|^\d\s+)/g);

  return matches ? +(matches[0].replace('x', '')) : 1;
}

function classifyCardsBySet(listings, cardName, cardSets) {
  const clonedListings = [...listings];
  const setListings = {};
  cardSets.forEach((set) => {
    let setTerms = [
      set.name,
      set.code,
      set.oldCode,
    ];
    if (set.terms) {
      setTerms = setTerms.concat(set.terms);
    }
    const { matches } = removeMatches(clonedListings, listing => matchAnyTerms(listing.title, setTerms));
    setListings[set.code] = matches;
  });
  setListings.noset = clonedListings;
  return setListings;
}

function classifyCardsByFoil(listings) {
  const clonedListings = [...listings];
  const { array, matches } = removeMatches(clonedListings, (listing) => {
    console.log('listing', listing);
    return matchAnyTerms(listing.title, premiumInfo.terms);
  });
  return {
    foil: matches,
    regular: array,
  };
}

function classifyCards(listings, cardName, cardSets) {
  const quantityListings = listings.map(x => Object.assign(x, {
    quantity: getCount(x.title),
  }));
  const setListings = classifyCardsBySet(quantityListings, cardName, cardSets);
  Object.keys(setListings).forEach((setCode) => {
    setListings[setCode] = classifyCardsByFoil(setListings[setCode]);
  });
  return setListings;
}

module.exports = {
  getCards,
  getCardNames,
  getSets,
  getCardsSets,
  classifyCards,
  getClosestCard,
  getMatchedCards,
};
