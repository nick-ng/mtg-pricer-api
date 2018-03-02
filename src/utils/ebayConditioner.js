function simplifyListings(listings) {
  return listings.map(listing => {
    const bidPrice = listing.sellingStatus[0].currentPrice[0].__value__ - 0;
    let buyPrice = false;
    if (listing.listingInfo[0].buyItNowPrice) {
      buyPrice = listing.listingInfo[0].buyItNowPrice[0].__value__;
    }
    return {
      title: listing.title[0],
      price: buyPrice || bidPrice,
    };
  })
}

module.exports = {
  simplifyListings,
};
