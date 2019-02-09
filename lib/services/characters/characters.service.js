// Initializes the `characters` service on path `/characters`
const createService = require('feathers-nedb');
const createModel = require('../../models/characters.model');
const hooks = require('./characters.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/characters', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('characters');

  service.hooks(hooks);
};
