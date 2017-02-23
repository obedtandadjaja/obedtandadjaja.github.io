var cols, rows;
var w = 14;
streams = [];
var symbolSize = 14;

function setup() {
  createCanvas(600, 600);
  cols = floor(width/w);
  rows = floor(height/w);

  var col = 0;
  for(var i = 0; i < cols; i++) {
    var stream = new Stream(col);
    streams.push(stream);
    stream.generateSymbols(floor(random(-1000, 0)));
    col += symbolSize;
  }

  textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  background(0);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function Stream(col) {
  this.symbols = [];
  this.totalSymbols = floor(random(10, 25));
  this.speed = floor(random(5, 25));
  this.col = col;

  this.generateSymbols = function(row) {
    var opacity = 30;
    var rand = floor(random(0, 5));
    for(var i = 0; i < this.totalSymbols; i++) {
      var symbol = new Symbol(row, this.col, this.speed, rand >= 3, opacity);
      symbol.value = String.fromCharCode(0x30A0 + round(random(0, 96)));
      this.symbols.push(symbol);
      row -= symbolSize;
      opacity += (255/this.totalSymbols);
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if(symbol.white) {
        fill(255, 255, 255, symbol.opacity);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
      text(symbol.value, symbol.col, symbol.row);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  }
}

function Symbol(row, col, speed, white, opacity) {
  this.row = row;
  this.col = col;
  this.speed = speed;
  this.white = white;
  this.opacity = opacity;
  this.value = undefined;
  this.changeInterval = floor(random(5, 10));

  this.setToRandomSymbol = function() {
    if (frameCount % this.changeInterval == 0) {
      var rand = round(random(0, 5));
      var rand2 = round(random(0, 5));
      if (rand > 2) {
        this.value = String.fromCharCode(0x30A0 + round(random(0, 96)));
      } else {
        this.value = round(random(0,9));
      }
      if(rand2 > 4) {
        this.white = true;
      } else {
        this.white = false;
      }
    }
  }

  this.rain = function() {
    this.row = this.row >= height ? 0 : this.row+this.speed;
  }
}
