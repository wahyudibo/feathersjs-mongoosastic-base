const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const mongoose = require('./mongoose');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
// MODIFIED :: instead of using feathersjs builtin 404 and error handler
// which return html page, we use our own error handler that returns response
// in more restful way

// 404 handler
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).json();
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  // Log the error if it didn't come from a service method call
  if (logger && typeof logger.error === 'function' && !res.hook) {
    logger.error(error);
  }

  const output = error.toJSON();
  if (process.env.NODE_ENV === 'production') {
    delete output.stack;
  }

  res.status(500).json(output);
});

app.hooks(appHooks);

module.exports = app;
