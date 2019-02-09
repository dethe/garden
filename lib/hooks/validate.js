"use strict";

import {
    compileSchema as validator,
    compileSchemaFromUrl as validatorFromUrl
} from "feathers-hook-validation-jsonschema";

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

// eslint-disable-next-line no-unused-vars
module.exports = {
    character: validateCharacter,
    exit: validateExit,
    message: validateMessage,
    room: validateRoom,
    user: validateUser,
    worlds: validateWorld
};
