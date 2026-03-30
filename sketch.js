const uCount = 50;
const uMin = -100;
const uMax = 100;

const vCount = 50;
const vMin = -100;
const vMax = 100;

const points = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noFill();
  stroke(255);
  strokeWeight(1 / 4);

  for (let iv = 0; iv <= vCount; iv++) {
    points[iv] = [];
    for (let iu = 0; iu <= uCount; iu++) {
      const u = map(iu, 0, uCount, uMin, uMax);
      const v = map(iv, 0, vCount, vMin, vMax);
      points[iv][iu] = createVector(u, v, 0);
    }
  }
}

function getWaveZ(x, y, mx, my, time) {
  const d = dist(mx, my, x, y);
  return sin(d * 0.2 - time * 0.1) * 3;
}

function draw() {
  background(0);
  scale(40);
  orbitControl();

  directionalLight(255, 0, 0, 1);

  const mx = map(mouseX, 0, width, uMin, uMax);
  const my = map(mouseY, 0, height, vMin, vMax);

  for (let iv = 0; iv <= vCount; iv++) {
    for (let iu = 0; iu <= uCount; iu++) {
      const pt = points[iv][iu];
      
      pt.z = getWaveZ(pt.x, pt.y, mx, my, frameCount);
      
      const pxZ = getWaveZ(pt.x + 0.1, pt.y, mx, my, frameCount);
      const pyZ = getWaveZ(pt.x, pt.y + 0.1, mx, my, frameCount);
      
      const dzdx = (pxZ - pt.z) / 0.1;
      const dzdy = (pyZ - pt.z) / 0.1;
      
      const mag = sqrt(dzdx * dzdx + dzdy * dzdy + 1);
      pt.nx = -dzdx / mag;
      pt.ny = -dzdy / mag;
      pt.nz = 1 / mag;
    }
  }

  push();
  rotateX(HALF_PI);
  translate(0, 0, -3);

  noStroke();
  specularMaterial(200);
  shininess(30);
  fill(255);
  
  for (let iv = 0; iv < vCount; iv++) {
    beginShape(QUAD_STRIP);
    for (let iu = 0; iu <= uCount; iu++) {
      const p1 = points[iv][iu];
      const p2 = points[iv + 1][iu];

      normal(p1.nx, p1.ny, p1.nz);
      vertex(p1.x, p1.y, p1.z);

      normal(p2.nx, p2.ny, p2.nz);
      vertex(p2.x, p2.y, p2.z);
    }
    endShape();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    const timeStamp = year() + nf(month(), 2) + nf(day(), 2) + "_" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
    save("screenshot/" + timeStamp + ".png");
  }
}