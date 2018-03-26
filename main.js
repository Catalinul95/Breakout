'use strict';

window.onload = function () {
  // some useful constants
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;

  // canvas related stuff
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  
  // game related stuff
  const keysDown = {};
  let isGameOver = false;
  let score = 0;
  let ticks = 0;
  
  // check collision between two rectangles
  function checkCollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y) {
      return true;
    }
  }
  
  
  const ball = {
    x: Math.floor(Math.random() * (100 - 100) + 100),
    y: 350,
    vx: 4,
    vy: 4,
    width: 5,
    height: 5,
    update: function() {
      this.x += this.vx;
      this.y += this.vy;
    },
    draw: function () {
      ctx.fillStyle = '#000';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
  };
  
  // constructor function to create the player
  function Player(x, y, width, height, vx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = vx;
  }
  
  Player.prototype.update = function () {
    if (keysDown[LEFT_KEY] && this.x > 0) {
      this.x -= this.vx;
    }
    
    if (keysDown[RIGHT_KEY] && this.x + this.width < canvas.width) {
      this.x += this.vx;
    }
  };
  
  Player.prototype.draw = function () {
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  
  // constructor function to create Bricks
  function Brick(x, y, width, height, vy, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vy = vy;
    this.color = color;
    this.alive = true;
    this.ticksToMove = 100;
    this.ticks = 0;
  }
  
  Brick.prototype.update = function () {
    this.y += this.vy;
  };
  
  Brick.prototype.draw = function () {
    
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  
  // constructor function to create BricksManager objects
  function BricksManager() {
    this.bricks = [];
  }
  
  BricksManager.prototype.init = function initBricks() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 5; j++) {
        let r = Math.floor(Math.random() * (256 - 1) + 1);
        let g = Math.floor(Math.random() * (256 - 1) + 1);
        let b = Math.floor(Math.random() * (256 - 1) + 1);
        
        const brick = new Brick(
          30 + (35 * i) + (35 * i),
          25 + (20 * j) + (20 * j),
          50,
          25,
          2,
          'rgb(' + r + ',' + g + ',' + b + ')'
        );
        
        this.bricks.push(brick);
      }
    }
  };
  
  BricksManager.prototype.draw = function drawBricks() {
    this.bricks.forEach(function (brick, index) {
      brick.draw();
    });
  };
  
  function drawEndingScene() {
    ctx.font = '30px Arial';
    if (!bricksManager.bricks.length) {
      ctx.fillText('You won! Congratulations!', 100, 300);
    } else {
      ctx.fillText('Game over...', 200, 300);
      ctx.fillText('Score: ' + score, 200, 330);
    }
  }
  
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(loop);
    
    if (!isGameOver) {
      bricksManager.draw();
      
      // check if game is won
      if (!bricksManager.bricks.length) {
        isGameOver = true;
      }

      bricksManager.bricks.forEach(function (brick, index) {
        if (brick.ticks == brick.ticksToMove) {
          brick.y += brick.vy;
          brick.ticks = 0;
        }
      });

      // between player and ball
      if (checkCollision(player, ball)) {
        ball.vy = -ball.vy;
      }

      // collision left and right edges
      if (ball.x + ball.width >= canvas.width || ball.x <= 0) {
        ball.vx = -ball.vx;
      }

      // collision upper edge
      if (ball.y < 0) {
        ball.vy = -ball.vy;
      }

      if (ball.y > canvas.height) {
        isGameOver = true;
      }

      bricksManager.bricks.forEach(function (brick, index) {
        brick.ticks += 1;
        
        // remove dead bricks
        if (!brick.alive) {
          bricksManager.bricks.splice(index, 1);
        }

        // between ball and brick
        if (checkCollision(ball, brick)) {
          brick.alive = false;
          ball.vy = -ball.vy;
          score += 1;
        }
      });

      player.update();
      ball.update();

      player.draw();
      ball.draw();
      
      ticks++;
    } else {
      drawEndingScene();
    }
  }
  
  const bricksManager = new BricksManager();
  const player = new Player(50, 570, 130, 20, 10);
  
  bricksManager.init();
  loop();
  
  // listen for keyboard input
  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case RIGHT_KEY:
        keysDown[RIGHT_KEY] = true;
        break;
      case LEFT_KEY:
        keysDown[LEFT_KEY] = true;
        break;
    }
  });
  
  window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case RIGHT_KEY:
        keysDown[RIGHT_KEY] = false;
        break;
      case LEFT_KEY:
        keysDown[LEFT_KEY] = false;
        break;
    }
  });
};