const width = 900;
const height = 600;

let maxMesh = 4;
const minMesh = -maxMesh;

function coordsToPixel([x, y]) {}

let lambda = Array(5).fill(0);
let l1, l2, l3, l4, l5;
// let oldtime = 450;
// let oldtime = 230;
let oldtime = 120;

let etas;
let W;
let mesh1;

function changeLambdaX(val) {
  l1 = parseFloat(val);
  document.getElementById("lambdaX").innerHTML = val;
}
function changeLambdaY(val) {
  l2 = parseFloat(val);
  document.getElementById("lambdaY").innerHTML = val;
}
function changeLambdaZ(val) {
  l3 = parseFloat(val);
  document.getElementById("lambdaZ").innerHTML = val;
}
function changeLambdaC(val) {
  l4 = parseFloat(val);
  document.getElementById("lambdaC").innerHTML = val;
}
function changeLambdaV(val) {
  l5 = parseFloat(val);
  document.getElementById("lambdaV").innerHTML = val;
}

function sketch_tilings(p) {
  // works
  function project([_x, _y, _z, _v, _w]) {
    const theta = (2 * p.PI) / 5.0;
    const x =
      (_x +
        p.cos(theta) * _y +
        p.cos(2 * theta) * _z +
        p.cos(3 * theta) * _v +
        p.cos(4 * theta) * _w) *
      p.sqrt(2 / 5);
    const y =
      (p.sin(theta) * _y +
        p.sin(2 * theta) * _z +
        p.sin(3 * theta) * _v +
        p.sin(4 * theta) * _w) *
      p.sqrt(2 / 5);
    return [x, y];
  }

  function diff([_x, _y, _z, _v, _w], [x, y, z, v, w]) {
    return [_x - x, _y - y, _z - z, _v - v, _w - w];
  }

  function scalarMult(a, [x, y, z, v, w]) {
    return [a * x, a * y, a * z, a * v, a * w];
  }

  // works
  function projectOrth([_x, _y, _z, _v, _w]) {
    const theta = (2 * p.PI) / 5.0;
    const x =
      (_x +
        p.cos(2 * theta) * _y +
        p.cos(4 * theta) * _z +
        p.cos(1 * theta) * _v +
        p.cos(3 * theta) * _w) *
      p.sqrt(2 / 5);
    const y =
      (p.sin(2 * theta) * _y +
        p.sin(4 * theta) * _z +
        p.sin(1 * theta) * _v +
        p.sin(3 * theta) * _w) *
      p.sqrt(2 / 5);
    const z = (_x + _y + _z + _v + _w) * p.sqrt(1 / 5);
    return [x, y, z];
  }

  // works
  function crossProduct3D([x, y, z], [u, v, w]) {
    return [y * w - z * v, z * u - x * w, x * v - y * u];
  }

  function scale5D(scalar, [x, y, z, u, v]) {
    return [scalar * x, scalar * y, scalar * z, scalar * u, scalar * v];
  }

  function add5D([x, y, z, u, v], [x2, y2, z2, u2, v2]) {
    return [x + x2, y + y2, z + z2, u + u2, v + v2];
  }

  // works
  function norm3D([x, y, z]) {
    return p.sqrt(x * x + y * y + z * z);
  }

  function norm5D([x, y, z, v, w]) {
    return p.sqrt(x * x + y * y + z * z + v * v + w * w);
  }

  // O(25)
  function isNeighbor(vec1, vec2) {
    var diff = 0;
    var differences = 0;
    for (var i = 0; i < 5; i++) {
      diff = vec1[i] - vec2[i];
      if (diff === 1 || diff === -1) {
        differences++;
      } else {
        if (diff !== 0) {
          return false;
        }
      }
      if (differences > 1 || differences < -1) {
        return false;
      }
    }
    return differences === 1;
  }

  // function generateIthEta()

  p.round5D = function ([x, y, z, v, w]) {
    return [p.round(x), p.round(y), p.round(z), p.round(v), p.round(w)];
  };
  let base1, base2, raster;

  p.setup = function () {
    p.disableFriendlyErrors = true; // disables FES
    lambda = Array(5).fill(0);
    l1 = 0.25;
    l2 = 0.25;
    l3 = 0.25;
    l4 = 0.25;
    l5 = 0.25;
    const theta = (2 * p.PI) / 5.0;
    base1 = [
      p.sqrt(2 / 5),
      p.cos(theta) * p.sqrt(2 / 5),
      p.cos(2 * theta) * p.sqrt(2 / 5),
      p.cos(3 * theta) * p.sqrt(2 / 5),
      p.cos(4 * theta) * p.sqrt(2 / 5),
    ];
    base2 = [
      0,
      p.sin(theta) * p.sqrt(2 / 5),
      p.sin(2 * theta) * p.sqrt(2 / 5),
      p.sin(3 * theta) * p.sqrt(2 / 5),
      p.sin(4 * theta) * p.sqrt(2 / 5),
    ];

    raster = 16 / p.sqrt(2 / 5);

    p.createCanvas(width, height);
    p.stroke(255);
    p.draw();
  };

  // Penrose tiling
  p.draw = function () {
    maxMesh = 3;

    let startTime = Date.now();
    const scale = 50;
    if (
      lambda[0] === -l1 &&
      lambda[1] === -l2 &&
      lambda[2] === -l3 &&
      lambda[3] === -l4 &&
      lambda[4] === -l5
    ) {
      return;
    }
    p.clear();
    p.translate(width / 2, height / 2);

    lambda = [-l1, -l2, -l3, -l4, -l5];
    // console.log(mesh.length);
    let accepted = [];

    let gridMax = 200;
    for (let i = 0; i < 2 * gridMax; i++) {
      // if (inCutWindow(mesh[i])) {
      //   accepted.push(mesh[i]);
      // }
      accepted.push([]);
      for (let j = 0; j < 2 * gridMax; j++) {
        const vecTmp0 = scale5D((i - gridMax) / raster, base1);
        // console.log("vecTmp0: " + vecTmp0);
        const vecAdded = add5D(vecTmp0, scale5D((j - gridMax) / raster, base2));
        // console.log("vecAdded: ", vecAdded);
        const vecRound = p.round5D(vecAdded);
        accepted[i].push(vecRound);
        // console.log("vecRound: " + vecRound);
      }
    }

    // console.log(accepted.length);
    const acceptedProjected = [];
    for (let i = 0; i < accepted.length; i++) {
      acceptedProjected.push([]);
      for (let j = 0; j < accepted[i].length; j++) {
        acceptedProjected[i].push(project(accepted[i][j]));
      }
    }
    console.log(`Time to generate points: ${Date.now() - startTime}ms`);

    // O(100*n^2)
    const l1Scaled = l1 * scale;
    const l2Scaled = l2 * scale;
    var xScaledShifted;
    var yScaledShifted;
    for (let i = 0; i < acceptedProjected.length; i++) {
      for (let j = 0; j < acceptedProjected[i].length; j++) {
        const [x, y] = acceptedProjected[i][j];
        xScaledShifted = x * scale - l1Scaled;
        yScaledShifted = y * scale - l2Scaled;
        // O(100)
        for (let k = 0; k < 2; k++) {
          for (let l = 0; l < 2; l++) {
            if (k == 0 && l == 0) continue;
            const [xkl, ykl] =
              acceptedProjected[Math.min(i + k, acceptedProjected.length - 1)][
                Math.min(j + l, acceptedProjected[i].length - 1)
              ];
            if (
              isNeighbor(
                accepted[Math.min(i + k, acceptedProjected.length - 1)][
                  Math.min(j + l, acceptedProjected[i].length - 1)
                ],
                accepted[i][j]
              )
            ) {
              p.line(
                xScaledShifted,
                yScaledShifted,
                xkl * scale - l1Scaled,
                ykl * scale - l2Scaled
              );
            }
          }
        }
      }
    }
    console.log("points accepted: " + acceptedProjected.length);
    let currentTime = Date.now() - startTime;
    if (currentTime < oldtime)
      console.log(`time: ${currentTime} ms improved from ${oldtime} ms`);
    else console.log(`time: ${currentTime} ms worse than ${oldtime} ms`);
  };
}

new p5(sketch_tilings, "tilings");
