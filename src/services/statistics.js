const math = require('mathjs');

function calculateStatistics(array) {
  const quantiles = math.quantileSeq(array, [0.25, 0.5, 0.75]);
  return {
    25: quantiles[0],
    50: quantiles[1],
    75: quantiles[2],
  };
}

module.exports = {
  calculateStatistics,
};
