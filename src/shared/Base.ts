import { Schema, type } from "@colyseus/schema";

export class Shape extends Schema {
    
}

export class Vec2D extends Schema {
    @type("number")
    x: number;
    
    @type("number")
    y: number;
    
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
    
    add(other: Vec2D): Vec2D {
        return new Vec2D(this.x + other.x, this.y + other.y);
    }
    
    subtract(other: Vec2D): Vec2D {
        return new Vec2D(this.x - other.x, this.y - other.y);
    }
    
    scale(factor: number): Vec2D {
        return new Vec2D(this.x * factor, this.y * factor);
    }
    
    dot(other: Vec2D): Vec2D {
        return new Vec2D(this.x * other.x, this.y * other.y);
    }

    distanceTo(other: Vec2D): number {
        return ((this.x - other.x) ** 2 + (this.y - other.y) ** 2) ** 0.5;
    }
}