const { urlParamJoiner } = require('../utils').url;

const EBAY_URL = 'https://svcs.ebay.com/services/search/FindingService/v1';
const ebayParameters = {
  ['SECURITY-APPNAME']: process.env.EBAY_APP_ID,
  ['OPERATION-NAME']: 'findItemsByKeywords',
  ['RESPONSE-DATA-FORMAT']: 'JSON',
  // callback: '_cb_findItemsByKeywords',
  ['paginationInput.entriesPerPage']: 999,
};
// [REST-PAYLOAD]:
// ?SECURITY-APPNAME=NickNg-MTGPrice-PRD-cdf6c4a56-0b6e36eb&OPERATION-NAME=findItemsByKeywords&=&=JSON&&REST-PAYLOAD&keywords=iPhone&&GLOBAL-ID=EBAY-US&siteid=0

// https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=NickNg-MTGPrice-PRD-cdf6c4a56-0b6e36eb&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&callback=_cb_findItemsByKeywords&REST-PAYLOAD&keywords=iPhone's and charger&paginationInput.entriesPerPage=6&GLOBAL-ID=EBAY-US&siteid=0

async function ebaySearch(query) {
  const parameters = {
    keywords: encodeURIComponent(query),
  }
  const queryB = `${EBAY_URL}?${urlParamJoiner(
    Object.assign(
      {},
      ebayParameters,
      parameters,
    )
  )}`;
  // console.log('queryB', queryB);
  const response = await fetch(queryB);
  // console.log('aa', aa);
  // const results = await aa._cb_findItemsByKeywords();
  const result = await response.json();
  const items = result.findItemsByKeywordsResponse[0].searchResult[0].item
  console.log('items', items);
  return items;
}

module.exports = {
  ebaySearch,
};
