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
        user: {
            type: "string",
            pattern: _id
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
        notes: {
            type: "string"
        },
        exits: {
            type: "array",
            uniqueItems: true,
            items: {
                type: "object",
                required: ["name", "room"],
                properties: {
                    name: {
                        type: "string"
                    },
                    room: {
                        type: "string",
                        pattern: _id
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
    required: ["name", "summary", "description", "world", "exits"]
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
        updatedOn: {
            type: "string",
            format: "date"
        },
        updatedBy: {
            type: "string",
            pattern: _id
        },
        avatar: {
            type: "string"
        },
        password: {
            type: "string"
        }
    },
    required: ["name", "email"]
});

const validateMessage = validator({
    title: "Message Schema",
    type: "object",
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
    },
    required: ["text", "character"]
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
        private: {
            type: "boolean"
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
        },
        admins: {
            type: "array",
            items: {
                type: "string",
                pattern: _id
            }
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
