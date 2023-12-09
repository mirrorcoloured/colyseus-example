import { ZCanvas } from "./ZCanvas.js";
import { Renderer } from "./renderer.js";
import { Player } from "../shared/Player.ts";

const FPS = 60;
const FRAME_WIDTH = 1200;
const FRAME_HEIGHT = 800;
const FRAME_LAYERS = 3;

const zc = new ZCanvas(document.body, FRAME_WIDTH, FRAME_HEIGHT, FRAME_LAYERS);
const render = new Renderer(zc.getContext(0, 'webgl'))

var host = window.document.location.host.replace(/:.*/, '');

var client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : ''));
var room;
const ROOM_NAME = "towel"
client.joinOrCreate(ROOM_NAME).then(room_instance => {
    room = room_instance


    room.state.players.onAdd(function (player, sessionId) {
        
    });

    room.state.players.onRemove(function (player, sessionId) {
        
    });


    room.onMessage("hello", (message) => {
        console.log(message);
    });

    document.addEventListener("keydown", e => keyEvent(e));
    document.addEventListener("keyup", e => keyEvent(e));

    window.requestAnimationFrame((time) => {
        animationLoop(time, room.state,0);
    });
});

function animationLoop(timeExec,state,timeLastExec) {
    console.group('[AnimLoop]');
    console.debug(`${Number(timeExec-timeLastExec).toFixed(2)}ms/${Number(1000/FPS).toFixed(2)}ms`)
    if (timeExec - timeLastExec >= 1000 / FPS){
        console.debug('Frame Update Required')
        console.groupEnd();

        processInputs();
        drawDisplay(state,timeExec-timeLastExec);

        requestAnimationFrame((timeAnim) => animationLoop(timeAnim,state,timeExec));
    } else {
        console.debug('No Update Required (FPS)')
        console.groupEnd();

        requestAnimationFrame((timeAnim) => animationLoop(timeAnim,state,timeLastExec));
    }
}

const keyspressed = {};

function keyEvent(e) {
    if (e.type === "keydown") {
        keyspressed[e.key] = 1;
    } else if (e.type === "keyup") {
        keyspressed[e.key] = 0;
    }
}

function processInputs() {
    if (keyspressed['ArrowUp'] || keyspressed['w']) {
        room.send("move", { y: -1 });
    } else if (keyspressed['ArrowRight'] || keyspressed['d']) {
        room.send("move", { x: 1 });
    } else if (keyspressed['ArrowDown'] || keyspressed['s']) {
        room.send("move", { y: 1 })
    } else if (keyspressed['ArrowLeft'] || keyspressed['a']) {
        room.send("move", { x: -1 })
    }
}

function drawDisplay(state,timeDelta) {
    // background
    const bkg_ctx = zc.getContext(0, 'webgl');
    console.debug("[Draw]",`${Number(timeDelta).toFixed(2)}ms`)
    render.paint(timeDelta);

    // players
    const player_ctx = zc.getContext(1, '2d');
    player_ctx.clear();
    state.players.forEach((player_info, player_name) => {
        drawPlayer(player_name, player_info, player_ctx);
    });

    // ui
    const ui_ctx = zc.getContext(2, '2d');
    ui_ctx.clear();
    ui_ctx.fillStyle = "black";
    ui_ctx.rect(5, 5, 30, 10);
    ui_ctx.fill();
}

function drawPlayer(player_name, player_info, ctx) {
    // circle
    ctx.fillStyle = "teal";
    ctx.beginPath();
    ctx.arc(player_info.x, player_info.y, 50, 0, 2 * Math.PI);
    ctx.fill();
    
    // label
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(player_name, player_info.x - 45, player_info.y + 5);
}