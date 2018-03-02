const fs = require('fs');
const getMtgJson = require('mtg-json');

function getCount(str) {
  const matches = str.match(/(x\d|\dx|^\d)/g);

  return matches ? +(matches[0].replace('x', '')) : 1;
}

async function closestCardName(initialCardName) {
  const dataPath = `${__dirname}/../../data`;
  if (fs.existsSync(`${dataPath}/AllCards.json`)) {
    return;
  }

  return getMtgJson('cards', dataPath)
}

function classifyCards(listings) {
  return listings.map(x => ({
    listing: x,
    quantity: getCount(x.title[0]),
  }));
}

module.exports = {
  closestCardName,
  classifyCards
};
