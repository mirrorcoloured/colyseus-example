import { ZCanvas } from "./ZCanvas.js";
import { Renderer } from "./renderer.js";
import { hashCode } from "./helpers.js";

import { State } from "../shared/State.ts";
import { Player } from "../shared/Player.ts";
import { Rect } from "../shared/Rect.ts";
import { Circle } from "../shared/Circle.ts";

const FPS = 60;
const FRAME_WIDTH = 600;
const FRAME_HEIGHT = 600;
const FRAME_LAYERS = 3;
let world_width = null;
let world_height = null;

function worldPosToScreenPos(pos) {
    return {
        x: pos.x * (FRAME_WIDTH / world_width),
        y: pos.y * (FRAME_HEIGHT / world_height),
    }
}
function screenPosToWorldPos(pos) {
    return {
        x: pos.x / (FRAME_WIDTH / world_width),
        y: pos.y / (FRAME_HEIGHT / world_height),
    }
}

const DOM_ROOT = document.body;
const zc = new ZCanvas(DOM_ROOT, FRAME_WIDTH, FRAME_HEIGHT, FRAME_LAYERS);
const render = new Renderer(zc.getContext(0, 'webgl'),FPS)

let myPlayer = null;

var host = window.document.location.host.replace(/:.*/, '');

var client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : ''));
var room;
const ROOM_NAME = "towel"
client.joinOrCreate(ROOM_NAME).then(room_instance => {
    room = room_instance

    room.state.listen('bounds', (currentValue, previousValue) => {
        world_width = currentValue.maxX - currentValue.minX;
        world_height = currentValue.maxY - currentValue.minY;
    })

    room.state.players.onAdd(function (player, sessionId) {
        
    });

    room.state.players.onRemove(function (player, sessionId) {
        
    });

    room.onMessage("welcome", (myID) => {
        console.log("I am", myID);
        myPlayer = room.state.players[myID];
        initGame();
    });
});

function initGame() {
    DOM_ROOT.addEventListener("keydown", e => keyEvent(e));
    DOM_ROOT.addEventListener("keyup", e => keyEvent(e));
    DOM_ROOT.addEventListener("mousemove", e => mouseMoveEvent(e));
    DOM_ROOT.addEventListener("mousedown", e => clickEvent(e));
    DOM_ROOT.addEventListener("mouseup", e => clickEvent(e));

    window.requestAnimationFrame((time) => {
        animationLoop(time, room.state,0);
    });
}

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
        console.debug('No Update Required (Framerate)')
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
    let x = 0;
    let y = 0;
    if (keyspressed['ArrowUp'] || keyspressed['w']) {
        y += -1;
    }
    if (keyspressed['ArrowRight'] || keyspressed['d']) {
        x += 1;
    }
    if (keyspressed['ArrowDown'] || keyspressed['s']) {
        y += 1;
    }
    if (keyspressed['ArrowLeft'] || keyspressed['a']) {
        x += -1;
    }
    if (x || y) {
        const total = Math.abs(x) + Math.abs(y);
        room.send("move", {
            x: x / Math.sqrt(total),
            y: y / Math.sqrt(total),
        })
    }
}

function mouseMoveEvent(e) {
    const {x, y} = screenPosToWorldPos({x: e.clientX, y: e.clientY});
    room.send("aim", {
        x: x,
        y: y,
    })
}

function clickEvent(e) {
    const {x, y} = screenPosToWorldPos({x: e.clientX, y: e.clientY});
    const click_type = [
        'left',
        'middle',
        'right',
    ][e.button];
    if (e.type === "mousedown") {
        room.send("click", {
            x: x,
            y: y,
            click_type: click_type,
        })
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

    // life value
    const life_value = myPlayer.life;
    const life_pos = {x: FRAME_WIDTH / 2 - 20, y: 40};
    ui_ctx.font = '40px Sans-serif';
    ui_ctx.strokeStyle = 'black';
    ui_ctx.lineWidth = 8;
    ui_ctx.strokeText(life_value, life_pos.x, life_pos.y);
    ui_ctx.fillStyle = 'white';
    ui_ctx.fillText(life_value, life_pos.x, life_pos.y);
}

function drawPlayer(player_name, player, ctx) {
    const screenPos = worldPosToScreenPos({
        x: player.hitbox.center.x,
        y: player.hitbox.center.y,
    });
    
    // circle
    const ellipse_radius = worldPosToScreenPos({x: player.hitbox.r, y: player.hitbox.r});
    const hsh = hashCode(player_name);
    const r = ((hsh * 3) % 100) + 100;
    const g = ((hsh * 5) % 100) + 100;
    const b = ((hsh * 7) % 100) + 100;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.beginPath();
    ctx.ellipse(screenPos.x, screenPos.y, ellipse_radius.x, ellipse_radius.y, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // facing
    const AIM_LENGTH = 20;
    const ax = screenPos.x + Math.cos(player.angle) * AIM_LENGTH;
    const ay = screenPos.y + Math.sin(player.angle) * AIM_LENGTH;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    
    // label
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.font = "12px Arial";
    ctx.fillText(player_name, screenPos.x - 30, screenPos.y + 5);
}