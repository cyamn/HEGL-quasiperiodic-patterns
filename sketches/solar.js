// let w = 600;
// let h = 600;
let G = 9.81;
let numPlanets = 5;
let destabilize = 0.2;

let sun;
let planets = [];

function setup() {
  createCanvas(windowWidth-20, windowHeight-20);
  sun = new Body(100, createVector(0, 0), createVector(0, 0))
  
  for (var i = 0; i < numPlanets; i++) {

    // planet position
    let r = random(sun.r, min(width,height) / 2);
    let theta = random(TWO_PI);
    let planetPos = createVector(r * cos(theta), r * sin(theta));
    
    // planet velocity
    let planetVel = planetPos.copy()
    planetVel.rotate(HALF_PI);
    planetVel.setMag(sqrt(G * sun.mass / planetPos.mag()));
    if (random(1) < 0.2) {
      planetVel.mult(-1);
    }
    planetVel.mult(random(1-destabilize, 1+destabilize));
    planet = new Body(random(5,30), planetPos, planetVel);
    planets.push(planet);
  }
}

function draw() {
  translate(width/2, height/2);
  background(0);
  for (var i = 0; i < planets.length; i++) {
    sun.attract(planets[i]);
    planets[i].update();
    planets[i].show();
  }
  sun.show();
}

class Body {
  constructor(mass, pos, vel) {
    this.mass = mass;
    this.pos = pos;
    this.vel = vel;
    this.r = this.mass
    this.path = [];
  }

  show() {
    for (let i = 0; i < this.path.length - 2; i++) {
      stroke(min(i,200));
      strokeWeight(min(i/10,this.r))
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y);
    }
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  update() {
    this.pos.add(this.vel);
    this.path.push(this.pos.copy());
    if (this.path.length > this.r*10) {
      this.path.splice(0, 1);
    }
  }

  applyForce(f) {
    this.vel.x += f.x / this.mass;
    this.vel.y += f.y / this.mass;
  }

  attract(child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
    let f = this.pos.copy().sub(child.pos)
    f.setMag((G * this.mass * child.mass) / (r * r));
    child.applyForce(f);
  }
}