import { Schema, type } from "@colyseus/schema";

export class Rect extends Schema {
    @type("number")
    minX: number;

    @type("number")
    minY: number;

    @type("number")
    maxX: number;

    @type("number")
    maxY: number;

    constructor(minX: number, minY: number, maxX: number, maxY: number) {
        super();
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    get x () {
        return this.minX + this.width / 2;
    }

    get y () {
        return this.minY + this.height / 2;
    }

    get width () {
        return this.maxX - this.minX;
    }

    get height () {
        return this.maxY - this.minY;
    }

    get area () {
        return this.width * this.height;
    }
}
