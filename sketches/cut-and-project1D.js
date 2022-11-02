let tau, gradient, theta, thickness, verticalHeight, regionWidth;

let yMax, yMin, x_accepted, y_accepted;

function maxAccepted(x) {
  return gradient * x + verticalHeight / 2;
}

function minAccepted(x) {
  return gradient * x - verticalHeight / 2;
}

function isWithinRegion(x, y) {
  return y > minAccepted(x) && y < maxAccepted(x);
}

function setup() {
  tau = (1 + sqrt(5)) / 2.0;
  gradient = 1 / tau;
  theta = atan(gradient);

  thickness = (cos(theta) + sin(theta)) * tau;
  verticalHeight = thickness * sqrt(gradient ** 2 + 1);
  regionWidth = 5;

  createCanvas(800, 200);

  yMax = ceil(maxAccepted(regionWidth));
  yMin = floor(minAccepted(0));

  x_accepted = [];
  y_accepted = [];

  drawOnce();
}

function drawOnce() {
  translate(140, height / 2);
  background(255);
  fill(0);

  for (x = 0; x <= regionWidth; x++) {
    for (y = yMin; y <= yMax; y++) {
      if (isWithinRegion(x, y)) {
        x_accepted.push(x);
        y_accepted.push(y);
      }
    }
  }
  for (i = 0; i < x_accepted.length; i++) {
    let x_final =
      (x_accepted[i] + y_accepted[i] * gradient) / (1 + gradient ** 2);
    ellipse(x_final * 100, 0, 10, 10);
  }
}
