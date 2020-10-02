var canvas;
var canvasContext;

var ballX = 400;
var ballSpeedX = 10;
var ballY = 300;
var ballSpeedY = 5;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;

var player1Score = 0;
var player2Score = 0;

const WINNING_SCORE = 5;
var showWinningScreen = false;
var winningMessage = "";

window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  setInterval(() => {
    move();
    draw();
  }, 1000 / 30);

  canvas.addEventListener("mousemove", (e) => {
    var mousePos = findMouse(e);
    paddle2Y = mousePos.y - PADDLE_HEIGHT / 2;
  });

  canvas.addEventListener("click", () => {
    if (showWinningScreen) {
      player1Score = 0;
      player2Score = 0;
      showWinningScreen = false;
    }
  });
};

function draw() {
  // background
  drawRect(0, 0, canvas.width, canvas.height, "black");

  if (showWinningScreen) {
    drawWinningScreen();
    return;
  }

  // net
  drawNet();
  // paddles
  drawPaddles();
  // scores
  drawScores();
  // ball
  drawBall(ballX, ballY, 7, "white");
}

function move() {
  if (showWinningScreen) {
    return;
  }

  moveAi();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 40) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.25;
    }
  }

  if (ballX > 760) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.25;
    }
  }

  if (ballX < 0) {
    player2Score++;
    resetBall();
  }

  if (ballX > canvas.width) {
    player1Score++;
    resetBall();
  }

  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawRect(X, Y, width, height, colour) {
  canvasContext.fillStyle = colour;
  canvasContext.fillRect(X, Y, width, height);
}

function drawWinningScreen() {
  canvasContext.fillStyle = "white";
  canvasContext.font = "30px Nunito";
  canvasContext.fillText(winningMessage, 325, 300);
  canvasContext.font = "15px Nunito";
  canvasContext.fillText("Click to play again", 360, 320);
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    drawRect(canvas.width / 2 - 1, i, 2, 30, "white");
  }
}

function drawPaddles() {
  // player 1 paddle - LEFT
  drawRect(20, paddle1Y, 10, PADDLE_HEIGHT, "white");
  // player 2 paddle - RIGHT
  drawRect(canvas.width - 30, paddle2Y, 10, PADDLE_HEIGHT, "white");
}

function drawScores() {
  canvasContext.font = "17px Nunito";
  canvasContext.fillText(player1Score, 200, 50);
  canvasContext.fillText(player2Score, 600, 50);
}

function drawBall(X, Y, size, colour) {
  canvasContext.fillStyle = colour;
  canvasContext.beginPath();
  canvasContext.arc(X, Y, size, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function moveAi() {
  var paddle1YCentre = paddle1Y + PADDLE_HEIGHT / 2;
  if (paddle1YCentre < ballY - 30) {
    paddle1Y += 7;
  } else if (paddle1YCentre > ballY + 30) {
    paddle1Y -= 7;
  }
}

function findMouse(e) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  var mouseX = e.clientX - rect.left - root.scrollLeft;
  var mouseY = e.clientY - rect.top - root.scrollTop;

  return { x: mouseX, y: mouseY };
}

function resetBall() {
  checkScore();
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 10;
  ballSpeedY = 5;
  ballSpeedX *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
  ballSpeedY *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
}

function checkScore() {
  if (player1Score >= WINNING_SCORE) {
    winningMessage = "YOU LOST!";
    showWinningScreen = true;
  }
  if (player2Score >= WINNING_SCORE) {
    winningMessage = "YOU WON!";
    showWinningScreen = true;
  }
}
