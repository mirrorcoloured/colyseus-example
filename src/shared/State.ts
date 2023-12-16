import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Rect } from "./Rect";

export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 1000;

export const PLAYER_RADIUS = 25;
export const PLAYER_SPEED = 10;
export const PLAYER_STARTING_LIFE = 40;

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type(Rect)
    bounds = new Rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    movePlayer (sessionId: string, movement: any) {
        const player = this.players.get(sessionId);
        if (movement.x) {
            player.x = Math.min(Math.max(player.x + movement.x * PLAYER_SPEED, this.bounds.minX + player.r), this.bounds.maxX - player.r);
        }
        if (movement.y) {
            player.y = Math.min(Math.max(player.y + movement.y * PLAYER_SPEED, this.bounds.minY + player.r), this.bounds.maxY - player.r);
        }
    }

    aimPlayer (sessionId: string, aim: any) {
        const player = this.players.get(sessionId);
        const theta = Math.atan2(aim.y - player.y, aim.x - player.x);
        player.angle = theta;
    }

    clickPlayer (sessionId: string, clickaction: any) {
        this.players.get(sessionId)
    }
}