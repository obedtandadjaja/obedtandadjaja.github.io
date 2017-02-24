var tubeGap = 75;
var tubeW = 30;
var map;
var bird;

function setup() {
  createCanvas(600, 600);

  map = new Map(3);
  map.generateTubes();

  bird = new Bird();
}

function draw() {
  background(0);
  bird.update();
  bird.show();
  map.moveTubes();
  map.tubes[0].hits(bird);
  map.tubes.forEach(function(tube) {
    tube.render();
  });
}

function Map(s) {
  this.speed = s;
  this.tubes = [];

  this.generateTubes = function() {
    var x = width;
    for(var i = 0; i < 10; i++) {
      var tube = new Tube(floor(random(1/3*height, 2/3*height)), tubeW, x);
      this.tubes.push(tube);
      x += tubeGap*3;
    }
  }

  this.moveTubes = function() {
    var firstTube = this.tubes[0];
    if(firstTube.x-s+firstTube.width <= 0) {
      this.tubes.push(this.tubes.shift());
      this.tubes[this.tubes.length-1].setRandomHeight();
      this.tubes[this.tubes.length-1].x = this.tubes[this.tubes.length-2].x+tubeGap*3;
      this.tubes[this.tubes.length-1].highlight = false;
    }
    this.tubes.forEach(function(tube, index) {
      tube.x -= s;
    });
  }
}

function Tube(h, w, x) {
  this.height = h;
  this.width = w;
  this.x = x;
  this.highlight = false;

  this.render = function() {
    noStroke();
    if(this.highlight) {
      fill(255, 0, 0);
    } else {
      fill(0, 255, 70);
    }
    rect(this.x, 0, this.width, this.height);
    rect(this.x, this.height+tubeGap*2, this.width, height);
  }

  this.setRandomHeight = function() {
    this.height = floor(random(1/4*height, 3/4*height));
  }

  this.hits = function(bird) {
    if(bird.x >= this.x-16 && bird.x <= this.x+tubeW-16) {
      if(bird.y >= this.height+16 && bird.y <= this.height+tubeGap*2-16) {
        this.highlight = false;
      } else {
        this.highlight = true;
        console.log("You lost mate");
      }
    }
  }
}

document.onkeydown = eventHandler;
function eventHandler(e) {
  bird.up();
}

function Bird(row, col) {
  this.y = height/2;
  this.x = 64;

  this.gravity = 0.6;
  this.lift = -15;
  this.velocity = 0;

  this.show = function() {
    fill(255);
    ellipse(this.x, this.y, 32, 32);
  }

  this.up = function() {
    this.velocity += this.lift;
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

  }
}
