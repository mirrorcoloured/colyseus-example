import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "../shared/Player";

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    movePlayer (sessionId: string, movement: any) {
        if (movement.x) {
            this.players.get(sessionId).x += movement.x * 10;

        } else if (movement.y) {
            this.players.get(sessionId).y += movement.y * 10;
        }
    }
}

export class TowelRoom extends Room<State> {
    maxClients = 4;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());

        this.onMessage("move", (client, data) => {
            console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
    }

    // onAuth(client, options, req) {
    //     return true;
    // }

    onJoin (client: Client) {
        // client.send("hello", "world");
        console.log(client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        console.log(client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}
