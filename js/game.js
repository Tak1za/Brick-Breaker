var canvas;
var canvasContext;

var ballX = 10;
var ballY = 50;
var radius = 10;

var ballSpeedX = 20;
var ballSpeedY = 4;
var paddleX = 400;

const PADDLE_THICKNESS = 10;
const PADDLE_WIDTH = 150;

const BRICK_H=20;
const BRICK_W = 80;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;

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
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvasW = canvas.width;
  canvasH = canvas.height;
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
};

function ballReset() {
  ballSpeedX = -ballSpeedX;
  ballX = canvasW / 2;
  ballY = canvasH / 2;
}

function moveEverything() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX + radius > canvasW) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballX < radius) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY < radius) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvasH - radius - 2 * PADDLE_THICKNESS) {
    if (ballX > paddleX - radius && ballX < paddleX + PADDLE_WIDTH) {
      ballSpeedY = -ballSpeedY;
      var deltaX = ballX - (paddleX + PADDLE_WIDTH / 2);
      ballSpeedX = deltaX * 0.35;
    } else {
      ballReset();
    }
  }
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawBricks() {
  var brick_cols = canvasW / BRICK_W;
  for (var eachCol = 0; eachCol < brick_cols; eachCol++) {
    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      var brickLeftEdgeX = eachCol * BRICK_W;
      var brickTopEdgeY = eachRow * BRICK_H;
      colorRect(
        brickLeftEdgeX,
        brickTopEdgeY,
        BRICK_W - BRICK_GAP,
        BRICK_H - BRICK_GAP,
        "blue"
      );
    }
  }
}

function drawEverything() {
  //Create the black background
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvasW, canvasH);

  // Create a white ball
  canvasContext.fillStyle = "white";
  canvasContext.beginPath();
  canvasContext.arc(ballX, ballY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();

  // Create a paddle
  canvasContext.fillRect(
    paddleX,
    canvasH - 2 * PADDLE_THICKNESS,
    PADDLE_WIDTH,
    PADDLE_THICKNESS
  );

  //Create bricks
  drawBricks();
}
