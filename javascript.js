// Inits
window.onload = function init() {
	var game = new GF();
	game.start();
};

// GAME FRAMEWORK STARTS HERE
var GF = function () {
	// Vars relative to the canvas
	var canvas,
	ctx,
	w,
	h;

	// vars for counting frames/s, used by the measureFPS function
	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps;
	var inputStates = {};
	
	var speed = 1;
	var pos1 = false;
	var pos2 = false;
	var pos3 = false;
	
	var gameStates = {
        gameRunning: 1,
        gameOver: 2
    };
	var currentGameState = gameStates.gameRunning;
	var calcDistanceToMove = function (delta, speed) {
		//console.log("#delta = " + delta + " speed = " + speed);
		return (speed * delta) / 1000;
	};
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var ImgCar = function (color, yy) {
		var x;
		var y=yy;
		var imageObj = new Image();
		var drawn = false;
		var carPosition;
		if (color == "red") {
			imageObj.src = "img\\CarRed.png";
			
			if (drawn == false) {
				position(getRandomIntInclusive(1, 3));
			}
		}
		if (color == "blue") {
			imageObj.src = "img\\CarBlue.png";
			x = 0;
			
		}
		var draw = function (ctx) {
			ctx.save();
			// translate the coordinate system, draw relative to it
			ctx.translate(0, 0);
			ctx.drawImage(imageObj, x, y);
			// restore the context
			ctx.restore();
			drawn = true;
		}
		function position(x1) {

			if (x1 == 1 && pos1 == false) {
				x = 0;
				carPosition = 1;
				pos1 = true;
				pos2 = false;
				pos3 = false;
			} else if (x1 == 2 && pos2 == false) {
				x = 82;
				carPosition = 2;
				pos1 = false;
				pos2 = true;
				pos3 = false;
			} else if (x1 == 3 && pos3 == false) {
				x = 164;
				carPosition = 3;
				pos1 = false;
				pos2 = false;
				pos3 = true;
			} else {
				position(getRandomIntInclusive(1, 3));
			}
			//console.log("pos1"+"::"+pos1+", pos2"+"::"+pos2+", pos3"+"::"+pos3);
			//console.log("pos" + "::" + carPosition);
		}
		var move = function (tx, ty) {

			x += tx;
			y = (y + ty) % 715;
			if (y == 0) {
				
				position(getRandomIntInclusive(1, 3));
				//console.log(x+"--"+y+"- "+carPosition);
			}
		}
		var updateposition = function (inputStates) {
			if (inputStates.left && x > 0) {
				move(-82, 0);
			}

			if (inputStates.right && x < 164) {
				move(82, 0);
			}
			inputStates.left = false;
			inputStates.right = false;
			
		}
		function getX(){
			return x;
		}
		function getY(){
			return y;
		}
		// API
		return {
			
			draw : draw,
			move : move,
			getX:getX,
			getY:getY,
			position : position,
			updateposition : updateposition
		}
	}
	var blueCar = new ImgCar("blue", 475);
	
	var redCar1 = new ImgCar("red", 0);
	var redCar2 = new ImgCar("red", 429);
	var redCar3 = new ImgCar("red", 143);
	//var redCar4 = new ImgCar("red", 123);
	
	var measureFPS = function (newTime) {

		// test for the very first invocation
		if (lastTime === undefined) {
			lastTime = newTime;
			return;
		}

		//calculate the difference between last & current frame
		var diffTime = newTime - lastTime;

		if (diffTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			lastTime = newTime;
		}

		//and display it in an element we appended to the
		// document in the start() function
		fpsContainer.innerHTML = 'FPS: ' + fps;
		frameCount++;
	};

	// clears the canvas content
	function clearCanvas() {
		ctx.clearRect(0, 0, w, h);
	}
	
	function gameOverScreen() {
		var imageGameOver = new Image();
		imageGameOver.src = "img\\GameOver.jpg";
        ctx.save();
		ctx.drawImage(imageGameOver, 30, 150, 200,200);
        ctx.restore();
    }
	
	
	
	function testColistion(){
		if(blueCar.getX()==redCar1.getX() && blueCar.getY()<parseInt(redCar1.getY())+110&& redCar1.getY()<598){
			currentGameState = gameStates.gameOver;
			
		}
		if(blueCar.getX()==redCar2.getX() && blueCar.getY()<parseInt(redCar2.getY())+110 && redCar2.getY()<598){
			currentGameState = gameStates.gameOver;
			
		}
		if(blueCar.getX()==redCar3.getX() && blueCar.getY()<parseInt(redCar3.getY())+110 && redCar3.getY()<598){
			currentGameState = gameStates.gameOver;
			
		}
		// if(blueCar.getX()==redCar4.getX() && blueCar.getY()<parseInt(redCar4.getY())+110){
			// currentGameState = gameStates.gameOver;
			
		// }
	}
	var mainLoop = function (time) {
		speed +=0.0033;
		//main function, called each frame

		measureFPS(time);
		// Clear the canvas
		clearCanvas();
		switch (currentGameState) {
			case gameStates.gameRunning:
		blueCar.draw(ctx);
		redCar1.draw(ctx);
		redCar1.move(0, speed);
		redCar2.draw(ctx);
		redCar2.move(0, speed);
		redCar3.draw(ctx);
		redCar3.move(0, speed);
		
		testColistion();
		
		blueCar.updateposition(inputStates);
		 break;
            case gameStates.gameOver:
                gameOverScreen();
                break;
		}
		
		// call the animation loop every 1/60th of second
		requestAnimationFrame(mainLoop);
	};

	var start = function () {
		// adds a div for displaying the fps value
		fpsContainer = document.createElement('div');
		document.body.appendChild(fpsContainer);

		// Canvas, context etc.
		canvas = document.querySelector("#myCanvas");

		// often useful
		w = canvas.width;
		h = canvas.height;

		// important, we will draw with this object
		ctx = canvas.getContext('2d');

		
		window.addEventListener('keyup', function (event) {
			console.log(inputStates);
			if (event.keyCode === 37) {
				inputStates.left = true;
			} else if (event.keyCode === 38) {
				inputStates.up = false;
			} else if (event.keyCode === 39) {
				inputStates.right = true;
				console.log(inputStates);
			} else if (event.keyCode === 40) {
				inputStates.down = false;
			} else if (event.keyCode === 32) {
				inputStates.space = false;
			}
		}, false);
		//console.log("w= "+ w+" h= "+h);
		// start the animation
		requestAnimationFrame(mainLoop);
	};

	//our GameFramework returns a public API visible from outside its scope
	return {
		start : start
	};
};
