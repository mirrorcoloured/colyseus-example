import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Rect } from "./Rect";
import { checkCollision, getCollisionPosition } from "./Collisions";
import { Vec2D } from "./Base";
import { Entity } from "./Entity";

export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 1000;

export const PLAYER_RADIUS = 25;
export const PLAYER_SPEED = 10;
export const PLAYER_STARTING_LIFE = 40;

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
            Math.floor(Math.random() * WORLD_HEIGHT),
            PLAYER_RADIUS
        );
        player.id = sessionId;
        this.players.set(sessionId, player);
        this.entities.push(player);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
        const index = this.entities.findIndex(entity => entity.id == sessionId)
        this.entities.splice(index, 1);
    }

    movePlayer (sessionId: string, movement: any) {
        const player = this.players.get(sessionId);
        const ds = new Vec2D(movement.x * PLAYER_SPEED, movement.y * PLAYER_SPEED);
        let target_pos = player.hitbox.center.add(ds);
        let valid_move = true;

        if (target_pos.x < this.bounds.minX + player.hitbox.r) {
            target_pos.x = this.bounds.minX + player.hitbox.r;
        }
        if (target_pos.x > this.bounds.maxX - player.hitbox.r) {
            target_pos.x = this.bounds.maxX - player.hitbox.r;
        }
        if (target_pos.y < this.bounds.minY + player.hitbox.r) {
            target_pos.y = this.bounds.minY + player.hitbox.r;
        }
        if (target_pos.y > this.bounds.maxY - player.hitbox.r) {
            target_pos.y = this.bounds.maxY - player.hitbox.r;
        }

        this.players.forEach(function(other_player, other_id) {
            if (sessionId != other_id) {
                if (checkCollision(player.hitbox, other_player.hitbox)) {
                    console.log('collide!');
                    const pos = getCollisionPosition(player.hitbox, other_player.hitbox, target_pos);
                    if (pos) {
                        target_pos.x = pos.x;
                        target_pos.y = pos.y;
                    }
                }
            }
        })

        if (valid_move) {
            player.hitbox.center.x = target_pos.x;
            player.hitbox.center.y = target_pos.y;
        }
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