const fs = require('fs');
const getMtgJson = require('mtg-json');

function getCount(str) {
  const matches = str.match(/((^|\s+)x\d($|\s+)|(^|\s+)\dx($|\s+)|^\d\s+)/g);

  return matches ? +(matches[0].replace('x', '')) : 1;
}

console.log(getCount('5 hello'));
console.log(getCount('hello x6'));
console.log(getCount('hello x7'));

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
