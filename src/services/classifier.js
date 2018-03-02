const getMtgJson = require('mtg-json');

function closestCardName(initialCardName) {
  return getMtgJson('cards', `${__dirname}/../../data`)
  .then(json => {
    console.log('json', json);
  })
}

module.exports = {
  closestCardName,
};
