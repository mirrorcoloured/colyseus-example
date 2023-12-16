import { Schema, type } from "@colyseus/schema";
import { WORLD_WIDTH, WORLD_HEIGHT, PLAYER_RADIUS, PLAYER_STARTING_LIFE } from "./State";

export class Player extends Schema {
    @type("number")
    x = Math.floor(Math.random() * WORLD_WIDTH);

    @type("number")
    y = Math.floor(Math.random() * WORLD_HEIGHT);

    @type("number")
    r = PLAYER_RADIUS;

    @type("number")
    angle = Math.floor(Math.random() * 2 * Math.PI);

    @type("number")
    life = PLAYER_STARTING_LIFE;

    starting_life = PLAYER_STARTING_LIFE;
}