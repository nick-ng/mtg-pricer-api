const fs = require('fs');
const getMtgJson = require('mtg-json');

function getCount(str) {
  const matches = str.match(/((^|\s+)x\d($|\s+)|(^|\s+)\dx($|\s+)|^\d\s+)/g);

  return matches ? +(matches[0].replace('x', '')) : 1;
}

async function loadCards() {
  const dataPath = `${__dirname}/../../data`;
  if (fs.existsSync(`${dataPath}/AllCards.json`)) {
    return;
  }

  return getMtgJson('cards', dataPath)
}

function classifyCards(listings) {
  return listings.map(x => {
    const quantity = getCount(x.title);
    return Object.assign(x, {
    quantity,
    pricePerItem: x.price / quantity,
  })});
}

module.exports = {
  loadCards,
  classifyCards
};
