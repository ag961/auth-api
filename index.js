'use strict';
require('dotenv').config();

const server = require('./src/server');

const { db } = require('./src/models/index.js');

db.sync()
  .then(() => {
    server.start(process.env.PORT);
  })
  .catch(e => console.log(e.message));