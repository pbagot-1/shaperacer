function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shapeGen(startX = undefined, startY = undefined) {
  var choice = getRandomInt(11) + 1;

  switch (choice) {
    case 1:
      // Square that starts somewhere randomly
      var x = startX ? startX : getRandomInt(620) + 50;
      var y = startY ? startY : getRandomInt(380) + 50;

      var line1 = new Uint16Array([x, y]);

      x = x + 50;
      var line2 = new Uint16Array([x, y]);

      y = y + 50;
      var line3 = new Uint16Array([x, y]);

      x = x - 50;
      var line4 = new Uint16Array([x, y]);

      y = y - 50;
      var line5 = new Uint16Array([x, y]);

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
      ]);
      return ["s", newList];

    case 2:
      // Triangle
      var x = startX ? startX : getRandomInt(620) + 50;
      var y = startY ? startY : getRandomInt(380) + 50;

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

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
      ]);
      return ["t", newList];

    case 3:
      // Octagon
      var x = startX ? startX : getRandomInt(620) + 50;
      var y = startY ? startY : getRandomInt(360) + 50;

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

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
        ...line6,
        ...line7,
        ...line8,
        ...line9,
      ]);
      return ["o", newList];

    case 4:
      // Arrow
      var x = startX ? startX : getRandomInt(620) + 50;
      var y = startY ? startY : getRandomInt(380) + 50;

      var line1 = new Uint16Array([x, y]);
      x = x + 25;
      var line2 = new Uint16Array([x, y]);

      y = y - 15;
      var line3 = new Uint16Array([x, y]);

      x = x + 25;
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

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
        ...line6,
        ...line7,
        ...line8,
      ]);
      return ["a", newList];

    case 5:
      // Diamond
      var x = startX ? startX : getRandomInt(620) + 50;
      var y = startY ? startY : getRandomInt(380) + 50;

      var line1 = new Uint16Array([x, y]);

      x = x + 25;
      y = y + 25;
      var line2 = new Uint16Array([x, y]);

      x = x - 25;
      y = y + 25;
      var line3 = new Uint16Array([x, y]);

      x = x - 25;
      y = y - 25;
      var line4 = new Uint16Array([x, y]);

      x = x + 25;
      y = y - 25;
      var line5 = new Uint16Array([x, y]);

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
      ]);
      return ["d", newList];

    case 6:
      // Circle
      var x = startX ? startX : getRandomInt(620) + 50;
      var y = startY ? startY : getRandomInt(380) + 50;

      var line1 = new Uint16Array([x, y, 50, 0, 2 * Math.PI + 1]);
      return ["c", line1];
    case 7:
      // Rectangle
      var x = startX ? startX : getRandomInt(620 - 2) + 1;
      var y = startY ? startY : getRandomInt(380) + 50;

      var line1 = new Uint16Array([x, y]);

      x = x + 100;
      var line2 = new Uint16Array([x, y]);

      y = y + 50;
      var line3 = new Uint16Array([x, y]);

      x = x - 100;
      var line4 = new Uint16Array([x, y]);

      y = y - 50;
      var line5 = new Uint16Array([x, y]);

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
      ]);
      return ["r", newList];
    case 8:
      // Hexagon
      var x = startX ? startX : getRandomInt(570) + 70;
      var y = startY ? startY : getRandomInt(350) + 25;

      var line1 = new Uint16Array([x, y]);

      x = x + 53;
      var line2 = new Uint16Array([x, y]);

      x = x + 28;
      y = y + 45;
      var line3 = new Uint16Array([x, y]);

      x = x - 28;
      y = y + 45;
      var line4 = new Uint16Array([x, y]);

      x = x - 53;
      var line5 = new Uint16Array([x, y]);

      x = x - 28;
      y = y - 45;
      var line6 = new Uint16Array([x, y]);

      x = x + 28;
      y = y - 45;
      var line7 = new Uint16Array([x, y]);

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
        ...line6,
        ...line7,
      ]);
      return ["h", newList];

    case 9:
      // Pentagon
      var x = startX ? startX : getRandomInt(570) + 80;
      var y = startY ? startY : getRandomInt(380) + 50;

      var newList = new Uint16Array([x, y]);
      return ["p", newList];

    case 10:
      // Kite
      var x = startX ? startX : getRandomInt(570) + 50;
      var y = startY ? startY : getRandomInt(380) + 50;

      var line1 = new Uint16Array([x, y]);

      x = x + 25;
      y = y - 25;
      var line2 = new Uint16Array([x, y]);

      x = x + 25;
      y = y + 25;
      var line3 = new Uint16Array([x, y]);

      x = x - 25;
      y = y + 50;
      var line4 = new Uint16Array([x, y]);

      x = x - 25;
      y = y - 50;
      var line5 = new Uint16Array([x, y]);

      var newList = new Uint16Array([
        ...line1,
        ...line2,
        ...line3,
        ...line4,
        ...line5,
      ]);
      return ["k", newList];

    case 11:
      // Ellipse
      var x = startX ? startX : getRandomInt(595) + 25;
      var y = startY ? startY : getRandomInt(380) + 50;
      var line1 = new Uint16Array([x, y, 65, 35, 0, 0, 2 * Math.PI + 1]);
      return ["e", line1];
  }
}

var exports = exports || {};
exports.shapeGen = shapeGen;
