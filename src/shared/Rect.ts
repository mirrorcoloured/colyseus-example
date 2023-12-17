import { type } from "@colyseus/schema";
import { Vec2D, Shape } from "./Base";

export class Rect extends Shape {
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

    get width () {
        return this.maxX - this.minX;
    }

    get height () {
        return this.maxY - this.minY;
    }

    get area () {
        return this.width * this.height;
    }

    get center () {
        return new Vec2D(this.minX + this.width / 2, this.minY + this.height / 2);
    }
}
