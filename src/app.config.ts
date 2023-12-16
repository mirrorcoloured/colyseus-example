import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import path from 'path';
import serveIndex from 'serve-index';
import express from 'express';

// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";

// Import demo room handlers
import { LobbyRoom, RelayRoom } from 'colyseus';
import { ChatRoom } from "./rooms/01-chat-room";
import { StateHandlerRoom } from "./rooms/02-state-handler";
import { AuthRoom } from "./rooms/03-auth";
import { ReconnectionRoom } from './rooms/04-reconnection';
import { CustomLobbyRoom } from './rooms/07-custom-lobby-room';
import { TowelRoom } from "./rooms/TowelRoom";

export default config({
    options: {
        devMode: true,
    },

    initializeGameServer: (gameServer) => {
        // Define "lobby" room
        gameServer.define("lobby", LobbyRoom);

        // Define "relay" room
        gameServer.define("relay", RelayRoom, { maxClients: 4 })
            .enableRealtimeListing();

        // Define "chat" room
        gameServer.define("chat", ChatRoom)
            .enableRealtimeListing();

        // Register ChatRoom with initial options, as "chat_with_options"
        // onInit(options) will receive client join options + options registered here.
        gameServer.define("chat_with_options", ChatRoom, {
            custom_options: "you can use me on Room#onCreate"
        });

        // Define "state_handler" room
        gameServer.define("state_handler", StateHandlerRoom)
            .enableRealtimeListing();

        gameServer.define("towel", TowelRoom)
            .enableRealtimeListing();

        // Define "auth" room
        gameServer.define("auth", AuthRoom)
            .enableRealtimeListing();

        // Define "reconnection" room
        gameServer.define("reconnection", ReconnectionRoom)
            .enableRealtimeListing();

        // Define "custom_lobby" room
        gameServer.define("custom_lobby", CustomLobbyRoom);

        gameServer.onShutdown(function(){
            console.log(`game server is going down.`);
        });


    },

    initializeExpress: (app) => {
        app.use(function (req, res, next) {
            const client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
            console.log(`${client_ip} ${req.method} ${req.url}`);
            next();
        })

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, "static", 'towel_page.html'));
        });

        app.use('/static', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use('/static', express.static(path.join(__dirname, "static")));
        
        app.use('/build', serveIndex(path.join(__dirname, "..", "build"), {'icons': true}))
        app.use('/build', express.static(path.join(__dirname, "..", "build")));
        
        app.use('/dist', serveIndex(path.join(__dirname, "..", "dist"), {'icons': true}))
        app.use('/dist', express.static(path.join(__dirname, "..", "dist")));

        // (optional) client playground
        app.use('/playground', playground);

        // (optional) web monitoring panel
        app.use('/colyseus', monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
