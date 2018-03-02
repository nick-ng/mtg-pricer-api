require('dotenv').config();

// Polyfills
require('es6-promise').polyfill();
require('isomorphic-fetch');

// Server
try {
  require('./server');
} catch (e) {
  console.log(e);
}