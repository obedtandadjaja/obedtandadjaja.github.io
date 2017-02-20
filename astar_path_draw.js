// DFS

var cols, rows;
var w = 20;
var cells = [];
var currentCell;
var randomWall = 30*30/4;
var distance = 0;
var openSet = [];
var closedSet = [];
var cameFrom = {};
var gScore = {};
var fScore = {};

function setup() {
  createCanvas(600, 600);
  cols = floor(width/w);
  rows = floor(height/w);

  for(i = 0; i < rows; i++) {
    cells[i] = [];
    for(j = 0; j < cols; j++) {
      cells[i].push(new Cell(i, j));
      if(i === 0 || j === 0 || i === (rows-1) || j === (cols-1)) {
        cells[i][j].isWall = true;
      }
      gScore[cells[i][j]] = Number.MAX_VALUE;
      fScore[cells[i][j]] = Number.MAX_VALUE;
    }
  }

  // put in random walls
  for(i = 0; i < randomWall; i++) {
    var randomPositionRow = floor(random(0, rows));
    var randomPositionCol = floor(random(0, cols));
    while(cells[randomPositionRow][randomPositionCol].isWall === true) {
      randomPositionRow = floor(random(0, rows));
      randomPositionCol = floor(random(0, cols));
    }
    cells[randomPositionRow][randomPositionCol].isWall = true;
  }

  cells[0][0].isWall = false;
  cells[1][0].isWall = false;
  cells[0][1].isWall = false;
  cells[rows-1][cols-1].isWall = false;
  cells[rows-2][cols-1].isWall = false;
  cells[rows-1][cols-2].isWall = false;

  cells[0][0].distance = 0;
  openSet.push(cells[0][0]);
  cells[0][0].g = 0;
  cells[0][0].f = heuristic(cells[0][0], cells[rows-1][cols-1]);
}

function heuristic(a, b) {
  var d = dist(a.row, a.col, b.row, b.col);
  return d;
}

function findSmallest() {
  var lowest = Number.MAX_VALUE;
  var lowestIndex = -1;
  for(var i = 0; i < openSet.length-1; i++) {
    if(fScore[openSet[i]] < lowest) {
      lowest = Math.min(lowest, fScore[openSet[i]]);
      lowestIndex = i;
    }
  }
  return openSet[lowestIndex];
}

function draw() {
  background(200);

  if(openSet.length > 0) {
    var lowest = Number.MAX_VALUE;
    var lowestIndex = -1;
    for(var i = 0; i < openSet.length; i++) {
      if(openSet[i].f <= lowest) {
        lowest = Math.min(lowest, openSet[i].f);
        lowestIndex = i;
      }
    }
    currentCell = openSet[lowestIndex];
    if(currentCell === cells[rows-1][cols-1]) {
      drawPath();
      noLoop();
      return;
    }
    openSet.splice(lowestIndex, 1);
    closedSet.push(currentCell);
    var unvisitedNeighbors = currentCell.getUnvisitedNeighbor();
    for(var i = 0; i < unvisitedNeighbors.length; i++) {
      var neighbor = unvisitedNeighbors[i];
      if(closedSet.includes(neighbor)) {
        continue;
      }
      var tentative_gScore = currentCell.g+heuristic(currentCell, neighbor);
      var newPath = false;
      var newPath = false;
      if (openSet.includes(neighbor)) {
        if (tentative_gScore < neighbor.g) {
          neighbor.g = tentative_gScore;
          newPath = true;
        }
      } else {
        neighbor.g = tentative_gScore;
        newPath = true;
        openSet.push(neighbor);
      }
      if (newPath) {
        neighbor.h = heuristic(neighbor, cells[rows-1][cols-1]);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.prev = currentCell;
      }
    }
  } else {
    alert("Path not found");
    noLoop();
    return;
  }

  for(i = 0; i < cells.length; i++) {
    for(j = 0; j < cells[i].length; j++) {
      cells[i][j].show();
    }
  }
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].highlight2();
  }
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].highlight();
  }
}

function drawPath() {
  for(i = 0; i < cells.length; i++) {
    for(j = 0; j < cells[i].length; j++) {
      cells[i][j].show();
    }
  }
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].highlight2();
  }
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].highlight();
  }
  currentCell = cells[rows-1][cols-1];
  while(currentCell) {
    currentCell.highlight3();
    currentCell = currentCell.prev;
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
  this.isWall = false;
  this.distance = Number.MAX_VALUE;
  this.prev = undefined;
  this.g = Number.MAX_VALUE;
  this.f = Number.MAX_VALUE;

  this.getUnvisitedNeighbor = function() {
    var unvisitedNeighbors = [];
    var top = getCell(this.row-1, this.col);
    var topRight = getCell(this.row-1, this.col+1);
    var right = getCell(this.row, this.col+1);
    var bottomRight = getCell(this.row+1, this.col+1);
    var bottom = getCell(this.row+1, this.col);
    var bottomLeft = getCell(this.row+1, this.col-1);
    var left = getCell(this.row, this.col-1);
    var topLeft = getCell(this.row-1, this.col-1);

    if(top && top.visited === false && top.isWall === false) unvisitedNeighbors.push(top);
    if(topRight && topRight.visited === false && topRight.isWall === false) unvisitedNeighbors.push(topRight);
    if(topLeft && topLeft.visited === false && topLeft.isWall === false) unvisitedNeighbors.push(topLeft);
    if(right && right.visited === false && right.isWall === false) unvisitedNeighbors.push(right);
    if(bottom && bottom.visited === false && bottom.isWall === false) unvisitedNeighbors.push(bottom);
    if(bottomRight && bottomRight.visited === false && bottomRight.isWall === false) unvisitedNeighbors.push(bottomRight);
    if(bottomLeft && bottomLeft.visited === false && bottomLeft.isWall === false) unvisitedNeighbors.push(bottomLeft);
    if(left && left.visited === false && left.isWall === false) unvisitedNeighbors.push(left);

    return unvisitedNeighbors;
  };

  this.show = function() {
    var x = this.col*w;
    var y = this.row*w;
    stroke(255);

    if(this.isWall) {
      noStroke();
      fill(0, 0, 0);
      rect(x, y, w, w);
    } else if(this.visited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(x, y, w, w);
    }
  };

  this.highlight3 = function() {
    var x = this.col*w;
    var y = this.row*w;
    noStroke();
    fill(255, 0, 0);
    rect(x, y, w, w);
  }

  this.highlight2 = function() {
    var x = this.col*w;
    var y = this.row*w;
    noStroke();
    fill(255, 0, 255, 50);
    rect(x, y, w, w);
  }

  this.highlight = function() {
    var x = this.col*w;
    var y = this.row*w;
    noStroke();
    fill(0, 0, 255, 50);
    rect(x, y, w, w);
  };
}
