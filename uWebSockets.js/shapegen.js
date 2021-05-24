function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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
var exports = exports || {};
exports.shapeGen = shapeGen;