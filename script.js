let angleInp = document.getElementById("angleOfRay");
let angleDispl = document.getElementById("angleDispl");

tileSize = 64;
main_map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ];

class Map {
  constructor() {
    this.grid = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ];
    this.height = this.grid.length;
    this.width = this.grid[0].length;
  }

  render() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        if (this.grid[y][x] == 0) {
          stroke('gray');
          fill('rgb(80, 80,85)');
        }
        else if (this.grid[y][x] == 1) {
          stroke('gray');
          fill('rgb(20, 20, 20)');
        }
        square(x*tileSize, y*tileSize, tileSize);
      }
    }
  }

  hasWallAt(x, y) {
    if (x < 0 || x > width || y < 0 || y > height) {
      return True;
    }
    return this.grid[Math.floor(y/tileSize)][Math.floor(x/tileSize)] != 0;
  }
}
class Ray {
  constructor(theta, x, y) {
    this.angle = theta;
    this.posx = x;
    this.posy = y;
    this.wallHitX = 1;
    this.wallHitY = 1;
    this.distance = 1;
  }
  render() {
   stroke('white');
   line(this.posx, this.posy, this.wallHitX, this.wallHitY);
  }
  isFacingUp() {
    return (this.angle > Math.PI || this.angle < 0)
  }
  isFacingRight() {
    return (this.angle < Math.PI/2 || this.angle > (3/2)*Math.PI);
  }
  isFacingDown() {
    return (this.angle < Math.PI && this.angle > 0);
  }
  isFacingLeft() {
    return (this.angle > Math.PI/2 && this.angle < (3/2)*Math.PI);
  }
  cast() {
    // Horizontal Intersections
    let horzYintercept, horzYstep;
    if (this.isFacingUp()) {
      horzYintercept = floor(this.posy/tileSize)*tileSize;
      horzYstep = -tileSize;
    }
    else if (this.isFacingDown()) {
      horzYintercept = ceil(this.posy/tileSize)*tileSize;
      horzYstep = tileSize;
    }
    let horzInitXstep = (horzYintercept-this.posy)/tan(this.angle);
    let horzXintercept = this.posx+horzInitXstep;

    // horizontal increments
    let horzXstep = tileSize/tan(this.angle);
    horzXstep *= (this.isFacingLeft() && horzXstep > 0) ? -1: 1;
    horzXstep *= (this.isFacingRight() && horzXstep < 0) ? -1 : 1;

    let horzXnextTouch = horzXintercept;
    let horzYnextTouch = horzYintercept;
    if (this.isFacingUp()) {
      horzYnextTouch--;
    }
    let horzHitWall = false;
    let horzWallHitX = 0;
    let horzWallHitY = 0;
    while (horzXnextTouch >= 0 && horzXnextTouch <= width && horzYnextTouch >= 0 && horzYnextTouch <= height) {
      if (worldMap.hasWallAt(horzXnextTouch, horzYnextTouch)) {
        horzHitWall = true;
        horzWallHitX = horzXnextTouch;
        horzWallHitY = horzYnextTouch;
        // stroke('red');
        // line(this.posx, this.posy, horzXnextTouch, horzYnextTouch);
        break;
      }
      else {
        horzXnextTouch += horzXstep;
        horzYnextTouch += horzYstep;
      }
    }

    // Vertical Intersections
    let verXintercept = Math.floor(this.posx / tileSize) * tileSize;
    verXintercept += this.isFacingRight() ? tileSize : 0;

    let verYintercept = this.posy + ((verXintercept - this.posx) * Math.tan(this.angle));

    let verXstep = tileSize;
    verXstep *= this.isFacingLeft() ? -1 : 1;

    let verYstep = tileSize * Math.tan(this.angle);
    verYstep *= (this.isFacingUp() && verYstep > 0) ? -1 : 1;
    verYstep *= (this.isFacingDown() && verYstep < 0) ? -1 : 1;

    let verXnextTouch = verXintercept;
    if (this.isFacingLeft()) {
      verXnextTouch--;
    }
    let verYnextTouch = verYintercept;
    let verHitWall = false;
    let verWallHitX = 0;
    let verWallHitY = 0;

    while (verXnextTouch >= 0 && verXnextTouch <= width && verYnextTouch >= 0 && verYnextTouch <= height) {
      if (worldMap.hasWallAt(verXnextTouch, verYnextTouch)) {
        verHitWall = true;
        verWallHitX = verXnextTouch;
        verWallHitY = verYnextTouch;
        // stroke('blue');
        // line(this.posx, this.posy, verWallHitX, verWallHitY);
        break;
      }
      else {
        verXnextTouch += verXstep;
        verYnextTouch += verYstep;
      }
    }

    //calc both hor and ver and choose smallest value
    let horzWallHitDistance = horzHitWall ? distanceBetweenPoints(this.posx, this.posy, horzWallHitX, horzWallHitY) : Number.MAX_VALUE;
    let verWallHitDistance = verHitWall ? distanceBetweenPoints(this.posx, this.posy, verWallHitX, verWallHitY) : Number.MAX_VALUE;
    this.wallHitX = (horzWallHitDistance < verWallHitDistance) ? horzWallHitX : verWallHitX;
    this.wallHitY = (horzWallHitDistance < verWallHitDistance) ? horzWallHitY : verWallHitY;
    this.distance = (horzWallHitDistance < verWallHitDistance) ? horzWallHitDistance : verWallHitDistance
 }
}

worldMap = new Map();
ray1 = new Ray(degreesToRadians(angleInp.value), 256, 256);

let width = worldMap.width*tileSize;
let height = worldMap.height*tileSize;
let canvas;

function setup() {
  canvas = createCanvas(512, 512);
  canvas.parent('simulation');
}

allcast = false;

function draw() {
  worldMap.render();
  if (allcast) {
    castAll();
    angleInp.value = ray1.angle * 180/Math.PI;
  }
  else {
    ray1.angle = degreesToRadians(angleInp.value);
    ray1.cast();
    ray1.render();
  }
  angleDispl.innerHTML = ray1.angle * 180/Math.PI;
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let x = Math.floor(mouseX/tileSize);
    let y = Math.floor(mouseY/tileSize);
    if (x > 0 && x < 7 && y > 0 && y < 7) {
      if (worldMap.grid[y][x] == 0) {
        worldMap.grid[y][x] = 1;
      }
      else {
        worldMap.grid[y][x] = 0;
      }
      worldMap.render();
    }
  }
}

function castAllTrue() {
  allcast = true;
}

function castAllFalse() {
  allcast = false;
}

function castAll() {
  for (let i = 0; i < 361; i++) {
    ray1.angle = degreesToRadians(i);
    ray1.cast();
    ray1.render()
  }
}

function degreesToRadians(theta) {
  return theta * (Math.PI/180);
}
function distanceBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y2-y1), 2));
}
