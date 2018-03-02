const fs = require('fs');
const getMtgJson = require('mtg-json');

async function closestCardName(initialCardName) {
  const dataPath = `${__dirname}/../../data`;
  if (fs.existsSync(`${dataPath}/AllCards.json`)) {
    return;
  }

  return getMtgJson('cards', dataPath)
}

module.exports = {
  closestCardName,
};
