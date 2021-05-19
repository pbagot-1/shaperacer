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
const wsMap=new Map();
const scoreMap=new Map();
// an "app" is much like Express.js apps with URL routes,
// here we handle WebSocket traffic on the wildcard "/*" route

function create_UUID(a, b) { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'); return b }

function check(socket, message) {
    function socketCheck(item) {
        if (item == message) {
        scoreMap.set(socket.uuid, scoreMap.get(socket.uuid) + 1);
        console.log("current score of " + socket.uuid + " " + scoreMap.get(socket.uuid));
        }
    }
    return socketCheck;
}

function shapeGen() {
var choice = getRandomInt(2) + 1;    

switch (choice){
  case 1:
    // Square that starts somewhere randomly
    var x = getRandomInt(200) + 1;
    var y = getRandomInt(200) + 1;

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
    return ["square", newList];
  
  case 2:
    // Triangle
    var x = getRandomInt(200) + 1;
    var y = getRandomInt(200) + 1;

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
    return ["triangle", newList];
}
}
const app = uWS.App().ws('/*', {  // handle messages from client

  open: (socket, req) => {
    socket.uuid = create_UUID();
    console.log("from creation: ", socket.uuid);
    scoreMap.set(socket.uuid, 0);
    
    /* For now we only have one canvas */
    if (flag == false) {
         setInterval(function(){shape = shapeGen(); app.publish("drawing/canvas1", shape[1], true); mainLinkedList.push(shape[0]); count++; console.log(count);}, 3000);
    }
    flag = true;
    socket.subscribe("drawing/canvas1");
  },
  message: (socket, message, isBinary) => {
    m = decoder.decode(message);
    /* In this simplified example we only have drawing commands */
    console.log("from message: ", m, socket.uuid);
    mainLinkedList.each(check(socket, m));
  }
});

// finally listen using the app on port 9001
app.listen(9001, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 9001');
  }
});
