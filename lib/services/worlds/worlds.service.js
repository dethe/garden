// Initializes the `worlds` service on path `/worlds`
const createService = require('feathers-nedb');
const createModel = require('../../models/worlds.model');
const hooks = require('./worlds.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/worlds', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('worlds');

  service.hooks(hooks);
};
