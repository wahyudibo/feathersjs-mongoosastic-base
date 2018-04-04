// Application hooks that run for every service
const logger = require('./hooks/logger');

const sanitizeUrl = require('./hooks/sanitize-url');

module.exports = {
  before: {
    all: [logger(), sanitizeUrl()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
