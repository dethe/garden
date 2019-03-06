const { authenticate } = require("@feathersjs/authentication").hooks;

const validate = require("../../hooks/validate");
const {created, updated} = require("../../hooks/timestamps");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [created(), updated(), validate.world],
    update: [updated(), validate.world],
    patch: [updated(), validate.world],
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
