import { ZCanvas } from "./ZCanvas.js";

const FPS = 60;
const FRAME_WIDTH = 1200;
const FRAME_HEIGHT = 800;
const FRAME_LAYERS = 3;

const zc = new ZCanvas(document.body, FRAME_WIDTH, FRAME_HEIGHT, FRAME_LAYERS);

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

    window.setInterval(function () {
        processInputs();
        drawDisplay(room.state);
    }, 1000 / FPS);
});


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

function drawDisplay(state) {
    // background
    const bkg_ctx = zc.getContext(0, 'webgl');
    // bkg_ctx.clearColor(0.2, 0, 0, 0);
    // bkg_ctx.clear(bkg_ctx.COLOR_BUFFER_BIT);

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