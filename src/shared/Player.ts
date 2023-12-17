import { Schema, type } from "@colyseus/schema";
import { Entity } from "./Entity";

export const PLAYER_RADIUS = 25;
export const PLAYER_SPEED = 10;
export const PLAYER_STARTING_LIFE = 40;

export class Player extends Entity {
    @type("number")
    life = PLAYER_STARTING_LIFE;

    starting_life = PLAYER_STARTING_LIFE;

    @type("number")
    speed = PLAYER_SPEED;

    constructor(x: number, y: number) {
        super(x, y, PLAYER_RADIUS);
        this.entityType = "Player";
    }
}