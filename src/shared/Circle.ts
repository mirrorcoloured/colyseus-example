import { Schema, type } from "@colyseus/schema";

export class Circle extends Schema {
    @type("number")
    x: number;

    @type("number")
    y: number;

    @type("number")
    r: number;

    constructor(x: number, y: number, r: number) {
        super();
        this.x = x;
        this.y = y;
        this.r = r;
    }

    get area () {
        return Math.pow(this.r, 2) * Math.PI;
    }
}
