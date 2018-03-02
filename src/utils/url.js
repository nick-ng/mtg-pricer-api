function urlParamJoiner(urlParams) {
  return Object.entries(urlParams).map(entryPair => entryPair.join('=')).join('&');
}

module.exports = {
  urlParamJoiner,
};
