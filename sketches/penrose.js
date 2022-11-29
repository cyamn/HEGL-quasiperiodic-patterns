let tau, gradient, theta, thickness, verticalHeight, regionWidth;

let zMax, zMin, x_accepted, y_accepted;

function maxAccepted(x) {
  return gradient * x + verticalHeight / 2;
}

function minAccepted(x) {
  return gradient * x - verticalHeight / 2;
}

function isWithinRegion(x, y, z) {
  if (z > minAccepted(x) && z < maxAccepted(x)) {
    if (z > minAccepted(y) && z < maxAccepted(y)) {
      return true;
    }
  }
}


function setup() {
  tau = (1 + sqrt(5)) / 2.0;
  gradient = 1 / tau;
  theta = atan(gradient);

  thickness = (cos(theta) + sin(theta)) * tau;
  verticalHeight = thickness * sqrt(gradient ** 2 + 1);
  regionWidth = 5;

  createCanvas(windowWidth - 20, windowHeight - 20);

  zMax = ceil(maxAccepted(regionWidth));
  zMin = floor(minAccepted(0));

  x_accepted = [];
  y_accepted = [];
  z_accepted = [];

  drawOnce();
}

function drawOnce() {
  background(255);
  translate(140, 140);
  fill(0);
  let min = -0.5;
  let max = 0.5;
  // 2^5 = 32 iterations
  for (x = min; x <= max; x++) {
    for (y = min; y <= max; y++) {
      for (z = min; z <= max; z++) {
        for (v = min; v <= max; v++) {
          for (w = min; w <= max; w++) {
            console.log(x, y, z, v, w);
          }
        }
      }
    }
  }
  for (i = 0; i < x_accepted.length; i++) {
    for (j = 0; j < y_accepted.length; j++) {
      let x_final =
        (x_accepted[i] + z_accepted[i] * gradient) / (1 + gradient ** 2);
      let y_final =
        (y_accepted[j] + z_accepted[j] * gradient) / (1 + gradient ** 2);
      ellipse(x_final * 100, y_final * 100, 10, 10);
    }
  }
}
