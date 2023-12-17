import { type } from "@colyseus/schema";
import { Entity } from "./Entity";

const SUMMON_LIFE = 10;
const SUMMON_RADIUS = 12;
const SUMMON_SPEED = 4;

export class Summon extends Entity {
    @type("number")
    life = SUMMON_LIFE;

    starting_life = SUMMON_LIFE;

    @type("string")
    creator;

    @type("number")
    speed = SUMMON_SPEED;

    constructor(x: number, y: number, creator: string) {
        super(x, y, SUMMON_RADIUS);
        this.entityType = "Summon";
        this.creator = creator;
    }
}