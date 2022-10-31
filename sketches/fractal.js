var w = 500;
var h = 500;
var t = 0;

var nextPlanetID = 0;
class Planet {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.id = ++nextPlanetID;
  }

  static spawn() {
    return new Planet(random(w), random(h), random(1, 1));
  }

  update(t) {
    // update position based on n-body problem
    for (var i = 0; i < planets.length; i++) {
      var other = planets[i];
      if (other.id == this.id) {
        continue;
      }
      var dx = other.x - this.x;
      var dy = other.y - this.y;
      var d = sqrt(dx * dx + dy * dy);
      var f = 0.1 * other.size / (d * d);
      this.x += dx * f;
      this.y += dy * f;

      // check for collision
      if (d < this.size / 2 + other.size / 2) {
        // merge planets (area should be equal to sum of previous areas)
        var newSize = sqrt(this.size * this.size + other.size * other.size);
        this.size = newSize;
        planets.splice(i, 1);
        i--;
      }
    }
  }
}

var planetNum = 2000;
var planets = [];

function setup() {
  createCanvas(w, h);
  background(0);
  stroke(255);
  noFill();
  for (var i = 0; i < planetNum; i++) {
    planets.push(Planet.spawn());
  }
}

function draw() {
  background(0);
  for (var i = 0; i < planets.length; i++) {
    var p = planets[i];
    ellipse(p.x, p.y, p.size, p.size);
    p.update(t);
  }
  t += 1;
}