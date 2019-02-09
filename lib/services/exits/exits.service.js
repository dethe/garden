// Initializes the `exits` service on path `/exits`
const createService = require('feathers-nedb');
const createModel = require('../../models/exits.model');
const hooks = require('./exits.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/exits', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('exits');

  service.hooks(hooks);
};
