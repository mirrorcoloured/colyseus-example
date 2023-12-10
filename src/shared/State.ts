import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Rect } from "./Rect";

export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 1000;
export const PLAYER_RADIUS = 25;
const PLAYER_SPEED = 10;

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
        if (movement.x) {
            this.players.get(sessionId).x = Math.min(Math.max(this.players.get(sessionId).x + movement.x * PLAYER_SPEED, this.bounds.minX), this.bounds.maxX);
        }
        if (movement.y) {
            this.players.get(sessionId).y = Math.min(Math.max(this.players.get(sessionId).y + movement.y * PLAYER_SPEED, this.bounds.minY), this.bounds.maxY);
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