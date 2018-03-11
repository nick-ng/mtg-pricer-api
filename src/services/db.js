function insertPrice(dbClient, { name, set, prices, timestamp}) {
  return dbClient();
}

module.exports = {
  insertPrice,
};
