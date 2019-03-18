const { authenticate } = require("@feathersjs/authentication").hooks;

const {
  hashPassword,
  protect
} = require("@feathersjs/authentication-local").hooks;

const gravatar = require("../../hooks/gravatar");

const validate = require("../../hooks/validate");
const current_user = require("../../hooks/current_user");
const {updated} = require("../../hooks/timestamps");

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [hashPassword(), gravatar(), validate.user],
    update: [hashPassword(), authenticate("jwt"), updated(),  validate.user],
    patch: [hashPassword(), authenticate("jwt"), updated(), validate.user],
    remove: [authenticate("jwt")]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      current_user(),
      protect("password"),
    ],
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
