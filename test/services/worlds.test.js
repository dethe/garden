const assert = require("assert");
const app = require("../../lib/app");

describe("'worlds' service", () => {
  it("registered the service", () => {
    const service = app.service("worlds");

    assert.ok(service, "Registered the service");
  });
});
