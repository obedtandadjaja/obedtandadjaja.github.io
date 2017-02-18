// DFS

var cols, rows;
var w = 20;
var stack = [];
var cells = [];
var currentCell;

function setup() {
  createCanvas(600, 600);
  cols = floor(width/w);
  rows = floor(height/w);

  for(i = 0; i < rows; i++) {
    cells[i] = [];
    for(j = 0; j < cols; j++) {
      cells[i].push(new Cell(i, j));
    }
  }

  currentCell = cells[0][0];
}

function draw() {
  background(0);
  for(i = 0; i < cells.length; i++) {
    for(j = 0; j < cells[i].length; j++) {
      cells[i][j].show();
    }
  }

  currentCell.visited = true;
  currentCell.highlight();
  var next = currentCell.getUnvisitedNeighbor();
  if(next) {
    next.visited = true;
    stack.push(currentCell);
    removeWall(currentCell, next);
    currentCell = next;
  } else if(stack.length > 0) {
    currentCell = stack.pop();
  }
}

function removeWall(currentCell, next) {
  var x = currentCell.col-next.col;
  if(x === 1) {
    currentCell.walls[3] = false;
    next.walls[1] = false;
  } else if(x === -1) {
    currentCell.walls[1] = false;
    next.walls[3] = false;
  }
  var y = currentCell.row-next.row;
  if(y === 1) {
    currentCell.walls[0] = false;
    next.walls[2] = false;
  } else if(y === -1) {
    currentCell.walls[2] = false;
    next.walls[0] = false;
  }
}

function getCell(row, col) {
  if(row >= 0 && row < cells.length && col >= 0 && col < cells[0].length) {
    return cells[row][col];
  } else {
    return undefined;
  }
}

function Cell(row, col) {
  this.row = row;
  this.col = col;
  this.visited = false;
  this.walls = [true, true, true, true];

  this.getUnvisitedNeighbor = function() {
    var unvisitedNeighbors = [];
    var top = getCell(this.row-1, this.col);
    var right = getCell(this.row, this.col+1);
    var bottom = getCell(this.row+1, this.col);
    var left = getCell(this.row, this.col-1);

    if(top && top.visited === false) unvisitedNeighbors.push(top);
    if(right && right.visited === false) unvisitedNeighbors.push(right);
    if(bottom && bottom.visited === false) unvisitedNeighbors.push(bottom);
    if(left && left.visited === false) unvisitedNeighbors.push(left);

    if(unvisitedNeighbors.length > 0) {
      index = floor(random(0, unvisitedNeighbors.length));
      return unvisitedNeighbors[index];
    } else {
      return undefined;
    }
  };

  this.show = function() {
    var x = this.col*w;
    var y = this.row*w;
    stroke(255);
    if(this.walls[0]) {
      line(x, y, x + w, y);
    }
    if(this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if(this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if(this.walls[3]) {
      line(x, y + w, x, y);
    }

    if(this.visited) {
      noStroke();
      fill(0, 0, 0, 0);
    }
  };

  this.highlight = function() {
    var x = this.col*w;
    var y = this.row*w;
    noStroke();
    fill(0, 0, 255, 100);
    rect(x, y, w, w);
  };
}
