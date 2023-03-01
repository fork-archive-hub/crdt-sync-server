"use strict";
exports.__esModule = true;
exports.Hierarchy = exports.Entity = void 0;
var Entity = /** @class */ (function () {
    function Entity(id, value) {
        this.id = id;
        this.value = value;
        this.childrenIds = [];
    }
    return Entity;
}());
exports.Entity = Entity;
var Hierarchy = /** @class */ (function () {
    function Hierarchy(rootId) {
        this.rootId = rootId;
        this.entities = {};
        var root = new Entity(rootId, undefined);
        root.parentId = rootId;
        this.entities[rootId] = root;
    }
    Hierarchy.prototype.addEntity = function (id, value) {
        if (this.entities[id] !== undefined) {
            return false;
        }
        var entity = new Entity(id, value);
        entity.parentId = this.rootId;
        this.entities[this.rootId].childrenIds.push(id);
        this.entities[id] = entity;
        return true;
    };
    Hierarchy.prototype.deleteEntity = function (id) {
        var _this = this;
        if (id === this.rootId) {
            return {
                result: false,
                ids: []
            };
        }
        if (this.entities[id] === undefined) {
            return {
                result: false,
                ids: []
            };
        }
        var deletedIds = [];
        this.deleteEntityRecursive(id, deletedIds);
        deletedIds.forEach(function (id) {
            delete _this.entities[id];
        });
        return {
            result: true,
            ids: deletedIds
        };
    };
    Hierarchy.prototype.deleteEntityRecursive = function (id, deletedIds) {
        var entity = this.entities[id];
        entity.parentId = undefined;
        for (var i = 0; i < entity.childrenIds.length; ++i) {
            this.deleteEntityRecursive(entity.childrenIds[i], deletedIds);
        }
        deletedIds.push(id);
        delete this.entities[id];
    };
    Hierarchy.prototype.reparent = function (id, newParentId) {
        if (this.entities[id] === undefined ||
            this.entities[newParentId] === undefined ||
            id === this.rootId ||
            id === newParentId) {
            return false;
        }
        if (this.checkCycle(id, newParentId)) {
            return false;
        }
        var entity = this.entities[id];
        this.removeItem(this.entities[entity.parentId].childrenIds, id);
        entity.parentId = newParentId;
        this.entities[newParentId].childrenIds.push(id);
        return true;
    };
    Hierarchy.prototype.checkCycle = function (id, newParentId) {
        var res = false;
        while (newParentId !== this.rootId) {
            if (newParentId === id) {
                res = true;
                break;
            }
            newParentId = this.entities[newParentId].parentId;
        }
        return res;
    };
    Hierarchy.prototype.removeItem = function (arr, item) {
        var index = arr.indexOf(item);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    };
    Hierarchy.prototype.getData = function (id) {
        var res = [];
        if (id) {
            res.push({
                id: id,
                parentId: this.entities[id].parentId,
                value: this.entities[id].value
            });
        }
        else {
            for (var _i = 0, _a = Object.entries(this.entities); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                res.push({
                    id: value.id,
                    parentId: value.parentId,
                    value: value.value
                });
            }
        }
        return JSON.stringify(res);
    };
    return Hierarchy;
}());
exports.Hierarchy = Hierarchy;
