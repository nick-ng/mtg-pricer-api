const { urlParamJoiner } = require('../utils').url;

const EBAY_URL = 'https://svcs.ebay.com/services/search/FindingService/v1';
const ebayParameters = {
  'SECURITY-APPNAME': process.env.EBAY_APP_ID,
  'OPERATION-NAME': 'findItemsByKeywords',
  'RESPONSE-DATA-FORMAT': 'JSON',
  'paginationInput.entriesPerPage': 999,
};

async function ebaySearch(query) {
  const parameters = {
    keywords: encodeURIComponent(query),
  };
  const queryB = `${EBAY_URL}?${urlParamJoiner(Object.assign(
    {},
    ebayParameters,
    parameters,
  ))}`;
  const response = await fetch(queryB);
  const result = await response.json();
  const items = result.findItemsByKeywordsResponse[0].searchResult[0].item;
  return items;
}

module.exports = {
  ebaySearch,
};
