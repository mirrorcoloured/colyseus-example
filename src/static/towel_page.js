var host = window.document.location.host.replace(/:.*/, '');

var client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : ''));
var room;
const ROOM_NAME = "towel"
client.joinOrCreate(ROOM_NAME).then(room_instance => {
    room = room_instance

    var players = {};
    var colors = ['red', 'green', 'yellow', 'blue', 'cyan', 'magenta'];

    // listen to patches coming from the server
    room.state.players.onAdd(function (player, sessionId) {
        var dom = document.createElement("div");
        dom.className = "player";
        dom.style.left = player.x + "px";
        dom.style.top = player.y + "px";
        dom.style.background = colors[Math.floor(Math.random() * colors.length)];
        dom.innerText = "Player " + sessionId;

        player.onChange(function (changes) {
            dom.style.left = player.x + "px";
            dom.style.top = player.y + "px";
        });

        players[sessionId] = dom;
        document.body.appendChild(dom);
    });

    room.state.players.onRemove(function (player, sessionId) {
        document.body.removeChild(players[sessionId]);
        delete players[sessionId];
    });


    room.onMessage("hello", (message) => {
        console.log(message);
    });

    document.addEventListener("keydown", e => keyEvent(e));
    document.addEventListener("keyup", e => keyEvent(e));

});


const keyspressed = {};
function keyEvent(e) {
    if (e.type === "keydown") {
        keyspressed[e.key] = 1;
    } else if (e.type === "keyup") {
        keyspressed[e.key] = 0;
    }
}

function processInputs (e) {
    if (keyspressed['ArrowUp'] || keyspressed['w']) {
        up();
    } else if (keyspressed['ArrowRight'] || keyspressed['d']) {
        right();
    } else if (keyspressed['ArrowDown'] || keyspressed['s']) {
        down();
    } else if (keyspressed['ArrowLeft'] || keyspressed['a']) {
        left();
    }
}

function up () {
    room.send("move", { y: -1 });
}

function right () {
    room.send("move", { x: 1 });
}

function down () {
    room.send("move", { y: 1 })
}

function left () {
    room.send("move", { x: -1 })
}


const FPS = 60;
window.setInterval(function () {
    processInputs();
}, 1000 / FPS);