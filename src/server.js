"use strict";
exports.__esModule = true;
var path = require("path");
var http = require("http");
var express = require("express");
var socket_io_1 = require("socket.io");
var hierarchy_1 = require("./data-models/hierarchy");
/**
 * Create server instance & configure
 */
var app = express();
var server = http.createServer(app);
var io = new socket_io_1.Server(server);
/**
 * Middleware
 */
app.use(express.static("dist"));
/**
 * Resolvers
 */
app.get("/", function (req, res) {
    res.end("ok");
});
/**
 * Socket.io event handlers
 */
io.on("connection", function (socket) {
    console.log("User: ".concat(socket.id, " connected"));
    socket.emit("init", hierarchy.getData());
    socket.on("createEntity", function (data) {
        // Handle create entity
        console.log(data);
    });
    socket.on("deleteEntity", function (data) {
        // Handle delete entity
    });
    socket.on("reparentEntity", function (data) {
        // Handle reparent entity
    });
    socket.on("disconnect", function () {
        console.log("User: ".concat(socket.id, " disconnected"));
    });
});
/**
 * Initial setup
 */
var hierarchy = new hierarchy_1.Hierarchy("-1#0");
// TEST
hierarchy.addEntity({
    id: "1#0",
    relationship: {
        parentId: "-1#0",
        fractionalIndex: 0.0
    },
    properties: {}
});
hierarchy.addEntity({
    id: "2#0",
    relationship: {
        parentId: "-1#0",
        fractionalIndex: 0.0
    },
    properties: {}
});
/**
 * Initiate server
 */
server.listen(3000, function () {
    console.log("Listening on port: 3000");
});
