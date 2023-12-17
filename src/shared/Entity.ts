import { Schema, type } from "@colyseus/schema";
import { Circle } from "./Circle";

export class Entity extends Schema {
    @type(Circle)
    hitbox

    @type("number")
    angle = Math.floor(Math.random() * 2 * Math.PI);

    constructor(x: number, y: number, r: number) {
        super();
        this.hitbox = new Circle(x, y, r);
    }
}