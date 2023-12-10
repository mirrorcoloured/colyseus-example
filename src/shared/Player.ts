import { Schema, type } from "@colyseus/schema";
import { WORLD_WIDTH, WORLD_HEIGHT, PLAYER_RADIUS } from "./State";

export class Player extends Schema {
    @type("number")
    x = Math.floor(Math.random() * WORLD_WIDTH);

    @type("number")
    y = Math.floor(Math.random() * WORLD_HEIGHT);

    @type("number")
    r = PLAYER_RADIUS;

    @type("number")
    angle = Math.floor(Math.random() * 2 * Math.PI);
}