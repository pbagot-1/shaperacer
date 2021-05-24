// npm install uNetworking/uWebSockets.js#v16.2.0
const uWS = require('uWebSockets.js');
const importLinked = require("./ExpiringLinkedList.js");
const shapeGen = require("./shapegen.js");

const decoder = new TextDecoder();

//var flag = false;
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

function generateNewRoom(roomName, socketList) {
    newScoreMap = new Map();
    newLinkedList = new importLinked.ExpiringLinkedList(3);
    socketList.forEach(item => newScoreMap.set(item.uuid, 0));
    gameMap.set(roomName, [newScoreMap, newLinkedList]);
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
                    
                    //var scoreMapUpdate = new Map([...scoreMap.entries()].sort());
                    //console.log("SMU", scoreMapUpdate);
                    msg = JSON.stringify(["scoreboard", mapToObj(currentScoreMap)]);
                    //gng = JSON.parse(msg);
                    //console.log(gng);
                    app.publish(socket.room, msg, false); 
                }
            }
        }
    }
    return socketCheck;
}

function startGameLoop(room) {
    var flag = false;
    var gameLoop = setInterval(function() {
    if (flag == false) {
        msg = JSON.stringify(["scoreboard", mapToObj(gameMap.get(room)[0])]);
        //gng = JSON.parse(msg);
        //console.log(gng);
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
}

const app = uWS.App().ws('/*', {  // handle messages from client

  open: (socket, req) => {
    socket.uuid = create_UUID();
    console.log("from creation: ", socket.uuid);
    wsMap.set(socket.uuid, socket);
    //scoreMap.set(socket.uuid, 0);

    /* For now we only have one canvas */
    /*if (flag == false) {
         setInterval(function() {
             shape = shapeGen(); 
             shape2 = shapeGen();
             shape3 = shapeGen();
             app.publish("drawing/canvas1", JSON.stringify(["drawing", shape[1]]), false); 
             app.publish("drawing/canvas1", JSON.stringify(["drawing", shape2[1]]), false); 
             app.publish("drawing/canvas1", JSON.stringify(["drawing", shape3[1]]), false); 
             myDict = new Map();
             var keys = Array.from(scoreMap.keys());
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
             mainLinkedList.push([shape[0], myDict]); 
             mainLinkedList.push([shape2[0], myDict2]); 
             mainLinkedList.push([shape3[0], myDict3]); 
             count++; 
             console.log(count);
             console.log("TEST TING", JSON.stringify(["drawing", shape[1]]));
        }, 2000);
    }
    flag = true;*/
    //socket.subscribe("drawing/canvas1");
  },
  message: (socket, message, isBinary) => {
    var d = new Date();
    var n = d.getTime();
    
    m = decoder.decode(message);
    /* In this simplified example we only have drawing commands */
    console.log("from message: ", m, socket.uuid);
    if (m == "play") {
        console.log("Got to play");
        searchingPlayers.push(socket);
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
        gameMap.get(socket.room)[1].each(check(socket, m, app));
    }
    
  },
  
  close: (socket, code, message) => {
    // called when a ws connection is closed
    //scoreMap.delete(socket.uuid);
    //msg = JSON.stringify(["scoreboard", mapToObj(scoreMap)]);
    //app.publish("drawing/canvas1", msg, false); 
    console.log("CLOSED");
  }
});

// finally listen using the app on port 9001
app.listen(9001, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 9001');
  }
});
