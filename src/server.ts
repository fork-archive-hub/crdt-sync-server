const path = require("path");
const http = require("http");
const express = require("express");

import { Server, Socket } from "socket.io";
import { HierarchyInterface, Hierarchy, Entity, EntityInterface } from "./data-models/hierarchy";

/**
 * Create server instance & configure
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server);

/**
 * Middleware
 */
app.use(express.static("dist"));

/**
 * Resolvers
 */
app.get("/", (req, res) => {
    res.end("ok");
});

/**
 * Socket.io event handlers
 */
io.on("connection", (socket: Socket) => {
    console.log(`User: ${socket.id} connected`);
    socket.emit("init", hierarchy.getData());

    socket.on("createEntity", (data, callback) => {
        const entityData = JSON.parse(data)[0];

        // Handle create entity
        if (hierarchy.addEntity(new Entity(
            entityData.id, {
                parentId: entityData.relationship.parentId, 
                fractionalIndex: entityData.relationship.fractionalIndex
            }, 
            entityData.properties
        ))) {
            // Broadcast to other sockets
            socket.broadcast.emit("createEntity", hierarchy.getData(entityData.id));

            callback({
                status: "OK"
            });
        } else {
            callback({
                status: "Err"
            });
        }
    });

    socket.on("deleteEntity", (id) => {
        // Handle delete entity
        const res = hierarchy.deleteEntity(id);

        if (res.result) {
            // Broadcast to other sockets
            io.emit("deleteEntity", res.ids);
        }
    });

    socket.on("reparentEntity", (reparentData: {
        id: string,
        newParentId: string
    }) => {
        // Handle reparent entity
        console.log("on reparentEntity: ");
        console.log(reparentData);
    });

    socket.on("disconnect", () => {
        console.log(`User: ${socket.id} disconnected`);
    });
});

/**
 * Initial setup
 */
const hierarchy: HierarchyInterface = new Hierarchy("-1#0");

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
server.listen(3000, () => {
    console.log("Listening on port: 3000");
});