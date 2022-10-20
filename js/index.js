window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  backgroundImage.draw();
  carImage.draw();

  function startGame() {
    document.getElementById("start-button").remove();

    // react to arrows and move car
    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowLeft":
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          backgroundImage.draw();
          if (carImage.x > 50) {
            carImage.x -= 50;
          }
          break;
        case "ArrowRight":
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          backgroundImage.draw();
          if (carImage.x < 425) {
            carImage.x += 50;
          }
          break;
      }
      carImage.draw();
    });

    // initialize the obstacles
    new Obstacles().init();
  }
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Background {
  constructor(image) {
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = image;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
  }
}

const backgroundImage = new Background("images/road.png");

class Car {
  constructor(image) {
    this.x = 225;
    this.y = 550;
    this.image = new Image();
    this.image.src = image;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, 50, 100);
  }
}

const carImage = new Car("images/car.png");

// Obstacles has one big list of all obstacles, each new obstacle of type Obstacle is added to it
// Obstacles computes score and runs the interval
class Obstacles {
  constructor() {
    this.obstaclesList = [];
    this.score = 0;
  }

  init() {
    setInterval(() => {
      // add new Obstacle
      this.obstaclesList.push(new Obstacle());
    }, 2000);

    //  every refresh rate, clear everything, add bg, add car, loop over all obstacles and add them to the canvas, check for collision and end game
    const intervalId = setInterval(() => {
      console.log(this.obstaclesList);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      backgroundImage.draw();
      carImage.draw();
      for (let i = 0; i < this.obstaclesList.length; i++) {
        this.obstaclesList[i].lower();
        this.obstaclesList[i].draw();
        if (this.obstaclesList[i].y === 700) {
          this.score++;
          // yeeting obstacle to the left, i wanted to splice old obstacles but it messed up the for loop and i didn't figure out how to fix it
          this.obstaclesList[i].x = -1000;
        } else if (
          this.obstaclesList[i].x < carImage.x &&
          this.obstaclesList[i].x + this.obstaclesList[i].width >
            carImage.x + 50 &&
          this.obstaclesList[i].y > 525
        ) {
          clearInterval(intervalId);
        }
        document.getElementsByTagName(
          "h2"
        )[0].innerHTML = `SCORE: ${this.score}`;
      }
    }, 1000 / 60);
  }

  draw() {}
}

class Obstacle {
  constructor() {
    this.x = Math.floor(Math.random() * 420);
    this.y = 0;
    this.width = 75 + Math.floor(Math.random() * 200);
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.fillRect(this.x, this.y, this.width, 25);
    ctx.stroke();
  }

  lower() {
    this.y += 5;
  }
}
