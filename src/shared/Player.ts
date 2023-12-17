import { Schema, type } from "@colyseus/schema";
import { WORLD_WIDTH, WORLD_HEIGHT, PLAYER_RADIUS, PLAYER_STARTING_LIFE } from "./State";
import { Circle } from "./Circle";

export class Player extends Schema {
    @type(Circle)
    hitbox = new Circle(
        Math.floor(Math.random() * WORLD_WIDTH),
        Math.floor(Math.random() * WORLD_HEIGHT),
        PLAYER_RADIUS
        );

    @type("number")
    angle = Math.floor(Math.random() * 2 * Math.PI);

    @type("number")
    life = PLAYER_STARTING_LIFE;

    starting_life = PLAYER_STARTING_LIFE;
}