import { Schema, type } from "@colyseus/schema";
import { PLAYER_STARTING_LIFE } from "./State";
import { Entity } from "./Entity";

export class Player extends Entity {
    @type("number")
    life = PLAYER_STARTING_LIFE;

    starting_life = PLAYER_STARTING_LIFE;
}