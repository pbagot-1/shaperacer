// npm install uNetworking/uWebSockets.js#v16.2.0
const uWS = require('uWebSockets.js');
const importLinked = require("./ExpiringLinkedList.js");
const shapeGen = require("./shapegen.js");

const decoder = new TextDecoder();

var firstPlayerJoin = false;
var count = 0;
var mainLinkedList = new importLinked.ExpiringLinkedList(3);

const scoreMap = new Map();
const wsMap = new Map();
var searchingPlayers = [];

const gameMap = new Map();
// an "app" is much like Express.js apps with URL routes,
// here we handle WebSocket traffic on the wildcard "/*" route
var diffy = 0;
function create_UUID(a, b) { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'); return b }
function createRoomName() {return 'lobby' + create_UUID();}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

const mapToObj = m => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

const mapToList = m => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj.push([wsMap.get(key).playerName, value]);
    return obj;
  }, []);
};

function generateNewRoom(roomName, socketList) {
    newScoreMap = new Map();
    newLinkedList = new importLinked.ExpiringLinkedList(3);
    socketList.forEach(item => newScoreMap.set(item.uuid, 0));
    gameMap.set(roomName, [newScoreMap, newLinkedList]);
}

// shuts down room after someone wins
function shutDownRoom(roomName, socket, app) {
    msg = JSON.stringify(["GAME OVER", socket.playerName]);
    app.publish(socket.room, msg, false);  
    clearInterval(gameMap.get(roomName)[2]);  
    var uuidsToUnsub = Array.from(gameMap.get(socket.room)[0].keys());
    uuidsToUnsub.forEach(item => delete wsMap.get(item).room);    
    gameMap.delete(roomName);
}

function check(socket, message, app) {
    var found = false;
    function socketCheck(item) {
        //TODO: use iterator to stop early instead of each
        if (found == false) {
            if (item[0] == message) {
                if (Array.from(item[1].keys()).includes(socket.uuid) && item[1].get(socket.uuid) == false) {
                    currentScoreMap = gameMap.get(socket.room)[0];
                    currentScoreMap.set(socket.uuid, currentScoreMap.get(socket.uuid) + 1);
                    item[1].set(socket.uuid, true);
                    console.log("current score of " + socket.uuid + " " + currentScoreMap.get(socket.uuid));
                    found = true;
                    console.log("THISTHING", mapToList(currentScoreMap));
                    msg = JSON.stringify(["scoreboard", mapToList(currentScoreMap)]);
                    app.publish(socket.room, msg, false); 
                    if (currentScoreMap.get(socket.uuid) == 10) {
                        shutDownRoom(socket.room, socket, app);
                    }
                }
            }
        }
    }
    return socketCheck;
}

function startGameLoop(room) {
    var flag = false;
    var c = setInterval(function() {
        var gameLoop = setInterval(function() {
        if (flag == false) {
            msg = JSON.stringify(["scoreboard", mapToList(gameMap.get(room)[0])]);
            app.publish(room, msg, false); 
        }
        flag = true;
        shape = shapeGen.shapeGen(); 
        shape2 = shapeGen.shapeGen();
        shape3 = shapeGen.shapeGen();
        app.publish(room, JSON.stringify(["drawing", shape[1]]), false); 
        app.publish(room, JSON.stringify(["drawing", shape2[1]]), false); 
        app.publish(room, JSON.stringify(["drawing", shape3[1]]), false); 
        myDict = new Map();
        var keys = Array.from(gameMap.get(room)[0].keys());
        keys.forEach(function(key){
        myDict.set(key, false);    
        });

        myDict2 = new Map();
        keys.forEach(function(key){
        myDict2.set(key, false);    
        });

        myDict3 = new Map();
        keys.forEach(function(key){
        myDict3.set(key, false);    
        });            
        gameLinkedList = gameMap.get(room)[1];
        gameLinkedList.push([shape[0], myDict]); 
        gameLinkedList.push([shape2[0], myDict2]); 
        gameLinkedList.push([shape3[0], myDict3]); 
        count++; 
        console.log(count);
        }, 3000);
    gameMap.get(room).push(gameLoop);
    clearInterval(c);
    }, 4000);
}

const app = uWS.App().ws('/*', {  // handle messages from client

  open: (socket, req) => {
    socket.uuid = create_UUID();
    socket.playerName = socket.uuid;
    console.log("from creation: ", socket.uuid);
    wsMap.set(socket.uuid, socket);
    socket.subscribe("mainlobby");
    if (!firstPlayerJoin) {
        setInterval(function() {
            app.publish("mainlobby", JSON.stringify(["PLAYERS ONLINE", wsMap.size]), false); 
        }, 1000);
        firstPlayerJoin = true;
        }
  },
  
  message: (socket, message, isBinary) => {
    var d = new Date();
    var n = d.getTime();
    try {
            m = JSON.parse(decoder.decode(message));
        } catch (error) {
            return;
        }

    /* In this simplified example we only have drawing commands */
    console.log("from message: ", m[0], socket.uuid);
    if (m[0] == "play" && typeof socket.room == "undefined") {
        console.log("Got to play");
        if (m[1] != '') {
            socket.playerName = m[1]; }
        else {
            socket.playerName = "Guest " + socket.uuid.substring(0, 6);
        }
        if (!searchingPlayers.includes(socket)) {
            searchingPlayers.push(socket);
        }
        if (searchingPlayers.length == 2) {
            new_room = createRoomName();
            searchingPlayers.forEach(item => {item.subscribe(new_room); item.room = new_room;});
            generateNewRoom(new_room, searchingPlayers);
            searchingPlayers = [];
            var z = new Date();
            var x = z.getTime();
            console.log("TIME DIF IN RECIEVED", x - n);
            app.publish(new_room, JSON.stringify(["GAME START"]), false); 
            startGameLoop(new_room);
        }
        
    }
    
    // check to see if sockets score needs to be increased
    if (typeof socket.room !== "undefined") {
        gameMap.get(socket.room)[1].each(check(socket, m[0], app));
    }
    
  },
  
  close: (socket, code, message) => {
    wsMap.delete(socket.uuid);
    var index = searchingPlayers.indexOf(socket);
    if (index > -1) {
      searchingPlayers.splice(index, 1);
    }
  }
});

// finally listen using the app on port 9001
app.listen(9001, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 9001');
  }
});
