import { Schema, type } from "@colyseus/schema";
import { Circle } from "./Circle";

export class Entity extends Schema {
    @type(Circle)
    hitbox

    @type("number")
    angle = Math.floor(Math.random() * 2 * Math.PI);

    id = uuidv4();

    constructor(x: number, y: number, r: number) {
        super();
        this.hitbox = new Circle(x, y, r);
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}