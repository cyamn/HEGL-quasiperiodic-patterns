const width = 600;
const height = 600;

const maxMesh = 3;
const minMesh = -maxMesh;

function coordsToPixel([x, y]) {}

let lambda, l1, l2, l3, l4, l5;
// let oldtime = 450;
// let oldtime = 230;
let oldtime = 120;

let etas;
let W;
let mesh1;

function sketch_tilings(p) {
  function genMesh5D(lower, upper) {
    var mesh = [];
    for (x = lower; x <= upper; x++) {
      for (y = lower; y <= upper; y++) {
        for (z = lower; z <= upper; z++) {
          for (v = lower; v <= upper; v++) {
            for (w = lower; w <= upper; w++) {
              mesh.push([x, y, z, v, w]);
            }
          }
        }
      }
    }
    return mesh;
  }

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
  function dotProduct3D([x, y, z], [u, v, w]) {
    return x * u + y * v + z * w;
  }

  // works
  function crossProduct3D([x, y, z], [u, v, w]) {
    return [y * w - z * v, z * u - x * w, x * v - y * u];
  }

  // works
  function norm3D([x, y, z]) {
    return p.sqrt(x * x + y * y + z * z);
  }

  function norm5D([x, y, z, v, w]) {
    return p.sqrt(x * x + y * y + z * z + v * v + w * w);
  }

  // function generateIthEta()

  function generateEtas() {
    const etas = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        // unit vector dim 5 with 1 at position i
        let e_r = Array(5).fill(0);
        e_r[i] = 1;
        // unit vector dim 5 with 1 at position j
        let e_s = Array(5).fill(0);
        e_s[j] = 1;

        // projectOrth both
        let e_r_proj = projectOrth(e_r);
        let e_s_proj = projectOrth(e_s);

        // cross product
        let tmp = crossProduct3D(e_r_proj, e_s_proj);

        // normalize
        let tmp_norm = norm3D(tmp);
        if (tmp_norm === 0) {
          continue;
        }

        // divide by norm
        let eta = [tmp[0] / tmp_norm, tmp[1] / tmp_norm, tmp[2] / tmp_norm];
        //let etaMinus = [-eta[0], -eta[1], -eta[2]];

        etas.push(eta);
        //etas.push(etaMinus);
      }
    }
    return etas;
  }

  function inCutWindow([x, y, z, v, w]) {
    // const etas = generateEtas();
    // console.log("etas: " + etas.length);
    const projected = projectOrth([x, y, z, v, w]);
    for (let j = 0; j < etas.length; j++) {
      let eta = etas[j];
      // const maxI = W.map(w => dotProduct3D(w, eta)).reduce((a, b) => Math.max(a, b))
      // const I = W.map((w) => dotProduct3D(w, eta));
      const I = [];
      for (let i = 0; i < W.length; i++) {
        I.push(dotProduct3D(eta, W[i]));
      }
      if (I.length === 0) {
        // console.log("I is empty");
      }
      // get max element from I
      let maxI = I[0];
      for (let i = 1; i < I.length; i++) {
        if (I[i] > maxI) {
          maxI = I[i];
        }
      }
      if (isNaN(maxI)) {
        // console.log("I is " + I);
      }
      // console.log("maxI: " + maxI);
      if (dotProduct3D(eta, projected) > maxI) {
        return false;
      }
    }
    return true;
  }

  p.setup = function () {
    etas = generateEtas();
    WMesh = genMesh5D(-1 / 2, 1 / 2);
    W = [];
    for (let i = 0; i < WMesh.length; i++) {
      W.push(projectOrth(WMesh[i]));
    }
    mesh1 = genMesh5D(minMesh, maxMesh);
    slider = p.createSlider(0, 0.5, 0.25, 0.05);
    slider.position(10, 10);
    slider.style("width", "160px");
    slider2 = p.createSlider(0, 0.5, 0.25, 0.05);
    slider2.position(10, 30);
    slider2.style("width", "160px");
    slider3 = p.createSlider(0, 0.5, 0.25, 0.05);
    slider3.position(10, 50);
    slider3.style("width", "160px");
    slider4 = p.createSlider(0, 0.5, 0.25, 0.05);
    slider4.position(10, 70);
    slider4.style("width", "160px");
    slider5 = p.createSlider(0, 0.5, 0.25, 0.05);
    slider5.position(10, 90);
    slider5.style("width", "160px");
    p.createCanvas(width, height);
    p.stroke(255);
    p.draw();
  };

  // Penrose tiling
  p.draw = function () {
    let startTime = Date.now();
    const scale = 50;
    let val = slider.value();
    let val2 = slider2.value();
    let val3 = slider3.value();
    let val4 = slider4.value();
    let val5 = slider5.value();
    if (val === l1 && val2 === l2 && val3 === l3 && val4 === l4 && val5 == l5) {
      return;
    }
    p.clear();
    p.translate(width / 2, height / 2);

    (l1 = val), (l2 = val2), (l3 = val3), (l4 = val4), (l5 = val5);
    lambda = [-l1, -l2, -l3, -l4, -l5];
    const mesh = [];
    for (let i = 0; i < mesh1.length; i++) {
      mesh.push(diff(mesh1[i], lambda));
    }
    // console.log(mesh.length);
    const accepted = [];
    for (let i = 0; i < mesh.length; i++) {
      if (inCutWindow(mesh[i])) {
        accepted.push(mesh[i]);
      }
    }
    // console.log(accepted.length);
    const acceptedProjected = [];
    for (let i = 0; i < accepted.length; i++) {
      acceptedProjected.push(project(accepted[i]));
    }
    for (let i = 0; i < acceptedProjected.length; i++) {
      const [x, y] = acceptedProjected[i];
      p.ellipse(x * scale - l1 * scale, y * scale - l1 * scale, 3, 3);
      for (let j = i + 1; j < accepted.length; j++) {
        const [v, w] = acceptedProjected[j];
        if (norm5D(diff(accepted[i], accepted[j])) <= 1) {
          p.line(
            x * scale - l1 * scale,
            y * scale - l1 * scale,
            v * scale - l1 * scale,
            w * scale - l1 * scale
          );
        }
      }
    }
    let currentTime = Date.now() - startTime;
    if (currentTime < oldtime)
      console.log(`time: ${currentTime} ms improved from ${oldtime} ms`);
    else console.log(`time: ${currentTime} ms worse than ${oldtime} ms`);
  };
}

new p5(sketch_tilings, "tilings");
