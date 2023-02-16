"use strict";
exports.__esModule = true;
var path = require("path");
var http = require("http");
var express = require("express");
var Server = require("socket.io").Server;
var data_model_1 = require("./models/data-model");
/**
 * Create server instance & configure
 */
var app = express();
var server = http.createServer(app);
var io = new Server(server);
/**
 * Middleware
 */
app.use(express.static("client/dist"));
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
var hierarchy = new data_model_1.Hierarchy("-1#0");
/**
 * Initiate server
 */
server.listen(3000, function () {
    console.log("Listening on port: 3000");
});
