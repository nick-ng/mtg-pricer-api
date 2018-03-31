function insertPrice(dbClient) {
  return ({
    name, set, prices, timestamp,
  }) => dbClient();
}

module.exports = dbClient => ({
  insertPrice: insertPrice(dbClient),
});
