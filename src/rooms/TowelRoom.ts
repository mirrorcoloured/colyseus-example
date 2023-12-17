import { Room, Client } from "colyseus";
import { State } from "../shared/State";
import { checkCollision } from "../shared/Collisions";

export class TowelRoom extends Room<State> {
    maxClients = 4;
    elapsedTime = 0;
    FPS = 60;
    fixedTimeStep = 1000 / this.FPS;

    onCreate (options) {
        console.log("TowelRoom created!", options);

        this.setState(new State());

        // testing dummy summons
        setInterval(() => {
            let owner = "";
            let high_roll = 0;
            this.state.players.forEach((value, key) => {
                const roll = Math.random();
                if (roll > high_roll) {
                    owner = key;
                    high_roll = roll;
                }
            })
            this.state.createSummon(owner);
        }, 1000)

        // set up server loop
        this.setSimulationInterval((deltaTime) => {
            this.elapsedTime += deltaTime;

            while (this.elapsedTime >= this.fixedTimeStep) {
                this.elapsedTime -= this.fixedTimeStep;
                this.update(this.fixedTimeStep);
            }
        })

        // add listeners
        this.onMessage("move", (client, data) => {
            console.log(`[${client.sessionId}] [move]:`, data);
            this.state.queuePlayerMove(client.sessionId, data);
        });

        this.onMessage("click", (client, data) => {
            console.log(`[${client.sessionId}] [click]:`, data);
            this.state.clickPlayer(client.sessionId, data);
        });

        this.onMessage("aim", (client, data) => {
            console.log(`[${client.sessionId}] [aim]:`, data);
            this.state.aimPlayer(client.sessionId, data);
        });
    }

    onJoin (client: Client) {
        console.log(client.sessionId, "joined!");
        client.send("welcome", client.sessionId); // tell client their sessionId
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client: Client) {
        console.log(client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
    }

    onDispose () {
        console.log("Dispose TowelRoom");
    }

    update(deltaTime) {
        // move AI entities
        this.runAI();

        // update entities to target positions
        this.runMovement();
    }

    runAI() {
        this.state.entities.forEach((entity, index) => {
            if (entity.entityType == "Summon") {
                // console.log('running summon', entity.id);
                let closest_player_pos = entity.hitbox.center;
                let closest_distance = 9999;
                let found_player = false;
                this.state.entities.forEach((other_entity, other_index) => {
                    if (other_entity.entityType == "Player") {
                        if (other_entity.id != entity.creator) {
                            const dist = entity.hitbox.center.distanceTo(other_entity.hitbox.center);
                            if (dist < closest_distance) {
                                // console.log('found player', other_entity.id);
                                found_player = true;
                                closest_distance = dist;
                                closest_player_pos = other_entity.hitbox.center;
                            }
                        }
                    }
                })
                if (found_player) {
                    const angle = Math.atan2(closest_player_pos.y - entity.hitbox.center.y, closest_player_pos.x - entity.hitbox.center.x);
                    entity.target_pos.x = entity.hitbox.center.x + entity.speed * Math.cos(angle);
                    entity.target_pos.y = entity.hitbox.center.y + entity.speed * Math.sin(angle);
                }
            }
        })
    }

    runMovement() {
        this.state.entities.forEach((entity, index) => {

            // don't go outside world boundary
            if (entity.target_pos.x < this.state.bounds.minX + entity.hitbox.r) {
                entity.target_pos.x = this.state.bounds.minX + entity.hitbox.r;
            } else if (entity.target_pos.x > this.state.bounds.maxX - entity.hitbox.r) {
                entity.target_pos.x = this.state.bounds.maxX - entity.hitbox.r;
            }
            if (entity.target_pos.y < this.state.bounds.minY + entity.hitbox.r) {
                entity.target_pos.y = this.state.bounds.minY + entity.hitbox.r;
            } else if (entity.target_pos.y > this.state.bounds.maxY - entity.hitbox.r) {
                entity.target_pos.y = this.state.bounds.maxY - entity.hitbox.r;
            }
    
            // collide with other things
            this.state.entities.forEach(function(other_entity, other_index) {
                if (entity.id != other_entity.id) {
                    if (checkCollision(entity.hitbox, other_entity.hitbox)) {
                        if (entity.entityType == "Player" && other_entity.entityType == "Summon") {
                            // console.log('collide!');
                            entity.life--;
                            this.state.removeSummon(other_entity.id);
                        }
                        // const pos = getCollisionPosition(player.hitbox, other_entity.hitbox, target_pos);
                        // if (pos) {
                        //     target_pos.x = pos.x;
                        //     target_pos.y = pos.y;
                        // }
                    }
                }
            }.bind(this))

            // move to target position
            entity.hitbox.center.x = entity.target_pos.x;
            entity.hitbox.center.y = entity.target_pos.y;
        })
    }

}
