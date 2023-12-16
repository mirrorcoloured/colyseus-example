import { Room, Client } from "colyseus";
import { State } from "../shared/State";

export class TowelRoom extends Room<State> {
    maxClients = 4;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());

        this.onMessage("move", (client, data) => {
            console.log(`[${client.sessionId}] [move]:`, data);
            this.state.movePlayer(client.sessionId, data);
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

    // onAuth(client, options, req) {
    //     return true;
    // }

    onJoin (client: Client) {
        console.log(client.sessionId, "joined!");
        client.send("welcome", client.sessionId);
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
