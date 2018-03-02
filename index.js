require('dotenv').config();

// Polyfills
require('es6-promise').polyfill();
require('isomorphic-fetch');

// Server
require('./src/server');
