const http = require("http");
const express = require("express");

import { Server, Socket } from "socket.io";
import { Hierarchy } from "./data-models/hierarchy";

/**
 * Create server instance & configure
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
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

        // console.log("on createEntity: ");
        // console.log(`data: ${entityData}`);

        const res = hierarchy.addEntity(entityData.id, entityData.value);
        if (res) {
            io.emit("createEntity", hierarchy.getData(entityData.id));
            callback({ status: "Ok" });
        } else {
            callback({ status: "Err" });
        }
    });

    socket.on("deleteEntity", (id) => {
        // console.log("on deleteEntity: ");
        // console.log(`data: ${id}`);

        const res = hierarchy.deleteEntity(id);
        if (res.result) {
            io.emit("deleteEntity", res.ids);
        }
    });

    socket.on("reparentEntity", (reparentData: {
        id: string,
        newParentId: string
    }) => {
        // console.log("on reparentEntity: ");
        // console.log(`data: ${reparentData}`);

        const res = hierarchy.reparent(reparentData.id, reparentData.newParentId);
        if (res) {
            io.emit("reparentEntity", reparentData);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User: ${socket.id} disconnected`);
    });
});

/**
 * Initial setup
 */
const hierarchy = new Hierarchy("-1#-1");

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
server.listen(3000, () => {
    console.log("Listening on port: 3000");
});