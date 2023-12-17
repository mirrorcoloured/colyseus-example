import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Rect } from "./Rect";
import { Vec2D } from "./Base";
import { Entity } from "./Entity";
import { Summon } from "./Summon";

export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 1000;

export class State extends Schema {
    @type({ array: Entity })
    entities = new ArraySchema<Entity>;

    @type({ map: Player })
    players = new MapSchema<Player>();

    @type(Rect)
    bounds = new Rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string) {
        const player = new Player(
            Math.floor(Math.random() * WORLD_WIDTH),
            Math.floor(Math.random() * WORLD_HEIGHT)
        );
        player.id = sessionId;
        this.players.set(sessionId, player);
        this.entities.push(player);
    }

    createSummon(creator: string) {
        const summon = new Summon(
            Math.floor(Math.random() * WORLD_WIDTH),
            Math.floor(Math.random() * WORLD_HEIGHT),
            creator
        );
        this.entities.push(summon);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
        const index = this.entities.findIndex(entity => entity.id == sessionId);
        this.entities.splice(index, 1);
    }

    removeSummon(id: string) {
        const index = this.entities.findIndex(entity => entity.id == id);
        this.entities.splice(index, 1);
    }

    queuePlayerMove (sessionId: string, movement: any) {
        const player = this.players.get(sessionId);
        const ds = new Vec2D(movement.x * player.speed, movement.y * player.speed);
        let target_pos = player.hitbox.center.add(ds);
        player.target_pos.x = target_pos.x;
        player.target_pos.y = target_pos.y;
    }

    aimPlayer (sessionId: string, aim: any) {
        const player = this.players.get(sessionId);
        const theta = Math.atan2(aim.y - player.hitbox.center.y, aim.x - player.hitbox.center.x);
        player.angle = theta;
    }

    clickPlayer (sessionId: string, clickaction: any) {
        const player = this.players.get(sessionId);

    }
}