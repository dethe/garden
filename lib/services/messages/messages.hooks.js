const { authenticate } = require("@feathersjs/authentication").hooks;

const processMessage = require('../../hooks/process-message');

const validate = require('../../hooks/validate');

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [processMessage(), validate()],
    update: [processMessage(), validate()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
