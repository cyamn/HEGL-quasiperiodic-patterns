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

// Code for Penrose starts here

function sketch_tilings(p) {
  const theta = (2 * p.PI) / 5.0;
  const tau = Math.sqrt(2 / 5);

  // works
  const [px1, px2, px3, px4, px5] = [
    tau,
    Math.cos(theta) * tau,
    Math.cos(2 * theta) * tau,
    Math.cos(3 * theta) * tau,
    Math.cos(4 * theta) * tau,
  ];

  const [py1, py2, py3, py4, py5] = [
    0,
    Math.sin(theta) * tau,
    Math.sin(2 * theta) * tau,
    Math.sin(3 * theta) * tau,
    Math.sin(4 * theta) * tau,
  ];
  function project([_x, _y, _z, _v, _w]) {
    const x = px1 * _x + px2 * _y + px3 * _z + px4 * _v + px5 * _w;
    const y = py2 * _y + py3 * _z + py4 * _v + py5 * _w;
    return [x, y];
  }

  function scale5D(scalar, [x, y, z, u, v]) {
    return [scalar * x, scalar * y, scalar * z, scalar * u, scalar * v];
  }

  function add5D([x, y, z, u, v], [x2, y2, z2, u2, v2]) {
    return [x + x2, y + y2, z + z2, u + u2, v + v2];
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
    raster = 18 / p.sqrt(2 / 5);
    base1 = [
      p.sqrt(2 / 5),
      p.cos(theta) * p.sqrt(2 / 5),
      p.cos(2 * theta) * p.sqrt(2 / 5),
      p.cos(3 * theta) * p.sqrt(2 / 5),
      p.cos(4 * theta) * p.sqrt(2 / 5),
    ];
    base1 = scale5D(1.0 / raster, base1);
    base2 = [
      0,
      p.sin(theta) * p.sqrt(2 / 5),
      p.sin(2 * theta) * p.sqrt(2 / 5),
      p.sin(3 * theta) * p.sqrt(2 / 5),
      p.sin(4 * theta) * p.sqrt(2 / 5),
    ];
    base2 = scale5D(1.0 / raster, base2);

    p.createCanvas(width, height);
    p.stroke(255);
    p.draw();
  };

  let startTime = Date.now();
  let durationFilter = 0;
  let durationProject = 0;
  let durationDraw = 0;
  function logTime(message) {
    console.log(
      message +
        ": " +
        (Date.now() - startTime) +
        "ms -> Accept[" +
        durationFilter +
        "] + Project[" +
        durationProject +
        "] + Draw[" +
        durationDraw +
        "]"
    );
    startTime = Date.now();
  }

  // Penrose tiling
  p.draw = function () {
    maxMesh = 3;

    startTime = Date.now();
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
    // console.log("\n\n\n\n\n\n");
    p.clear();
    p.translate(width / 2, height / 2);

    lambda = [-l1, -l2, -l3, -l4, -l5];
    // console.log(mesh.length);

    let startFilter = Date.now();
    let gridMax = 250;
    let accepted = Array(2 * gridMax).fill([]);
    let vecTmp0, vecTmp1, vecAdded, vecRound;
    for (let i = 0; i < 2 * gridMax; i++) {
      accepted[i] = Array(2 * gridMax).fill([]);
      for (let j = 0; j < 2 * gridMax; j++) {
        vecTmp0 = scale5D(i - gridMax, base1);
        vecTmp1 = scale5D(j - gridMax, base2);
        vecAdded = add5D(vecTmp0, vecTmp1);
        vecRound = p.round5D(vecAdded);
        accepted[i][j] = vecRound;
      }
    }
    durationFilter = Date.now() - startFilter;

    let timeProject = Date.now();
    // console.log(accepted.length);
    const acceptedProjected = [];
    for (let i = 0; i < accepted.length; i++) {
      acceptedProjected.push([]);
      for (let j = 0; j < accepted[i].length; j++) {
        acceptedProjected[i].push(project(accepted[i][j]));
      }
    }
    durationProject = Date.now() - timeProject;

    let timeDraw = Date.now();
    // O(100*n^2)
    const l1Scaled = l1 * scale;
    const l2Scaled = l2 * scale;
    var xScaledShifted;
    var yScaledShifted;
    var kMax = 2;
    var lMax = 2;
    for (let i = 0; i < acceptedProjected.length; i++) {
      for (let j = 0; j < acceptedProjected[i].length; j++) {
        const [x, y] = acceptedProjected[i][j];
        xScaledShifted = x * scale - l1Scaled;
        yScaledShifted = y * scale - l2Scaled;
        // O(100)

        kMax = Math.min(i + 2, accepted.length);
        lMax = Math.min(j + 2, accepted[i].length);

        for (let k = i; k < kMax; k++) {
          for (let l = j; l < lMax; l++) {
            if (k == 0 && l == 0) continue;
            const [xkl, ykl] = acceptedProjected[k][l];
            if (isNeighbor(accepted[k][l], accepted[i][j])) {
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
    durationDraw = Date.now() - timeDraw;
    // console.log(`Time to draw: ${Date.now() - timeDraw}ms`);
    // console.log("points accepted: " + acceptedProjected.length);
    logTime("Time for draw");
  };
}

new p5(sketch_tilings, "tilings");
