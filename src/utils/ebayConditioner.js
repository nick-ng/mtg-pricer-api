function ms2days(ms) {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  return days;
}

function simplifyListings(listings) {
  return listings.map((listing) => {
    const bidPrice = listing.sellingStatus[0].currentPrice[0].__value__ - 0;
    let buyPrice = false;
    let timeLeft;
    if (listing.listingInfo[0].buyItNowPrice) {
      buyPrice = listing.listingInfo[0].buyItNowPrice[0].__value__;
      timeLeft = -1;
    } else {
      const endTime = listing.listingInfo[0].endTime[0];
      // const timeLefta = listing.sellingStatus[0].timeLeft[0];
      timeLeft = new Date(endTime) - new Date();
    }
    return {
      title: listing.title[0],
      price: buyPrice || bidPrice,
      daysLeft: ms2days(timeLeft),
    };
  });
}

module.exports = {
  simplifyListings,
};
