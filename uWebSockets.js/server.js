// npm install uNetworking/uWebSockets.js#v16.2.0
const uWS = require('uWebSockets.js');
const importLinked = require("./ExpiringLinkedList.js");
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const decoder = new TextDecoder();

var flag = false;
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

const mapToObj = m => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

function check(socket, message, app) {
    var found = false;
    function socketCheck(item) {
        //TODO: use iterator to stop early instead of each
        if (found == false) {
            if (item[0] == message) {
                            console.log("GANG", Array.from(item[1].keys()));
                            console.log("cursok", socket.uuid);
                            console.log("valting", item[1].get(socket.uuid));
                             console.log("in",socket.uuid in Array.from(item[1].keys()));
                if (Array.from(item[1].keys()).includes(socket.uuid) && item[1].get(socket.uuid) == false) {
                    console.log("WTF");
                scoreMap.set(socket.uuid, scoreMap.get(socket.uuid) + 1);
                item[1].set(socket.uuid, true);
                console.log("current score of " + socket.uuid + " " + scoreMap.get(socket.uuid));
                found = true;
                
                //var scoreMapUpdate = new Map([...scoreMap.entries()].sort());
                //console.log("SMU", scoreMapUpdate);
                msg = JSON.stringify(["scoreboard", mapToObj(scoreMap)]);
                //gng = JSON.parse(msg);
                //console.log(gng);
                app.publish("drawing/canvas1", msg, false); 
                }
            }
        }
    }
    return socketCheck;
}

function shapeGen() {
var choice = getRandomInt(6) + 1;    

switch (choice){
  case 1:
    // Square that starts somewhere randomly
    var x = getRandomInt(620) + 50;
    var y = getRandomInt(380) + 50;

    var line1 = new Uint16Array([x, y]);

    x = x + 50; 
    var line2 = new Uint16Array([x, y]);

    y = y + 50;
    var line3 = new Uint16Array([x, y]);

    x = x - 50;
    var line4 = new Uint16Array([x, y]);

    y = y - 50;
    var line5 = new Uint16Array([x, y]);

    var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5]);
    return ["s", newList];
  
  case 2:
    // Triangle
    var x = getRandomInt(620) + 50;
    var y = getRandomInt(380) + 50;

    var line1 = new Uint16Array([x, y]);

    x = x + 50; 
    var line2 = new Uint16Array([x, y]);

    x = x - 25;
    y = y + 50;
    var line3 = new Uint16Array([x, y]);

    x = x - 25;
    y = y - 50;
    var line4 = new Uint16Array([x, y]);

    var line5 = new Uint16Array([x, y]);

    var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5]);
    return ["t", newList];
    
  case 3:
    // Triangle
    var x = getRandomInt(620) + 50;
    var y = getRandomInt(380) + 50;

    var line1 = new Uint16Array([x, y]);
    x = x + 25;
    var line2 = new Uint16Array([x, y]);
    x = x + 25;
    y = y + 25;
    var line3 = new Uint16Array([x, y]);
    y = y + 25;
    var line4 = new Uint16Array([x, y]);
    x = x - 25;
    y = y + 25;
    var line5 = new Uint16Array([x, y]);
    
    x = x - 25;
    var line6 = new Uint16Array([x, y]);
    
    x = x - 25;
    y = y - 25;
    var line7 = new Uint16Array([x, y]);

    y = y - 25;
    var line8 = new Uint16Array([x, y]);
    
    x = x + 25;
    y = y - 25;
    var line9 = new Uint16Array([x, y]);

    var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5,  ...line6,  ...line7,  ...line8,  ...line9,]);
    return ["o", newList];
    
  case 4:
    // Arrow
    var x = getRandomInt(620) + 50;
    var y = getRandomInt(380) + 50;

    var line1 = new Uint16Array([x, y]);
    x = x + 25;
    var line2 = new Uint16Array([x, y]);

    y = y - 15;
    var line3 = new Uint16Array([x, y]);
    
    x = x + 25
    y = y + 27.5;
    var line4 = new Uint16Array([x, y]);
    
    x = x - 25;
    y = y + 27.5;
    var line5 = new Uint16Array([x, y]);
    
    y = y - 15;
    var line6 = new Uint16Array([x, y]);
    
    x = x - 25;
    var line7 = new Uint16Array([x, y]);

    y = y - 25;
    var line8 = new Uint16Array([x, y]);

    var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5,  ...line6,  ...line7,  ...line8]);
    return ["a", newList];
    
  case 5:
    // Diamond
    var x = getRandomInt(620) + 50;
    var y = getRandomInt(380) + 50;

    var line1 = new Uint16Array([x, y]);
    
    x = x + 25;
    y = y + 25;
    var line2 = new Uint16Array([x, y]);

    x = x - 25;
    y = y + 25;
    var line3 = new Uint16Array([x, y]);
    
    x = x - 25
    y = y - 25;
    var line4 = new Uint16Array([x, y]);
    
    x = x + 25;
    y = y - 25;
    var line5 = new Uint16Array([x, y]);

    var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5]);
    return ["d", newList];
    
  case 6:
    // Circle
    var x = getRandomInt(620) + 50;
    var y = getRandomInt(380) + 50;

    var line1 = new Uint16Array([x, y, 50, 0, 2 * Math.PI + 1]);
    //ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    return ["c", line1];
}
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
    
    if (diffy != 0){
    console.log(n);
    console.log("TIME DIF IN RECIEVED", n - diffy);
    diffy = n;
    } else {
    diffy = n;
    }
    
    m = decoder.decode(message);
    /* In this simplified example we only have drawing commands */
    console.log("from message: ", m, socket.uuid);
    if (m == "play") {
        console.log("Got to play");
        searchingPlayers.push(socket.uuid);
        if (searchingPlayers.length == 2) {
            searchingPlayers.forEach(item => (wsMap.get(item)).subscribe("testyroom"));
            searchingPlayers = [];
        }
        
    }
    app.publish("testyroom", "IN ROOM NOW!", false); 
    //mainLinkedList.each(check(socket, m, app));
  },
  
  close: (socket, code, message) => {
    // called when a ws connection is closed
    scoreMap.delete(socket.uuid);
    msg = JSON.stringify(["scoreboard", mapToObj(scoreMap)]);
    app.publish("drawing/canvas1", msg, false); 
    console.log("CLOSED");
  }
});

// finally listen using the app on port 9001
app.listen(9001, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 9001');
  }
});
