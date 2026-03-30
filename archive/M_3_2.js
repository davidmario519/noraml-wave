let uCount = 40;
let uMin = -50;
let uMax = 50;

let vCount = 40;
let vMin = -50;
let vMax = 50;

let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // fill(255);
  noFill();
  stroke(255)
  strokeWeight(1/4)

  for (let iv = 0; iv <= vCount; iv++) {
    points[iv] = [];
    for (let iu = 0; iu <= uCount; iu++) {
      let u = map(iu, 0, uCount, uMin, uMax);
      let v = map(iv, 0, vCount, vMin, vMax);

      points[iv][iu] = createVector();
      points[iv][iu].x = v;
      points[iv][iu].y = sin(u) * cos(v);
      points[iv][iu].z = cos(u) * cos(v);

    }
  }
  console.log(points)
}

function draw() {
  background(0);
  scale(40);
  orbitControl();

  for (let iv = 0; iv < vCount; iv++) {
    beginShape();
    for (let iu = 0; iu <= uCount; iu++) {
      vertex(points[iv][iu].x, points[iv][iu].y, points[iv][iu].z);
      vertex(points[iv+1][iu].x, points[iv+1][iu].y, points[iv+1][iu].z);
    }
    endShape();
  }
}
