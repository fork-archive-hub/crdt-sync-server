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
    socket.on("createEntity", function (data, callback) {
        var entityData = JSON.parse(data)[0];
        // Handle create entity
        if (hierarchy.addEntity(new hierarchy_1.Entity(entityData.id, {
            parentId: entityData.relationship.parentId,
            fractionalIndex: entityData.relationship.fractionalIndex
        }, entityData.properties))) {
            // Broadcast to other sockets
            socket.broadcast.emit("createEntity", hierarchy.getData(entityData.id));
            callback({
                status: "OK"
            });
        }
        else {
            callback({
                status: "Err"
            });
        }
    });
    socket.on("deleteEntity", function (id) {
        // Handle delete entity
        var res = hierarchy.deleteEntity(id);
        if (res.result) {
            // Broadcast to other sockets
            io.emit("deleteEntity", res.ids);
        }
    });
    socket.on("reparentEntity", function (reparentData) {
        // Handle reparent entity
        console.log("on reparentEntity: ");
        console.log(reparentData);
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
    id: "-1#1",
    relationship: {
        parentId: "-1#0",
        fractionalIndex: 0.0
    },
    properties: {}
});
hierarchy.addEntity({
    id: "-1#2",
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
