import { type } from "@colyseus/schema";
import { Shape, Vec2D } from "./Base";

export class Circle extends Shape {
    @type(Vec2D)
    center;

    @type("number")
    r: number;

    constructor(x: number, y: number, r: number) {
        super();
        this.center = new Vec2D(x, y);
        this.r = r;
    }

    get area () {
        return Math.pow(this.r, 2) * Math.PI;
    }
}
