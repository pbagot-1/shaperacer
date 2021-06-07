let canvas, canvas2, ctx, ctx2, flag, searching = false, prevX = 0, currX = 0, prevY = 0, currY = 0, ws, drawShape;
let versionString = "Version 1.0.0";
let new_lines = [];
let count = 0;
let inGame = false;
const decoder = new TextDecoder();
import {shapeGen} from "./shapegenClient.js";
let firstSetup = true;

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function main() {
    /* Connect to the server */
    ws = new WebSocket('ws://localhost:9001');
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        setInterval(ws.send('ping'), 50000);
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
            ctx2.clearRect(0,0,720,480);
            var scoreList = msgObj[1];
            ctx2.font = '25px Trebuchet MS';
            ctx2.fillStyle = "rgba(0,0,0,1)";
            var scoreBoardStr = "Scoreboard";
            var curHeight = 35;
            ctx2.fillText(scoreBoardStr , 500, curHeight);
            ctx2.font = '15px Trebuchet MS';
            ctx2.fillText(versionString, 5, 472.5);
            scoreList.forEach(renderScoreBoard);
            
            function renderScoreBoard(element, index, arr) {
                curHeight += 30;
                scoreBoardStr = element[0] + ': ' + element[1];
                ctx2.fillText(scoreBoardStr , 500, curHeight);
            }
            break;
        case "GAME START":
            ctx.strokeStyle = 'black';
            document.getElementById("nameInput").style.display='none';
            removeAllChildNodes(document.getElementById('renderList'));
            document.getElementById("renderList").style.display='block';
            searching = false;
            console.log('what it is', clearMainScreenHold);
            clearInterval(genMainScreenHold);
            clearInterval(clearMainScreenHold);
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
                            document.getElementById("gameInput").style.display='block';
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
                    ctx.fillStyle = "rgba(255,255,255,0.7)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    if (inGame) {
                    setTimeout(fadeOut,125); }
                }
                fadeOut();
                clearInterval(foundAlert);  
            }, 2000);            
            break;
            
        case "GAME OVER":
            inGame = false;
            ctx.fillStyle = "rgba(0,0,0)";
            ctx.lineWidth = 2;
            ctx.font = '15px Trebuchet MS';
            var textString = msgObj[1] + " WINS";
            var textWidth = ctx.measureText(textString).width;
            ctx.fillText(textString , (canvas.width / 2) - (textWidth / 2), 200);
            
            setTimeout(setupHome, 3000);
            setTimeout(() => {ctx2.clearRect(0,0,720,480);ctx2.font = '15px Trebuchet MS';ctx2.fillText(versionString, 5, 472.5);}, 3000);
            break;
            
        case "PLAYERS ONLINE":
            if (!inGame) {
                ctx.fillStyle = "rgba(255,255,255)";
                ctx.fillRect(600, 460, 720, 480);
                ctx.fillStyle = "rgba(0,0,0)";
                ctx.lineWidth = 2;
                ctx.font = '15px Trebuchet MS';
                var textString = "Players online: " + msgObj[1].toString();
                ctx.fillText(textString, 600, 472.5);
            }
            break;
        }
    };
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    canvas2 = document.getElementById('can2');
    ctx2 = canvas2.getContext("2d");
    
    ctx2.fillStyle = "rgba(0,0,0)";
    ctx2.font = '15px Trebuchet MS';
    ctx2.fillText(versionString, 5, 472.5);
    
    var genMainScreenHold;
    var clearMainScreenHold;
