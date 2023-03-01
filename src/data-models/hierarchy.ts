type Primitive = null | number | boolean | string;
type JsonValue = Primitive | JsonArray | JsonObject;
type JsonArray = JsonValue[];
type JsonObject = {
	[key: string]: JsonValue;
};

interface EntityInterface {
	id: string;
	parentId: string;
	childrenIds: string[];
	value: number;
}

/**
 * Server data model is governed entirely by a tree representation
 */
interface HierarchyInterface {
	rootId: string;
	// Hashmap for key access to the entities
	entities: {
		[key: string]: EntityInterface;
	};
	addEntity(id: string, value: number): boolean;
	deleteEntity(id: string): {
		result: boolean;
		ids: string[];
	};
	reparent(id: string, newParentId: string): boolean;

	getData(id?: string): string;
}

class Entity implements EntityInterface {
	id: string;
	parentId: string;
	childrenIds: string[];
	value: number;

	constructor(id: string, value: number) {
		this.id = id;
		this.value = value;
        this.childrenIds = [];
	}
}

class Hierarchy implements HierarchyInterface {
	rootId: string;
	entities: {
		[key: string]: EntityInterface;
	};

	constructor(rootId: string) {
		this.rootId = rootId;
		this.entities = {};

		const root = new Entity(rootId, undefined);
		root.parentId = rootId;
		this.entities[rootId] = root;
	}

	addEntity(id: string, value: number): boolean {
		if (this.entities[id] !== undefined) {
            return false;
        }

		const entity = new Entity(id, value);
        entity.parentId = this.rootId;
        this.entities[this.rootId].childrenIds.push(id);
		this.entities[id] = entity;

		return true;
	}

	deleteEntity(id: string): { result: boolean; ids: string[] } {
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

        const deletedIds: string[] = [];
        this.deleteEntityRecursive(id, deletedIds);

        deletedIds.forEach((id) => {
            delete this.entities[id];
        });

        return {
            result: true,
            ids: deletedIds
        };
    }

    private deleteEntityRecursive(id: string, deletedIds: string[]) {
        const entity = this.entities[id];
        entity.parentId = undefined;

        for (let i = 0; i < entity.childrenIds.length; ++i) {
            this.deleteEntityRecursive(entity.childrenIds[i], deletedIds);
        }
        
        deletedIds.push(id);
        delete this.entities[id];
    }

    reparent(id: string, newParentId: string): boolean {
        if (
            this.entities[id] === undefined ||
            this.entities[newParentId] === undefined ||
            id === this.rootId ||
            id === newParentId
        ) {
            return false;
        }

        if (this.checkCycle(id, newParentId)) {
            return false;
        }

        
        const entity = this.entities[id];
        this.removeItem<string>(this.entities[entity.parentId].childrenIds, id);
        entity.parentId = newParentId;
        this.entities[newParentId].childrenIds.push(id);

        return true;
    }

    private checkCycle(id: string, newParentId: string): boolean {
        let res = false;

        while (newParentId !== this.rootId) {
            if (newParentId === id) {
                res = true;
                break;
            }

            newParentId = this.entities[newParentId].parentId;
        }

        return res;
    }

    private removeItem<T>(arr: T[], item: T) {
        const index = arr.indexOf(item);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    getData(id?: string): string {
        const res = [];
        if (id) {
            res.push({...this.entities[id]});
        } else {
            for (const [key, value] of Object.entries(this.entities)) {
                res.push({...value});
            }
        }

        return JSON.stringify(res);
    }
}

export { EntityInterface, Entity, HierarchyInterface, Hierarchy };
