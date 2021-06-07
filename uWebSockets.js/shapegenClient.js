function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function shapeGen(shape = undefined) {
    var choice = getRandomInt(6) + 1;    
    var forRules = false;
    if (typeof shape == 'number') {
        choice = shape;
        forRules = true;
    }
    
    switch (choice){
      case 1:
        // Square that starts somewhere randomly
        var x = !forRules ? getRandomInt(215) + 255 : 550;
        var y = !forRules ? getRandomInt(40) + 50: 100;

        var line1 = new Uint16Array([x, y]);

        x = x + 50 - 25*(!forRules ? 0 : 1); 
        var line2 = new Uint16Array([x, y]);

        y = y + 50 - 25*(!forRules ? 0 : 1);
        var line3 = new Uint16Array([x, y]);

        x = x - 50 + 25*(!forRules ? 0 : 1);
        var line4 = new Uint16Array([x, y]);

        y = y - 50 + 25*(!forRules ? 0 : 1);
        var line5 = new Uint16Array([x, y]);

        var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5]);
        return ["s", newList];
      
      case 2:
        // Triangle
        var x = !forRules ? getRandomInt(215) + 255 : 575 + 5.5;
        var y = !forRules ? getRandomInt(40) + 50: 100;

        var line1 = new Uint16Array([x, y]);

        x = x + 50 - 25*(!forRules ? 0 : 1); 
        var line2 = new Uint16Array([x, y]);

        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        y = y + 50 - 25*(!forRules ? 0 : 1); 
        var line3 = new Uint16Array([x, y]);

        x = x - 25 + 12.5*(!forRules ? 0 : 1); 
        y = y - 50 + 25*(!forRules ? 0 : 1); 
        var line4 = new Uint16Array([x, y]);

        var line5 = new Uint16Array([x, y]);

        var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5]);
        return ["t", newList];
        
      case 3:
        // Octagon
        var x = !forRules ? getRandomInt(215) + 255 : 600 + 25;
        var y = !forRules ? getRandomInt(40) + 50: 90;

        var line1 = new Uint16Array([x, y]);
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        var line2 = new Uint16Array([x, y]);
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        y = y + 25 - 12.5*(!forRules ? 0 : 1);
        var line3 = new Uint16Array([x, y]);
        y = y + 25 - 12.5*(!forRules ? 0 : 1);
        var line4 = new Uint16Array([x, y]);
        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        y = y + 25 - 12.5*(!forRules ? 0 : 1);
        var line5 = new Uint16Array([x, y]);
        
        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        var line6 = new Uint16Array([x, y]);
        
        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        y = y - 25 + 12.5*(!forRules ? 0 : 1);
        var line7 = new Uint16Array([x, y]);

        y = y - 25 + 12.5*(!forRules ? 0 : 1);
        var line8 = new Uint16Array([x, y]);
        
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        y = y - 25 + 12.5*(!forRules ? 0 : 1);
        var line9 = new Uint16Array([x, y]);

        var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5,  ...line6,  ...line7,  ...line8,  ...line9,]);
        return ["o", newList];
        
      case 4:
        // Arrow
        var x = !forRules ? getRandomInt(215) + 255 : 650 + 7.5;
        var y = !forRules ? getRandomInt(40) + 50: 102;

        var line1 = new Uint16Array([x, y]);
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        var line2 = new Uint16Array([x, y]);

        y = y - 15 + 7.5*(!forRules ? 0 : 1);
        var line3 = new Uint16Array([x, y]);
        
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        y = y + 27.5 - 13.75*(!forRules ? 0 : 1);
        var line4 = new Uint16Array([x, y]);
        
        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        y = y + 27.5 - 13.75*(!forRules ? 0 : 1);
        var line5 = new Uint16Array([x, y]);
        
        y = y - 15 + 7.5*(!forRules ? 0 : 1);
        var line6 = new Uint16Array([x, y]);
        
        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        var line7 = new Uint16Array([x, y]);

        y = y - 25 + 12.5*(!forRules ? 0 : 1);
        var line8 = new Uint16Array([x, y]);

        var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5,  ...line6,  ...line7,  ...line8]);
        return ["a", newList];
        
      case 5:
        // Diamond
        var x = !forRules ? getRandomInt(215) + 255 : 563.5;
        var y = !forRules ? getRandomInt(40) + 50: 150;

        var line1 = new Uint16Array([x, y]);
        
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        y = y + 25 - 12.5*(!forRules ? 0 : 1);
        var line2 = new Uint16Array([x, y]);

        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        y = y + 25 - 12.5*(!forRules ? 0 : 1); 
        var line3 = new Uint16Array([x, y]);
        
        x = x - 25 + 12.5*(!forRules ? 0 : 1);
        y = y - 25 + 12.5*(!forRules ? 0 : 1);
        var line4 = new Uint16Array([x, y]);
        
        x = x + 25 - 12.5*(!forRules ? 0 : 1);
        y = y - 25 + 12.5*(!forRules ? 0 : 1);
        var line5 = new Uint16Array([x, y]);

        var newList = new Uint16Array([...line1, ...line2, ...line3, ...line4, ...line5]);
        return ["d", newList];
        
      case 6:
        // Circle
        var x = !forRules ? getRandomInt(215) + 255 : 594;
        var y = !forRules ? getRandomInt(40) + 50: 163;
        
        var line1 = new Uint16Array([x, y, 15, 0, 2 * Math.PI + 1]);
        //ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        return ["c", line1];
    }

}
