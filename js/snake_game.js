//initialisation
var mycanvas = document.getElementById('mycanvas');
var ctx = mycanvas.getContext('2d');
var snakeTileSize = 10;

var score = 0;
var snake;
var food;
var pause_game = 0;
var already_started = 0;
var submit_score = 0;
var lost_game = 0;
fitToContainer(mycanvas);
var width = mycanvas.width;
var height = mycanvas.height;
function fitToContainer(canvas){
    canvas.style.width='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// function for drawing snake tile
var drawSnakeTile = function(x, y) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x*snakeTileSize, y*snakeTileSize, snakeTileSize, snakeTileSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(x*snakeTileSize, y*snakeTileSize, snakeTileSize, snakeTileSize);
}

//function for initialising snake
var initSnake = function() {
    var length = 4;
    snake = [];
    for (var i = length-1; i>=0; i--) {
        snake.push({x:i, y:0});
    }
}

//function for drawing snake body
var drawSnake = function() {
    for(var i = 0; i < snake.length; i++) {
        drawSnakeTile(snake[i].x, snake[i].y);
    }
}

//finction for painting the game
var paint = function(){
    if(pause_game === 1) {
        fitToContainer(mycanvas);
        width = mycanvas.width;
        height = mycanvas.height;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, width, height);
        var snake_position_x = snake[0].x;
        var snake_position_y = snake[0].y;
        if (direction == 'right') {
            snake_position_x++;
        }
        else if (direction == 'left') {
            snake_position_x--;
        }
        else if (direction == 'up') {
            snake_position_y--;
        } else if (direction == 'down') {
            snake_position_y++;
        }
        if (detectCollision(snake_position_x, snake_position_y, snake) || snake_position_x == -1 || snake_position_x >= width / snakeTileSize || snake_position_y == -1 || snake_position_y >= height / snakeTileSize) {
            ctx.clearRect(0, 0, width, height);
            gameloop = clearInterval(gameloop);
            already_started = 0;
            pause_game = 0;
            document.getElementById('start_button').innerHTML='Play';
            document.getElementById('save_button').innerHTML='Score';
            submit_score = 1;
            lost_game = 1;
            drawgameOver();
            return;
        }
        if (snake_position_x == food.x && snake_position_y == food.y) {
            var tail = {x: snake_position_x, y: snake_position_y};
            score++;
            generateFood();
        } else {
            var tail = snake.pop();
            tail.x = snake_position_x;
            tail.y = snake_position_y;
        }
        snake.unshift(tail);
        drawSnake();
        ctx.fillStyle = 'yellow';
        ctx.fillRect(food.x * snakeTileSize, food.y * snakeTileSize, snakeTileSize, snakeTileSize);
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * snakeTileSize + 1, food.y * snakeTileSize + 1, snakeTileSize - 2, snakeTileSize - 2);
        var score_message = "Score: " + score;
        ctx.fillStyle = 'orange';
        ctx.fillText(score_message, width-width/5, height/15);
    }
}

//function for generating food
var generateFood = function() {
    food = {
        x: Math.floor((Math.random() * (width/snakeTileSize)) + 1),
        y: Math.floor((Math.random() * height/snakeTileSize) + 1)
    }
    for (var i=0; i>snake.length; i++) {
        var snake_position_x = snake[i].x;
        var snake_position_y = snake[i].y;
        if (food.x===snake_position_x && food.y === snake_position_y) {
          food.x = Math.floor((Math.random() * (width/snakeTileSize)) + 1);
          food.y = Math.floor((Math.random() * height/snakeTileSize) + 1);
        }
    }
}

//function for detecting collisions
var detectCollision = function(x, y, snakeTiles) {
    for(var i = 0; i < snakeTiles.length; i++) {
        if(snakeTiles[i].x === x && snakeTiles[i].y === y) return true;
    }
    return false;
}

//initialising function
var init = function(){
    score = 0;
    lost_game = 0;
    direction = 'down';
    initSnake();
    generateFood();
    gameloop = setInterval(paint, 70);
}

var drawStartingMessage = function(){
    ctx.font = "20px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, width-50, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.fillText("Welcome to Snake journey! ", width/3, height/2 -30);
    ctx.font = "15px Verdana";
    ctx.fillText("Press start to start the journey! ", width/3, height/2);
}

var drawgameOver= function(){
    ctx.font = "20px Verdana";
    var gradient = ctx.createLinearGradient(0, 0, width-50, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.fillText("Game over! ", width/3, height/2 -30);
    ctx.font = "15px Verdana";
    ctx.fillText("Play again or submit score! ", width/3, height/2);

}

//////////////////////////////////////////////////////////////////////////////////////
drawStartingMessage();
document.getElementById('start_button').addEventListener("click", function(){
    if(already_started == 0) {
        already_started = 1;
        submit_score = 0;
        document.getElementById('save_button').innerHTML='Save';
        init();
    }
    if(pause_game === 0){
        document.getElementById('start_button').innerHTML='Pause';
        pause_game = 1;
    } else {
        document.getElementById('start_button').innerHTML='Play';
        pause_game = 0;
    }
});

document.onkeydown = function(event) {

    keyCode = window.event.keyCode;
    keyCode = event.keyCode;

    switch(keyCode) {

        case 37:
            if (direction != 'right') {
                direction = 'left';
            }
            break;

        case 39:
            if (direction != 'left') {
                direction = 'right';
            }
            break;

        case 38:
            if (direction != 'down') {
                direction = 'up';
            }
            break;

        case 40:
            if (direction != 'up') {
                direction = 'down';
            }
            break;
    }
}


function resizeEvent() {
    fitToContainer(mycanvas);
    width = mycanvas.width;
    height = mycanvas.height;
    if(lost_game == 0)drawStartingMessage();
    else drawgameOver();
}