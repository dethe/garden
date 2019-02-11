const worlds = require("./worlds/worlds.service.js");
const rooms = require("./rooms/rooms.service.js");
const characters = require("./characters/characters.service.js");
const users = require("./users/users.service.js");
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
    app.configure(worlds);
    app.configure(rooms);
    app.configure(characters);
    app.configure(users);
};
