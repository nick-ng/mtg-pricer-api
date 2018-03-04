const fs = require('fs');
const getMtgJson = require('mtg-json');
const { fuzzyMatch } = require('../utils').string;
const extraSetInfo = require('./extraSetInfo.json');
const premiumInfo = require('./premiumInfo.json');

const DATA_PATH = `${__dirname}/../../data`;

function isSplitCard(cardName) {
  return cardName.includes(' // ');
}

// MTG JSON Classifier
let allCards;
async function getCards() {
  const cardPath = `${DATA_PATH}/AllCards.json`;
  if (fs.existsSync(cardPath)) {
    return Promise.resolve(require(cardPath)); // eslint-disable-line
  }
  if (allCards) {
    return Promise.resolve(allCards);
  }
  return getMtgJson('cards', DATA_PATH);
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
function getCount(str) {
  const matches = str.match(/((^|\s+)x\d($|\s+)|(^|\s+)\dx($|\s+)|^\d\s+)/g);

  return matches ? +(matches[0].replace('x', '')) : 1;
}

function classifyCards(listings) {
  return listings.map(x => Object.assign(x, {
    quantity: getCount(x.title),
  }));
}

module.exports = {
  getCards,
  getCardNames,
  getSets,
  getCardsSets,
  classifyCards,
  getClosestCard,
};
