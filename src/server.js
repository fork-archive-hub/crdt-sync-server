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
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:8080"
    }
});
/**
 * Middleware
 */
// app.use(express.static("dist"));
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
        // console.log("on createEntity: ");
        // console.log(`data: ${entityData}`);
        var res = hierarchy.addEntity(entityData.id, entityData.value);
        if (res) {
            io.emit("createEntity", hierarchy.getData(entityData.id));
            callback({ status: "Ok" });
        }
        else {
            callback({ status: "Err" });
        }
    });
    socket.on("deleteEntity", function (id) {
        // console.log("on deleteEntity: ");
        // console.log(`data: ${id}`);
        var res = hierarchy.deleteEntity(id);
        if (res.result) {
            io.emit("deleteEntity", res.ids);
        }
    });
    socket.on("reparentEntity", function (reparentData) {
        // console.log("on reparentEntity: ");
        // console.log(`data: ${reparentData}`);
        var res = hierarchy.reparent(reparentData.id, reparentData.newParentId);
        if (res) {
            io.emit("reparentEntity", reparentData);
        }
    });
    socket.on("disconnect", function () {
        console.log("User: ".concat(socket.id, " disconnected"));
    });
});
/**
 * Initial setup
 */
var hierarchy = new hierarchy_1.Hierarchy("-1#-1");
// TEST
// hierarchy.addEntity("-1#0", 0);
// hierarchy.addEntity("-1#1", 1);
// console.log("---------- ***** ----------");
// console.log(hierarchy.getData());
// hierarchy.reparent("-1#1", "-1#0");
// console.log("---------- ***** ----------");
// console.log(hierarchy.getData());
// hierarchy.addEntity("-1#2", 2);
// hierarchy.reparent("-1#2", "-1#1");
// const ret = hierarchy.reparent("-1#0", "-1#2");
// console.log("---------- ***** ----------");
// console.log(hierarchy.getData());
// console.log(ret);
// hierarchy.deleteEntity("-1#0");
// console.log("---------- ***** ----------");
// console.log(hierarchy.getData());
/**
 * Initiate server
 */
server.listen(3000, function () {
    console.log("Listening on port: 3000");
});
