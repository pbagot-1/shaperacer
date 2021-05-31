let canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0, ws;
let new_lines = [];
let count = 0;
let inGame = false;
const decoder = new TextDecoder();
import {shapeGen} from "./shapegenClient.js";

function main() {
    /* Connect to the server */
    ws = new WebSocket('ws://localhost:9001');
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        /* Join the "room" of canvas 1 */
    };

    /* For every message we receive */
    ws.onmessage = (message) => {
        console.log("MESSAGE", message);
        var msgObj = JSON.parse(message.data);
        switch (msgObj[0]) {
        /* Request a new animation frame on first draw */
        case "drawing":
            if (new_lines.length == 0) {
                window.requestAnimationFrame(() => {
                    //console.log(new_lines.length);

                    new_lines.forEach((li) => {
                        ctx.beginPath();
                    
                        if (li.length == 5) {
                        ctx.arc(li[0], li[1], li[2], li[3], li[4]);
                        } 
                        else {
                        ctx.moveTo(li[0], li[1]);
                        //console.log(li[0], li[1]);
                        var length = li.length - 2;
                        
                        var x = 2;
                        var y = 3;
                            while (length >= 0) {
                            ctx.lineTo(li[x], li[y]);
                            //console.log(li[x], li[y]);
                            length = length - 2;
                            x += 2;
                            y += 2;
                            };
                        }
                            
                        ctx.stroke();
                        count++;
                        //console.log(count);
                        //console.log("STROKED");
                        });
                    new_lines = [];
                    });

                    
                
                    
                }
            /* Add this draw to the pending buffer */
            var f = new Uint16Array(Object.values(msgObj[1]));
            //console.log("AA", f);
            new_lines.push(f);
            //console.log("added");
            break;
        case "scoreboard":
            var d = function(){
                var ul = document.createElement('ul');
                ul.setAttribute('id','proList');
                ul.style['list-style-type'] = 'none';
                ul.style['transform'] = 'scale(1,.5)';
                var t, tt;
                var productList = msgObj[1];
                
                function removeAllChildNodes(parent) {
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                }
                removeAllChildNodes(document.getElementById('renderList'));
                document.getElementById('renderList').appendChild(ul);
                var li = document.createElement('li');
                li.setAttribute('class','item');
                
                ul.appendChild(li);
                
                var scoreboard = document.createElement('span');
                scoreboard.style["color"] = "black";
                scoreboard.style['font'] = "40px Trebuchet MS";
                li.appendChild(scoreboard);
                scoreboard.innerHTML='Scoreboard';
                
                
                productList.forEach(renderProductList);
                    
                
                function renderProductList(element, index, arr) {
                    var li = document.createElement('li');
                    li.setAttribute('class','item');
                    
                    ul.appendChild(li);
                    var mostRecent = "black";
                    
                    for (let i = 0; i < element[0].length; i++) {
                      var span = document.createElement('span');
                      if (element[0][i] == '^') {
                        if (i < (element[0].length - 1)) {
                            if (element[0][i+1] == '0') {
                                mostRecent = "black";
                                i = i + 2;
                            }
                            if (element[0][i+1] == '1') {
                                mostRecent = "red";
                                i = i + 2;
                            }
                            if (element[0][i+1] == '2') {
                                mostRecent = "green";
                                i = i + 2;
                            }
                            if (element[0][i+1] == '3') {
                                mostRecent = "yellow";
                                i = i + 2;
                            }
                            if (element[0][i+1] == '4') {
                                mostRecent = "blue";
                                i = i + 2;
                            }
                            if (element[0][i+1] == '5') {
                                mostRecent = "cyan";
                                i = i + 2;
                            }
                            if (element[0][i+1] == '6') {
                                mostRecent = "magenta";
                                i = i + 2;
                            }   
                            if (element[0][i+1] == '7') {
                                mostRecent = "white";
                                i = i + 2;
                            }           
                            if (element[0][i+1] == '8') {
                                mostRecent = "orange";
                                i = i + 2;
                            }  
                        }
                      }
                      span.style["color"] = mostRecent;
                      span.style['font'] = "40px Trebuchet MS";
                      span.innerHTML=span.innerHTML + element[0][i];
                      li.appendChild(span);
                    }
                    
                    var span2 = document.createElement('span');
                    span2.style["color"] = "black";
                    span2.style['font'] = "40px Trebuchet MS";
                    li.appendChild(span2);
                    span2.innerHTML=span2.innerHTML + ' ' + element[1];
                    //li.innerHTML=li.innerHTML + element;
                }
            };
            d();
            //console.log('CALLED');
            break;
        case "GAME START":
            document.getElementById("nameInput").style.display='none';
            searching = false;
            clearInterval(genMainScreen);
            clearInterval(clearMainScreen);
            inGame = true;
            
            ctx.strokeStyle = 'black';
            var num = 3;  
            ctx.font = "80px Trebuchet MS";
            var textWidth = ctx.measureText("Game found!").width;
            ctx.strokeText("Game found!" , (canvas.width / 2) - (textWidth / 2), 150);
            
            var foundAlert = setInterval(function() {
                ctx.font = "120px Trebuchet MS";

                    var x = setInterval(function() {
                        if (num == 0) {
                            clearInterval(x);
                            document.getElementById("gameInput").focus();
                            return;
                        }
                        ctx.font = "120px Trebuchet MS";
                        ctx.strokeText(num.toString(),320,200);
                        // Output the result in an element with id="demo"
                        num--;
                        // If the count down is over, write some text 
                    }, 1000);                

                function fadeOut() {
                    ctx.fillStyle = "rgba(255,255,255,0.3)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    if (inGame) {
                    setTimeout(fadeOut,50); }
                }
                fadeOut();
                clearInterval(foundAlert);  
            }, 2000);            
            break;
            
        case "GAME OVER":
            inGame = false;
            ctx.fillStyle = "rgba(0,0,0)";
            ctx.lineWidth = 2;
            ctx.font = '30px Trebuchet MS';
            var textString = msgObj[1] + " WINS";
            var textWidth = ctx.measureText(textString).width;
            ctx.fillText(textString , (canvas.width / 2) - (textWidth / 2), 200);
            break;
        }
    };

    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.font = '30px Trebuchet MS';
    
    var textString = "Shape Racer";
    var textWidth = ctx.measureText(textString).width;
    //console.log("TEXT WIDTH", textWidth);
    ctx.fillText(textString , (canvas.width / 2) - (textWidth / 2), 200);
    var initialx = (canvas.width / 2) - (textWidth / 2) - 10;
    ctx.beginPath();
    ctx.moveTo(initialx, 190);
    ctx.lineTo(initialx - 50, 190);
    ctx.lineTo(initialx - 50, 190+200);
    ctx.lineTo(initialx + 50 + 10 + textWidth + 10, 190+200);
    ctx.lineTo(initialx + 50 + 10 + textWidth + 10, 190);
    ctx.lineTo(initialx + 10 + textWidth + 10, 190);
    ctx.stroke();
    
    var textString = "Play";
    ctx.font = '20px Trebuchet MS';
   
    textWidth = ctx.measureText(textString).width;
    var metrics = ctx.measureText(textString);
    var textHeight = (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0);
    //console.log("TEXT WIDTH", textWidth);
    ctx.fillText(textString , (canvas.width / 2) - (textWidth / 2), 250);
    ctx.stroke();

    var inTheThing = false;
    const TLx = (canvas.width / 2) - (textWidth / 2) - 10 - 10;
    const TLy = 250 - textHeight - 10;
    const TRx = (canvas.width / 2) + (textWidth / 2) + 10 + 10;
    const TRy = 250 - textHeight - 10;
    const BLx = (canvas.width / 2) - (textWidth / 2) - 10 - 10;
    const BLy = 250 + 10;
    const BRx = (canvas.width / 2) + (textWidth / 2) + 10 + 10;
    const BRy = 250 + 10;
    canvas.addEventListener("mousemove", function (e) {
    
        currX = e.clientX / window.innerWidth * 720;
        currY = e.clientY / window.innerHeight * 480;
        //console.log(currX);
        //console.log(currY);
        //&& (currX <= ((canvas.width / 2) + (textWidth / 2))) && (currY >= 300) && (currY <= (300 + textHeight)))
        /*if ((currX >= ((canvas.width / 2) - (textWidth / 2))) && (currX <= ((canvas.width / 2) + (textWidth / 2))) && (currY <= 250) && (currY >= (250 - textHeight))) {
            if (inTheThing == false) {
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(TLx, TLy);
                ctx.lineTo(TLx + 10, TLy);
                ctx.moveTo(TLx, TLy);
                ctx.lineTo(TLx, TLy + 10);
                
                ctx.moveTo(TRx, TRy);
                ctx.lineTo(TRx - 10, TRy);
                ctx.moveTo(TRx, TRy);
                ctx.lineTo(TRx, TRy + 10);
                
                ctx.moveTo(BLx, BLy);
                ctx.lineTo(BLx + 10, BLy);
                ctx.moveTo(BLx, BLy);
                ctx.lineTo(BLx, BLy - 10);
                
                ctx.moveTo(BRx, BRy);
                ctx.lineTo(BRx - 10, BRy);
                ctx.moveTo(BRx, BRy);
                ctx.lineTo(BRx, BRy - 10);                                
                ctx.stroke();
            }
            inTheThing = true;
        } else {
            if (inTheThing && !inGame) {
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            var j = 0;
            var i = setInterval( function() { 
                ctx.beginPath();
                ctx.moveTo(TLx, TLy);
                ctx.lineTo(TLx + 10, TLy);
                ctx.moveTo(TLx, TLy);
                ctx.lineTo(TLx, TLy + 10);
                
                ctx.moveTo(TRx, TRy);
                ctx.lineTo(TRx - 10, TRy);
                ctx.moveTo(TRx, TRy);
                ctx.lineTo(TRx, TRy + 10);
                
                ctx.moveTo(BLx, BLy);
                ctx.lineTo(BLx + 10, BLy);
                ctx.moveTo(BLx, BLy);
                ctx.lineTo(BLx, BLy - 10);
                
                ctx.moveTo(BRx, BRy);
                ctx.lineTo(BRx - 10, BRy);
                ctx.moveTo(BRx, BRy);
                ctx.lineTo(BRx, BRy - 10);                                
                ctx.stroke();       
            j++;
            if (j > 100) {clearInterval(i);}
            
            }, 50);  
            inTheThing = false;
            }                            
        }*/
    }, false);
    
    var searching = false;
    var searchIt = 0;
    function startSearchingLoop() {
        //first clear old
        ctx.fillStyle = "rgba(255,255,255, 1)";
        ctx.fillRect(0, 400, canvas.width, 720);
        if (searching) {
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = '30px Trebuchet MS';
        if (searchIt == 0) {
        var textString = "Searching . . .";
        }
        
        if (searchIt == 1) {
        var textString = "Searching . .";
        }
        
        if (searchIt == 2) {
        var textString = "Searching .";
        }
        
        var textWidth = ctx.measureText("Searching . . .").width;
        ctx.fillText(textString , (canvas.width / 2) - (textWidth / 2), 450);
        setTimeout(startSearchingLoop, 1000);
        
        searchIt = ((searchIt + 1) % 3);
        }
    }
    
    canvas.addEventListener("mousedown", function (e) {
    
        currX = e.clientX / window.innerWidth * 720;
        currY = e.clientY / window.innerHeight * 480;
        console.log(currX);
        console.log(currY);
        //&& (currX <= ((canvas.width / 2) + (textWidth / 2))) && (currY >= 300) && (currY <= (300 + textHeight)))
        if ((currX >= ((canvas.width / 2) - (textWidth / 2))) && (currX <= ((canvas.width / 2) + (textWidth / 2))) && (currY <= 250) && (currY >= (250 - textHeight))) {
        console.log("sweet spot");
        ws.send(JSON.stringify(['play', document.getElementById('nameInput').value]));
        if (searching == false and inGame == false) {
            searching = true;
            startSearchingLoop();
        }
        }
        
        
    }, false);              
   
    const input = document.getElementById('gameInput');
    input.addEventListener("keyup", updateValue);

    function updateValue(e) {
      if (e.keyCode == 13) {
        ws.send(JSON.stringify([e.target.value]));
        e.target.value = '';
      }
      
    }
      
    // Start generating the shapes on main screen
    var genMainScreen = setInterval(function() 
        {
        for (var i=0; i<3; i++) {
        var tempShape = shapeGen()[1]; 
        ctx.beginPath();
    
        if (tempShape.length == 5) {
        ctx.arc(tempShape[0], tempShape[1], tempShape[2], tempShape[3], tempShape[4]);
        } 
        else {
        ctx.moveTo(tempShape[0], tempShape[1]);
        var length = tempShape.length - 2;
        
        var x = 2;
        var y = 3;
            while (length >= 0) {
            ctx.lineTo(tempShape[x], tempShape[y]);
            length = length - 2;
            x += 2;
            y += 2;
            };
        }
            
        ctx.stroke();
        }
        }
    , 3000);
    
    var clearMainScreen = setInterval(function() {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(0, 0, canvas.width, 170);
        }, 50
    );
    
}
main();