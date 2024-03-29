// Initializes the `items` service on path `/items`
const createService = require('../search.service');
const createModel = require('../../models/items.model');
const hooks = require('./items.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'items',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/items', new createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('items');

  service.hooks(hooks);
};
