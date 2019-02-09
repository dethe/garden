const assert = require('assert');
const app = require('../../lib/app');

describe('\'exits\' service', () => {
  it('registered the service', () => {
    const service = app.service('exits');

    assert.ok(service, 'Registered the service');
  });
});
