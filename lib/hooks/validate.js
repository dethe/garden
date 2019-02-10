const { compileSchema } = require("feathers-hook-validation-jsonschema");
const validator = compileSchema;

const validateCharacter = validator({
  title: "Character Schema",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    email: {
      type: "string",
      format: "email"
    },
    description: {
      type: "string"
    },
    createdOn: {
      type: "string",
      format: "date"
    },
    lastLogin: {
      type: "string",
      format: "date-time"
    },
    isOnline: {
      type: "boolean"
    },
    isWizard: {
      type: "boolean"
    },
    isBanned: {
      type: "boolean"
    }
  },
  required: ["name", "email"]
});

const validateExit = validator({
  title: "Exit Schema",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    summary: {
      type: "string"
    },
    world: {
      type: "string"
    },
    room: {
      type: "string"
    },
    destination: {
      type: "string"
    },
    createdOn: {
      type: "string",
      format: "date"
    },
    createdBy: {
      type: "string"
    },
    updatedOn: {
      type: "string",
      format: "date"
    },
    updatedBy: {
      type: "string"
    }
  },
  required: ["name", "world", "room", "destination"]
});

const validateMessage = validator({
  title: "Message Schema",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    text: {
      type: "string"
    },
    world: {
      type: "string"
    },
    room: {
      type: "string"
    },
    createdOn: {
      type: "string",
      format: "date"
    },
    createdBy: {
      type: "string"
    }
  },
  required: ["name", "world", "room", "text"]
});

const validateRoom = validator({
  title: "Room Schema",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    summary: {
      type: "string"
    },
    description: {
      type: "string"
    },
    world: {
      type: "string"
    },
    createdOn: {
      type: "string",
      format: "date"
    },
    createdBy: {
      type: "string"
    },
    updatedOn: {
      type: "string",
      format: "date"
    },
    updatedBy: {
      type: "string"
    }
  },
  required: ["name", "summary", "description", "world"]
});

const validateUser = validator({
  title: "User Schema",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    createdOn: {
      type: "string",
      format: "date"
    },
    updatedOn: {
      type: "string",
      format: "date"
    }
  },
  required: ["name"]
});

const validateWorld = validator({
  title: "World Schema",
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    summary: {
      type: "string"
    },
    description: {
      type: "string"
    },
    createdOn: {
      type: "string",
      format: "date"
    },
    createdBy: {
      type: "string"
    },
    updatedOn: {
      type: "string",
      format: "date"
    },
    updatedBy: {
      type: "string"
    }
  },
  required: ["name", "world", "room", "destination"]
});

// eslint-disable-next-line no-unused-vars
module.exports = {
  character: validateCharacter,
  exit: validateExit,
  message: validateMessage,
  room: validateRoom,
  user: validateUser,
  world: validateWorld
};