function setupHome() {
    document.getElementById("gameInput").style.display='none';
    var rulesShown = false;
    drawShape = function drawShape(shape = undefined) 
        {
        ctx.strokeStyle = 'black';
        for (var i=0; i<3; i++) {
        if (!shape) {
            var tempShape = shapeGen()[1];
        }
        else {
            var tempShape = shapeGen(shape)[1];
        }
        drawSpecificShape(tempShape);
        }
        }
        
    function drawSpecificShape(tempShape) {
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
    // Start generating the shapes on main screen
    var genMainScreen = setInterval(drawShape
    , 3000);
    genMainScreenHold = genMainScreen;
    
    var clearMainScreen = setInterval(function() {
        
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillRect(200, 0, 322, 170);
        }, 125
    );
    clearMainScreenHold = clearMainScreen;
    
    if (!firstSetup) {
        document.getElementById("nameInput").style.display='block';
        document.getElementById("renderList").style.display='none';
    }
    
    ctx.fillStyle = "rgba(255,255,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    var w = canvas.width;
    var h = canvas.height;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.font = '30px Trebuchet MS';
    
    var textString = "Shape Racer";
    var textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString , (canvas.width / 2) - (textWidth / 2), 200);
    var initialx = (canvas.width / 2) - (textWidth / 2) - 10;
    var forClearing = initialx + 50 + 10 + textWidth + 10;
    console.log("FC", forClearing);
    ctx.beginPath();
    ctx.moveTo(initialx, 190);
    ctx.lineTo(initialx - 50, 190);
    ctx.lineTo(initialx - 50, 190+200);
    ctx.lineTo(initialx + 50 + 10 + textWidth + 10, 190+200);
    ctx.lineTo(initialx + 50 + 10 + textWidth + 10, 190);
    ctx.lineTo(initialx + 10 + textWidth + 10, 190);
    ctx.stroke();
    
    var playTextWidth;
    var playTextHeight;
    //Draw play button
   function drawPlay() {
    ctx.fillStyle = "rgba(0,0,0, 1)";
    var textString = "Play";
    ctx.font = '20px Trebuchet MS';
    playTextWidth = ctx.measureText(textString).width;
    var metrics = ctx.measureText(textString);
    playTextHeight = (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0);
    ctx.fillText(textString , (canvas.width / 2) - (playTextWidth / 2), 250);
   }
   drawPlay();
    
    var rulesTextWidth;
    var rulesTextHeight;
    //Draw rules button
    function drawRules() {
        ctx.fillStyle = "rgba(0,0,0, 1)";
        var textString = "Rules";
        ctx.font = '20px Trebuchet MS';
        rulesTextWidth = ctx.measureText(textString).width;
        var metrics = ctx.measureText(textString);
        rulesTextHeight = (metrics.actualBoundingBoxAscent||0) + (metrics.actualBoundingBoxDescent||0);
        ctx.fillText(textString , (canvas.width / 2) - (rulesTextWidth / 2), 350);
    }
    drawRules();

    //Make constants for drawing around the buttons
    var inPlay = false;
    var inRules = false;
    const TLx = (canvas.width / 2) - (playTextWidth / 2) - 10 - 10;
    const TLy = 250 - playTextHeight - 10;
    const TRx = (canvas.width / 2) + (playTextWidth / 2) + 10 + 10;
    const TRy = 250 - playTextHeight - 10;
    const BLx = (canvas.width / 2) - (playTextWidth / 2) - 10 - 10;
    const BLy = 250 + 10;
    const BRx = (canvas.width / 2) + (playTextWidth / 2) + 10 + 10;
    const BRy = 250 + 10;
    
    const rTLx = (canvas.width / 2) - (rulesTextWidth / 2) - 10 - 10;
    const rTLy = 350 - rulesTextHeight - 10;
    const rTRx = (canvas.width / 2) + (rulesTextWidth / 2) + 10 + 10;
    const rTRy = 350 - rulesTextHeight - 10;
    const rBLx = (canvas.width / 2) - (rulesTextWidth / 2) - 10 - 10;
    const rBLy = 350 + 10;
    const rBRx = (canvas.width / 2) + (rulesTextWidth / 2) + 10 + 10;
    const rBRy = 350 + 10;
    
    var playDiv = document.getElementById("playDiv");

    playDiv.addEventListener('mouseover', changePlayOver);
    playDiv.addEventListener('mouseout', changePlayOut);
    playDiv.addEventListener('mousedown', playDown);
    
    function playDown(){        
        ws.send(JSON.stringify(['play', document.getElementById('nameInput').value]));
        if (searching == false && inGame == false) {
            searching = true;
            startSearchingLoop();
        }
    };

    function changePlayOver(e) {
        if (inGame == false) {
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
    }

    function changePlayOut(e) {
        if (inGame == false) {
        ctx.fillStyle = "rgba(255,255,255, 1)";         
        ctx.fillRect(304, 213, 416-304, 263-213);
        drawPlay();
        }
    }
    
    var rulesDiv = document.getElementById("rulesDiv");

    rulesDiv.addEventListener('mouseover', changeRulesOver);
    rulesDiv.addEventListener('mouseout', changeRulesOut);
    rulesDiv.addEventListener('mousedown', rulesDown);
    
    function rulesDown() {
        if (inGame == false && rulesShown == false) {
            displayRules();
        }
        else if (inGame == false && rulesShown == true) {
            clearRules();
        }
    }
    function changeRulesOver(e) {
        if (inGame == false) {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(rTLx, rTLy);
            ctx.lineTo(rTLx + 10, rTLy);
            ctx.moveTo(rTLx, rTLy);
            ctx.lineTo(rTLx, rTLy + 10);
            
            ctx.moveTo(rTRx, rTRy);
            ctx.lineTo(rTRx - 10, rTRy);
            ctx.moveTo(rTRx, rTRy);
            ctx.lineTo(rTRx, rTRy + 10);
            
            ctx.moveTo(rBLx, rBLy);
            ctx.lineTo(rBLx + 10, rBLy);
            ctx.moveTo(rBLx, rBLy);
            ctx.lineTo(rBLx, rBLy - 10);
            
            ctx.moveTo(rBRx, rBRy);
            ctx.lineTo(rBRx - 10, rBRy);
            ctx.moveTo(rBRx, rBRy);
            ctx.lineTo(rBRx, rBRy - 10);                                
            ctx.stroke();  
        }            
    }

    function changeRulesOut(e) {
        if (inGame == false) {
        ctx.fillStyle = "rgba(255,255,255, 1)"; 
        ctx.fillRect(304, 321, 416-304, 366-321);
        drawRules();
        }
    }

    /*canvas.addEventListener("mousemove", function tide (e) {
        currX = e.clientX / window.innerWidth * 720;
        currY = e.clientY / window.innerHeight * 480;
        console.log("x", currX);
        console.log("y", currY);
        if ((currX >= ((canvas.width / 2) - (playTextWidth / 2))) && (currX <= ((canvas.width / 2) + (playTextWidth / 2))) && (currY <= 250) && (currY >= (250 - playTextHeight))) {
            console.log("IN PLAY");
                //console.log("TRIGGERED");
                if (!inPlay) {
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
                 inPlay = true;
                }
           
        }  
        else if ((currX >= ((canvas.width / 2) - (rulesTextWidth / 2))) && (currX <= ((canvas.width / 2) + (rulesTextWidth / 2))) && (currY <= 350) && (currY >= (350 - rulesTextHeight))) {
            console.log("IN RULES");
            if (inRules == false) {
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(rTLx, rTLy);
                ctx.lineTo(rTLx + 10, rTLy);
                ctx.moveTo(rTLx, rTLy);
                ctx.lineTo(rTLx, rTLy + 10);
                
                ctx.moveTo(rTRx, rTRy);
                ctx.lineTo(rTRx - 10, rTRy);
                ctx.moveTo(rTRx, rTRy);
                ctx.lineTo(rTRx, rTRy + 10);
                
                ctx.moveTo(rBLx, rBLy);
                ctx.lineTo(rBLx + 10, rBLy);
                ctx.moveTo(rBLx, rBLy);
                ctx.lineTo(rBLx, rBLy - 10);
                
                ctx.moveTo(rBRx, rBRy);
                ctx.lineTo(rBRx - 10, rBRy);
                ctx.moveTo(rBRx, rBRy);
                ctx.lineTo(rBRx, rBRy - 10);                                
                ctx.stroke();   
            }
            inRules = true;
            
        } else {
            console.log("IN GENERAL");

                //inPlay = false;
                //ctx.fillStyle = "rgba(255,255,255, 1)";         
                //ctx.fillRect(304, 213, 416-304, 263-213);
                //drawPlay();

                //ctx.fillStyle = "rgba(0,0,0, 1)";
                //drawPlay();
            else if (inRules && !inGame) {
                ctx.fillStyle = "rgba(255,255,255, 1)"; 
                ctx.fillRect(304, 321, 416-304, 366-321);
                drawRules();
                inRules = false;
            }      
        }
    }, false);*/
    
    searching = false;
    var searchIt = 0;
    function startSearchingLoop() {
        //first clear old
        ctx.fillStyle = "rgba(255,255,255, 1)";
        ctx.fillRect(0, 400, 590, 720);
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
    
    function displayRules() {
        rulesShown = true;
        ctx.font = '15px Trebuchet MS';
        ctx.fillStyle = "rgba(0,0,0, 1)";
        var ruleString1 = "For every shape that";
        var ruleString2 = "appears on the screen, you";
        var ruleString3 = "have 3 seconds to type the";
        var ruleString4 = "first letter of the shape and";
        var ruleString5 = "hit enter. Each shape gives";
        var ruleString6 =  "you one point. First to 100";
        var ruleString7 = "wins.";
        ctx.fillText(ruleString1 , 10, 80);
        ctx.fillText(ruleString2 , 10, 110);
        ctx.fillText(ruleString3 , 10, 140);
        ctx.fillText(ruleString4 , 10, 170);
        ctx.fillText(ruleString5 , 10, 200);    
        ctx.fillText(ruleString6 , 10, 230);  
        ctx.fillText(ruleString7 , 10, 260);      

        var shapeGuide = "Shape Guide";
        ctx.fillText(shapeGuide , forClearing + 70, 80);
        drawSpecificShape(shapeGen(1)[1]);
        drawSpecificShape(shapeGen(2)[1]);
        drawSpecificShape(shapeGen(3)[1]);
        drawSpecificShape(shapeGen(4)[1]);
        ctx.fillText("  s     t      o      a" , 550, 142);
        drawSpecificShape(shapeGen(5)[1]);
        drawSpecificShape(shapeGen(6)[1]);
        ctx.fillText("  d" , 549, 192);
        ctx.fillText("        c" , 550, 192);
        
        
        ctx.fillText("... More to come!" , 550, 250);
    }
    
    function clearRules() {
        ctx.fillStyle = "rgba(255,255,255, 1)";
        ctx.fillRect(0, 0, initialx - 50 - 5,  canvas.height);
        ctx.fillRect(forClearing+5, 0, canvas.width, canvas.height);
        rulesShown = false;
    }
    
    canvas.addEventListener("mousedown", function (e) {
    
        currX = e.clientX / window.innerWidth * 720;
        currY = e.clientY / window.innerHeight * 480;
        console.log(currX);
        console.log(currY);
        
        if ((currX >= ((canvas.width / 2) - (playTextWidth / 2))) && (currX <= ((canvas.width / 2) + (playTextWidth / 2))) && (currY <= 250) && (currY >= (250 - playTextHeight))) {
        ws.send(JSON.stringify(['play', document.getElementById('nameInput').value]));
        if (searching == false && inGame == false) {
            searching = true;
            startSearchingLoop();
        }
        }
        
        if ((currX >= ((canvas.width / 2) - (rulesTextWidth / 2))) && (currX <= ((canvas.width / 2) + (rulesTextWidth / 2))) && (currY <= 350) && (currY >= (350 - rulesTextHeight))) {
        if (inGame == false && rulesShown == false) {
            displayRules();
        }
        else if (inGame == false && rulesShown == true) {
            clearRules();
        }
        }  
    }, false);              
   
    const input = document.getElementById('gameInput');
    input.addEventListener("keydown", updateValue);

    function updateValue(e) {
      if (e.keyCode == 13) {
        ws.send(JSON.stringify([e.target.value]));
        e.target.value = '';
      }
    }
    }
    if (firstSetup) {
    setupHome();
    firstSetup = false;
    }

}
main();