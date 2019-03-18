const assert = require("assert");
const app = require("../../lib/app");

describe("'characters' service", () => {
  it("registered the service", () => {
    const service = app.service("characters");

    assert.ok(service, "Registered the service");
  });
});
