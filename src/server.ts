const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

import {
    Hierarchy,
    Entity
} from "./models/data-model";

/**
 * Create server instance & configure
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server);

/**
 * Middleware
 */
app.use(express.static("dist/"));

/**
 * Resolvers
 */
app.get("/", (req, res) => {
    res.end("ok");
});

/**
 * Socket.io event handlers
 */
io.on("connection", (socket) => {
    console.log(`User: ${socket.id} connected`);
    socket.emit("init", hierarchy.getData());

    socket.on("createEntity", (data) => {
        // Handle create entity
        console.log(data);
    });

    socket.on("deleteEntity", (data) => {
        // Handle delete entity
    });

    socket.on("reparentEntity", (data) => {
        // Handle reparent entity
    });

    socket.on("disconnect", () => {
        console.log(`User: ${socket.id} disconnected`);
    });
});

/**
 * Initial setup
 */
const hierarchy = new Hierarchy("-1#0");

/**
 * Initiate server
 */
server.listen(3000, () => {
    console.log("Listening on port: 3000");
});