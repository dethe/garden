const { compileSchema } = require("feathers-hook-validation-jsonschema");
const validator = compileSchema;

// example id: u3QDNQSt1VjL6VTR

const _id = "[A-Za-z0-9]{16}";

const validateCharacter = validator({
    title: "Character Schema",
    type: "object",
    properties: {
        _id: {
            type: "string",
            pattern: _id
        },
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
        world: {
            type: "string",
            pattern: _id
        },
        room: {
            type: "string",
            pattern: _id
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
        isFool: {
            type: "boolean"
        },
        isBanned: {
            type: "boolean"
        }
    },
    required: ["name", "email"]
});

const validateRoom = validator({
    title: "Room Schema",
    type: "object",
    properties: {
        _id: {
            type: "string",
            pattern: _id
        },
        name: {
            type: "string"
        },
        summary: {
            type: "string"
        },
        description: {
            type: "string"
        },
        exits: {
            type: "array",
            uniqueItems: true,
            items: {
                type: "object",
                required: ["name", "target"],
                properties: {
                    name: {
                        type: "string"
                    },
                    target: {
                        type: "string",
                        pattern: _id
                    }
                }
            }
        },
        messages: {
            type: "array",
            items: {
                type: "object",
                required: ["text", "name", "createdOn"],
                properties: {
                    text: {
                        type: "string"
                    },
                    name: {
                        type: "string"
                    },
                    createdBy: {
                        type: "string",
                        pattern: _id
                    },
                    createdOn: {
                        type: "string",
                        format: "date-time"
                    }
                }
            }
        },
        world: {
            type: "string",
            pattern: _id
        },
        createdOn: {
            type: "string",
            format: "date"
        },
        createdBy: {
            type: "string",
            pattern: _id
        },
        updatedOn: {
            type: "string",
            format: "date"
        },
        updatedBy: {
            type: "string",
            pattern: _id
        }
    },
    required: ["name", "summary", "description", "world", "exits", "messages"]
});

const validateUser = validator({
    title: "User Schema",
    type: "object",
    properties: {
        _id: {
            type: "string",
            pattern: _id
        },
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
        summary: {
            type: "string"
        },
        createdOn: {
            type: "string",
            format: "date"
        },
        updatedOn: {
            type: "string",
            format: "date"
        },
        passphrase: {
            type: "string"
        }
    },
    required: ["name", 'passphrase']
});

const validateWorld = validator({
    title: "World Schema",
    type: "object",
    properties: {
        _id: {
            type: "string",
            pattern: _id
        },
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
    required: ["name"]
});

// eslint-disable-next-line no-unused-vars
module.exports = {
    character: validateCharacter,
    room: validateRoom,
    user: validateUser,
    world: validateWorld
};
