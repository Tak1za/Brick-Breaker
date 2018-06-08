var canvas;
var canvasContext;

var ballX = 400;
var ballY = 400;
var radius = 10;

var ballSpeedX = 20;
var ballSpeedY = 4;
var paddleX = 200;

const PADDLE_THICKNESS = 10;
const PADDLE_WIDTH = 150;

const BRICK_H = 20;
const BRICK_W = 80;
const BRICK_GAP = 2;
const BRICK_ROWS = 14;
const BRICK_COLS = 10;

var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);

function calculateMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  // Moving all movable objects
  var fps = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / fps);
  canvas.addEventListener("mousemove", function(event) {
    var mousePos = calculateMousePosition(event);
    paddleX = mousePos.x - PADDLE_WIDTH / 2;
  });
  resetBricks();
};

function ballReset() {
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function moveEverything() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX > canvas.width) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballX < radius) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY < radius) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height - 2 * PADDLE_THICKNESS) {
    if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
      ballSpeedY = -ballSpeedY;
      var deltaX = ballX - (paddleX + PADDLE_WIDTH / 2);
      ballSpeedX = deltaX * 0.35;
    } else {
      ballReset();
    }
  }

  breakAndBounceOffBrickAtPixelCoord(ballX, ballY);
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawBricks() {
  var selectColor = ["blue", "green"];
  var i = 0;
  for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
    i++;
    if (i > 1) {
      i = 0;
    }
    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      if (isBrickAtTileCoord(eachCol, eachRow)) {
        var brickLeftEdgeX = eachCol * BRICK_W;
        var brickTopEdgeY = eachRow * BRICK_H;
        colorRect(
          brickLeftEdgeX,
          brickTopEdgeY,
          BRICK_W - BRICK_GAP,
          BRICK_H - BRICK_GAP,
          selectColor[i]
        );
      }
    }
  }
}

function resetBricks() {
  for (var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = 1;
  }
}

function isBrickAtTileCoord(brickTileCol, brickTileRow) {
  var brickIndex = brickTileCol + BRICK_COLS * brickTileRow;
  return brickGrid[brickIndex] == 1;
}

function breakAndBounceOffBrickAtPixelCoord(pixelX, pixelY) {
  var tileCol = Math.floor(pixelX / BRICK_W);
  var tileRow = Math.floor(pixelY / BRICK_H);

  if (
    tileCol < 0 ||
    tileCol >= BRICK_COLS ||
    tileRow < 0 ||
    tileRow >= BRICK_ROWS
  ) {
    return false;
  }

  var brickIndex = brickTileToIndex(tileCol, tileRow);

  if (brickGrid[brickIndex] == 1) {
    var prevBallX = ballX - ballSpeedX;
    var prevBallY = ballY - ballSpeedY;
    var prevTileCol = Math.floor(prevBallX / BRICK_W);
    var prevTileRow = Math.floor(prevBallY / BRICK_H);

    var bothTestsFailed = true;

    if (prevTileCol != tileCol) {
      var adjacentBrickIndex = brickTileToIndex(prevTileCol, tileRow);
      if (brickGrid[adjacentBrickIndex] != 1) {
        ballSpeedX = -ballSpeedX;
        bothTestsFailed = false;
      }
    }

    if (prevTileRow != tileRow) {
      var adjacentBrickIndex = brickTileToIndex(tileCol, prevTileRow);
      if (brickGrid[adjacentBrickIndex] != 1) {
        ballSpeedY = -ballSpeedY;
        bothTestsFailed = false;
      }
    }

    if (bothTestsFailed) {
      ballSpeedX = -ballSpeedX;
      ballSpeedY = -ballSpeedY;
    }

    brickGrid[brickIndex] = 0;
  }
}

function brickTileToIndex(tileCol, tileRow) {
  return tileCol + BRICK_COLS * tileRow;
}

function drawEverything() {
  //Create the black background
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Create a white ball
  canvasContext.fillStyle = "white";
  canvasContext.beginPath();
  canvasContext.arc(ballX, ballY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();

  // Create a paddle
  canvasContext.fillRect(
    paddleX,
    canvas.height - 2 * PADDLE_THICKNESS,
    PADDLE_WIDTH,
    PADDLE_THICKNESS
  );

  //Create bricks
  drawBricks();
}
