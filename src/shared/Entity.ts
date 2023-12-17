import { Schema, type } from "@colyseus/schema";
import { Circle } from "./Circle";
import { Vec2D } from "./Base";

export class Entity extends Schema {
    @type(Circle)
    hitbox;

    @type(Vec2D)
    target_pos;

    @type("number")
    angle = Math.floor(Math.random() * 2 * Math.PI);

    @type("string")
    entityType = "Entity";
    
    @type("string")
    id = uuidv4();

    constructor(x: number, y: number, r: number) {
        super();
        this.hitbox = new Circle(x, y, r);
        this.target_pos = new Vec2D(x, y);
    }
}

function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}