class Mesh {
  
  // ------ constants ------
  static CUSTOM              = 0;
  static PLANE               = 0;
  static TUBE                = 1;
  static SPHERE              = 2;
  static TORUS               = 3;
  static PARABOLOID          = 4;
  static STEINBACHSCREW      = 5;
  static SINE                = 6;
  static FIGURE8TORUS        = 7;
  static ELLIPTICTORUS       = 8;
  static CORKSCREW           = 9;
  static BOHEMIANDOME        = 10;
  static BOW                 = 11;
  static MAEDERSOWL          = 12;
  static ASTROIDALELLIPSOID  = 13;
  static TRIAXIALTRITORUS    = 14;
  static LIMPETTORUS         = 15;
  static HORN                = 16;
  static SHELL               = 17;
  static KIDNEY              = 18;
  static LEMNISCAPE          = 19;
  static TRIANGULOID         = 20;
  static SUPERFORMULA        = 21;

  constructor(theForm = Mesh.CUSTOM, theUNum = 50, theVNum = 50, theUMin = -Math.PI, theUMax = Math.PI, theVMin = -Math.PI, theVMax = Math.PI) {
    this.form = Mesh.PARABOLOID;
    if (theForm >= 0) {
      this.form = theForm;
    }

    this.uMin = theUMin;
    this.uMax = theUMax;
    this.uCount = Math.max(theUNum, 1);

    this.vMin = theVMin;
    this.vMax = theVMax;
    this.vCount = Math.max(theVNum, 1);

    this.params = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    this.drawMode = TRIANGLE_STRIP;
    this.minHue = 0;
    this.maxHue = 0;
    this.minSaturation = 0;
    this.maxSaturation = 0;
    this.minBrightness = 50;
    this.maxBrightness = 50;
    this.meshAlpha = 100;

    this.meshDistortion = 0;

    this.points = [];

    this.update();
  }

  // ------ calculate points ------
  update() {
    this.points = new Array(this.vCount + 1);
    for (let i = 0; i <= this.vCount; i++) {
      this.points[i] = new Array(this.uCount + 1);
    }

    let u, v;
    for (let iv = 0; iv <= this.vCount; iv++) {
      for (let iu = 0; iu <= this.uCount; iu++) {
        u = map(iu, 0, this.uCount, this.uMin, this.uMax);
        v = map(iv, 0, this.vCount, this.vMin, this.vMax);

        switch(this.form) {
          case Mesh.CUSTOM: 
            this.points[iv][iu] = this.calculatePoints(u, v);
            break;
          case Mesh.TUBE: 
            this.points[iv][iu] = this.Tube(u, v);
            break;
          case Mesh.SPHERE: 
            this.points[iv][iu] = this.Sphere(u, v);
            break;
          case Mesh.TORUS: 
            this.points[iv][iu] = this.Torus(u, v);
            break;
          case Mesh.PARABOLOID: 
            this.points[iv][iu] = this.Paraboloid(u, v);
            break;
          case Mesh.STEINBACHSCREW: 
            this.points[iv][iu] = this.SteinbachScrew(u, v);
            break;
          case Mesh.SINE: 
            this.points[iv][iu] = this.Sine(u, v);
            break;
          case Mesh.FIGURE8TORUS: 
            this.points[iv][iu] = this.Figure8Torus(u, v);
            break;
          case Mesh.ELLIPTICTORUS: 
            this.points[iv][iu] = this.EllipticTorus(u, v);
            break;
          case Mesh.CORKSCREW: 
            this.points[iv][iu] = this.Corkscrew(u, v);
            break;
          case Mesh.BOHEMIANDOME: 
            this.points[iv][iu] = this.BohemianDome(u, v);
            break;
          case Mesh.BOW: 
            this.points[iv][iu] = this.Bow(u, v);
            break;
          case Mesh.MAEDERSOWL: 
            this.points[iv][iu] = this.MaedersOwl(u, v);
            break;
          case Mesh.ASTROIDALELLIPSOID: 
            this.points[iv][iu] = this.AstroidalEllipsoid(u, v);
            break;
          case Mesh.TRIAXIALTRITORUS: 
            this.points[iv][iu] = this.TriaxialTritorus(u, v);
            break;
          case Mesh.LIMPETTORUS: 
            this.points[iv][iu] = this.LimpetTorus(u, v);
            break;
          case Mesh.HORN: 
            this.points[iv][iu] = this.Horn(u, v);
            break;
          case Mesh.SHELL: 
            this.points[iv][iu] = this.Shell(u, v);
            break;
          case Mesh.KIDNEY: 
            this.points[iv][iu] = this.Kidney(u, v);
            break;
          case Mesh.LEMNISCAPE: 
            this.points[iv][iu] = this.Lemniscape(u, v);
            break;
          case Mesh.TRIANGULOID: 
            this.points[iv][iu] = this.Trianguloid(u, v);
            break;
          case Mesh.SUPERFORMULA: 
            this.points[iv][iu] = this.Superformula(u, v);
            break;
          default:
            this.points[iv][iu] = this.calculatePoints(u, v);
            break;          
        }
      }
    }
  }

  // ------ getters and setters ------
  getForm() { return this.form; }
  setForm(theValue) { this.form = theValue; }

  getFormName() {
    switch(this.form) {
      case Mesh.CUSTOM: return "Custom";
      case Mesh.TUBE: return "Tube";
      case Mesh.SPHERE: return "Sphere";
      case Mesh.TORUS: return "Torus";
      case Mesh.PARABOLOID: return "Paraboloid";
      case Mesh.STEINBACHSCREW: return "Steinbach Screw";
      case Mesh.SINE: return "Sine";
      case Mesh.FIGURE8TORUS: return "Figure 8 Torus";
      case Mesh.ELLIPTICTORUS: return "Elliptic Torus";
      case Mesh.CORKSCREW: return "Corkscrew";
      case Mesh.BOHEMIANDOME: return "Bohemian Dome";
      case Mesh.BOW: return "Bow";
      case Mesh.MAEDERSOWL: return "Maeders Owl";
      case Mesh.ASTROIDALELLIPSOID: return "Astoidal Ellipsoid";
      case Mesh.TRIAXIALTRITORUS: return "Triaxial Tritorus";
      case Mesh.LIMPETTORUS: return "Limpet Torus";
      case Mesh.HORN: return "Horn";
      case Mesh.SHELL: return "Shell";
      case Mesh.KIDNEY: return "Kidney";
      case Mesh.LEMNISCAPE: return "Lemniscape";
      case Mesh.TRIANGULOID: return "Trianguloid";
      case Mesh.SUPERFORMULA: return "Superformula";
    }
    return "";
  }

  getUMin() { return this.uMin; }
  setUMin(theValue) { this.uMin = theValue; }
  getUMax() { return this.uMax; }
  setUMax(theValue) { this.uMax = theValue; }
  getUCount() { return this.uCount; }
  setUCount(theValue) { this.uCount = theValue; }
  
  getVMin() { return this.vMin; }
  setVMin(theValue) { this.vMin = theValue; }
  getVMax() { return this.vMax; }
  setVMax(theValue) { this.vMax = theValue; }
  getVCount() { return this.vCount; }
  setVCount(theValue) { this.vCount = theValue; }

  getParams() { return this.params; }
  setParams(theValues) { this.params = theValues; }
  getParam(theIndex) { return this.params[theIndex]; }
  setParam(theIndex, theValue) { this.params[theIndex] = theValue; }

  getDrawMode() { return this.drawMode; }
  setDrawMode(theMode) { this.drawMode = theMode; }

  getMeshDistortion() { return this.meshDistortion; }
  setMeshDistortion(theValue) { this.meshDistortion = theValue; }

  setColorRange(theMinHue, theMaxHue, theMinSaturation, theMaxSaturation, theMinBrightness, theMaxBrightness, theMeshAlpha) {
    this.minHue = theMinHue;
    this.maxHue = theMaxHue;
    this.minSaturation = theMinSaturation;
    this.maxSaturation = theMaxSaturation;
    this.minBrightness = theMinBrightness;
    this.maxBrightness = theMaxBrightness;
    this.meshAlpha = theMeshAlpha;
  }

  getMinHue() { return this.minHue; }
  setMinHue(minHue) { this.minHue = minHue; }
  getMaxHue() { return this.maxHue; }
  setMaxHue(maxHue) { this.maxHue = maxHue; }
  getMinSaturation() { return this.minSaturation; }
  setMinSaturation(minSaturation) { this.minSaturation = minSaturation; }
  getMaxSaturation() { return this.maxSaturation; }
  setMaxSaturation(maxSaturation) { this.maxSaturation = maxSaturation; }
  getMinBrightness() { return this.minBrightness; }
  setMinBrightness(minBrightness) { this.minBrightness = minBrightness; }
  getMaxBrightness() { return this.maxBrightness; }
  setMaxBrightness(maxBrightness) { this.maxBrightness = maxBrightness; }
  getMeshAlpha() { return this.meshAlpha; }
  setMeshAlpha(meshAlpha) { this.meshAlpha = meshAlpha; }

  // ------ functions for calculating the mesh points ------

  calculatePoints(u, v) {
    let x = u;
    let y = v;
    let z = 0;
    return createVector(x, y, z);
  }

  defaultForm(u, v) {
    let x = u;
    let y = v;
    let z = 0;
    return createVector(x, y, z);
  }

  Tube(u, v) {
    let x = sin(u);
    let y = this.params[0] * v;
    let z = cos(u);
    return createVector(x, y, z);
  }

  Sphere(u, v) {
    v /= 2;
    v += HALF_PI;
    let x = 2 * (sin(v) * sin(u));
    let y = 2 * (this.params[0] * cos(v));
    let z = 2 * (sin(v) * cos(u));
    return createVector(x, y, z);
  }

  Torus(u, v) {
    let x = 1 * ((this.params[1] + 1 + this.params[0] * cos(v)) * sin(u));
    let y = 1 * (this.params[0] * sin(v));
    let z = 1 * ((this.params[1] + 1 + this.params[0] * cos(v)) * cos(u));
    return createVector(x, y, z);
  }

  Paraboloid(u, v) {
    let pd = this.params[0]; 
    if (pd === 0) {
      pd = 0.0001; 
    }
    let x = this.power((v/pd), 0.5) * sin(u);
    let y = v;
    let z = this.power((v/pd), 0.5) * cos(u);
    return createVector(x, y, z);
  }

  SteinbachScrew(u, v) {
    let x = u * cos(v);
    let y = u * sin(this.params[0] * v);
    let z = v * cos(u);
    return createVector(x, y, z);
  }

  Sine(u, v) {
    let x = 2 * sin(u);
    let y = 2 * sin(this.params[0] * v);
    let z = 2 * sin(u+v);
    return createVector(x, y, z);
  }

  Figure8Torus(u, v) {
    let x = 1.5 * cos(u) * (this.params[0] + sin(v) * cos(u) - sin(2*v) * sin(u) / 2);
    let y = 1.5 * sin(u) * (this.params[0] + sin(v) * cos(u) - sin(2*v) * sin(u) / 2) ;
    let z = 1.5 * sin(u) * sin(v) + cos(u) * sin(2*v) / 2;
    return createVector(x, y, z);
  }

  EllipticTorus(u, v) {
    let x = 1.5 * (this.params[0] + cos(v)) * cos(u);
    let y = 1.5 * (this.params[0] + cos(v)) * sin(u) ;
    let z = 1.5 * sin(v) + cos(v);
    return createVector(x, y, z);
  }

  Corkscrew(u, v) {
    let x = cos(u) * cos(v);
    let y = sin(u) * cos(v);
    let z = sin(v) + this.params[0] * u;
    return createVector(x, y, z);
  }

  BohemianDome(u, v) {
    let x = 2 * cos(u);
    let y = 2 * sin(u) + this.params[0] * cos(v);
    let z = 2 * sin(v);
    return createVector(x, y, z);
  }

  Bow(u, v) {
    u /= TWO_PI;
    v /= TWO_PI;
    let x = (2 + this.params[0] * sin(TWO_PI * u)) * sin(2 * TWO_PI * v);
    let y = (2 + this.params[0] * sin(TWO_PI * u)) * cos(2 * TWO_PI * v);
    let z = this.params[0] * cos(TWO_PI * u) + 3 * cos(TWO_PI * v);
    return createVector(x, y, z);
  }

  MaedersOwl(u, v) {
    let x = 0.4 * (v * cos(u) - 0.5 * this.params[0] * this.power(v,2) * cos(2 * u));
    let y = 0.4 * (-v * sin(u) - 0.5 * this.params[0] * this.power(v,2) * sin(2 * u));
    let z = 0.4 * (4 * this.power(v,1.5) * cos(3 * u / 2) / 3);
    return createVector(x, y, z);
  }

  AstroidalEllipsoid(u, v) {
    u /= 2;
    let x = 3 * this.power(cos(u)*cos(v), 3*this.params[0]);
    let y = 3 * this.power(sin(u)*cos(v), 3*this.params[0]);
    let z = 3 * this.power(sin(v), 3*this.params[0]);
    return createVector(x, y, z);
  }

  TriaxialTritorus(u, v) {
    let x = 1.5 * sin(u) * (1 + cos(v));
    let y = 1.5 * sin(u + TWO_PI / 3 * this.params[0]) * (1 + cos(v + TWO_PI / 3 * this.params[0]));
    let z = 1.5 * sin(u + 2*TWO_PI / 3 * this.params[0]) * (1 + cos(v + 2*TWO_PI / 3 * this.params[0]));
    return createVector(x, y, z);
  }

  LimpetTorus(u, v) {
    let x = 1.5 * this.params[0] * cos(u) / (sqrt(2) + sin(v));
    let y = 1.5 * this.params[0] * sin(u) / (sqrt(2) + sin(v));
    let z = 1.5 * 1 / (sqrt(2) + cos(v));
    return createVector(x, y, z);
  }

  Horn(u, v) {
    u /= PI;
    let x = (2*this.params[0] + u * cos(v)) * sin(TWO_PI * u);
    let y = (2*this.params[0] + u * cos(v)) * cos(TWO_PI * u) + 2 * u;
    let z = u * sin(v);
    return createVector(x, y, z);
  }

  Shell(u, v) {
    let x = this.params[1] * (1 - (u / TWO_PI)) * cos(this.params[0]*u) * (1 + cos(v)) + this.params[3] * cos(this.params[0]*u);
    let y = this.params[1] * (1 - (u / TWO_PI)) * sin(this.params[0]*u) * (1 + cos(v)) + this.params[3] * sin(this.params[0]*u);
    let z = this.params[2] * (u / TWO_PI) + this.params[0] * (1 - (u / TWO_PI)) * sin(v);
    return createVector(x, y, z);
  }

  Kidney(u, v) {
    u /= 2;
    let x = cos(u) * (this.params[0]*3*cos(v) - cos(3*v));
    let y = sin(u) * (this.params[0]*3*cos(v) - cos(3*v));
    let z = 3 * sin(v) - sin(3*v);
    return createVector(x, y, z);
  }

  Lemniscape(u, v) {
    u /= 2;
    let cosvSqrtAbsSin2u = cos(v)*sqrt(abs(sin(2*this.params[0]*u)));
    let x = cosvSqrtAbsSin2u*cos(u);
    let y = cosvSqrtAbsSin2u*sin(u);
    let z = 3 * (this.power(x,2) - this.power(y,2) + 2 * x * y * this.power(tan(v),2));
    x *= 3;
    y *= 3;
    return createVector(x, y, z);
  }

  Trianguloid(u, v) {
    let x = 0.75 * (sin(3*u) * 2 / (2 + cos(v)));
    let y = 0.75 * ((sin(u) + 2 * this.params[0] * sin(2*u)) * 2 / (2 + cos(v + TWO_PI)));
    let z = 0.75 * ((cos(u) - 2 * this.params[0] * cos(2*u)) * (2 + cos(v)) * ((2 + cos(v + TWO_PI/3))*0.25));
    return createVector(x, y, z);
  }

  Superformula(u, v) {
    v /= 2;

    // Superformel 1
    let a = this.params[0];
    let b = this.params[1];
    let m = this.params[2];
    let n1 = this.params[3];
    let n2 = this.params[4];
    let n3 = this.params[5];
    let r1 = pow(pow(abs(cos(m*u/4)/a), n2) + pow(abs(sin(m*u/4)/b), n3), -1/n1);

    // Superformel 2
    a = this.params[6];
    b = this.params[7];
    m = this.params[8];
    let n1_2 = this.params[9];
    let n2_2 = this.params[10];
    let n3_2 = this.params[11];
    let r2 = pow(pow(abs(cos(m*v/4)/a), n2_2) + pow(abs(sin(m*v/4)/b), n3_2), -1/n1_2);

    let x = 2 * (r1*sin(u) * r2*cos(v));
    let y = 2 * (r2*sin(v));
    let z = 2 * (r1*cos(u) * r2*cos(v));

    return createVector(x, y, z);
  }

  // ------ definition of some mathematical functions ------

  power(b, e) {
    if (b >= 0 || Math.floor(e) === e) {
      return pow(b, e);
    } else {
      return -pow(-b, e);
    }
  }

  logE(v) {
    if (v >= 0) {
      return log(v);
    } else {
      return -log(-v);
    }
  }

  sinh(a) {
    return sin(HALF_PI/2-a);
  }

  cosh(a) {
    return cos(HALF_PI/2-a);
  }

  tAnh(a) {
    return tan(HALF_PI/2-a);
  }

  // ------ draw mesh ------
  draw() {
    let iuMax, ivMax;

    if (this.drawMode === QUADS || this.drawMode === TRIANGLES) {
      iuMax = this.uCount - 1;
      ivMax = this.vCount - 1;
    } else {
      iuMax = this.uCount;
      ivMax = this.vCount - 1;
    }

    push();
    colorMode(HSB, 360, 100, 100, 100);

    let minH = this.minHue;
    let maxH = this.maxHue;
    if (abs(maxH - minH) < 20) maxH = minH;
    let minS = this.minSaturation;
    let maxS = this.maxSaturation;
    if (abs(maxS - minS) < 10) maxS = minS;
    let minB = this.minBrightness;
    let maxB = this.maxBrightness;
    if (abs(maxB - minB) < 10) maxB = minB;

    let getVec = (iv, iu, r1, r2, r3) => createVector(this.points[iv][iu].x + r1, this.points[iv][iu].y + r2, this.points[iv][iu].z + r3);
    let v1, v2, v3, v4, nVec;

    for (let iv = 0; iv <= ivMax; iv++) {
      if (this.drawMode === TRIANGLES) {
        for (let iu = 0; iu <= iuMax; iu++) {
          fill(random(minH, maxH), random(minS, maxS), random(minB, maxB), this.meshAlpha);
          beginShape(this.drawMode);
          let r1 = this.meshDistortion * random(-1, 1);
          let r2 = this.meshDistortion * random(-1, 1);
          let r3 = this.meshDistortion * random(-1, 1);
          
          v1 = getVec(iv, iu, r1, r2, r3);
          v2 = getVec(iv+1, iu+1, r1, r2, r3);
          v3 = getVec(iv+1, iu, r1, r2, r3);
          nVec = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
          normal(nVec.x, nVec.y, nVec.z);
          
          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();

          fill(random(minH, maxH), random(minS, maxS), random(minB, maxB), this.meshAlpha);
          beginShape(this.drawMode);
          r1 = this.meshDistortion * random(-1, 1);
          r2 = this.meshDistortion * random(-1, 1);
          r3 = this.meshDistortion * random(-1, 1);
          
          v1 = getVec(iv+1, iu+1, r1, r2, r3);
          v2 = getVec(iv, iu, r1, r2, r3);
          v3 = getVec(iv, iu+1, r1, r2, r3);
          nVec = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
          normal(nVec.x, nVec.y, nVec.z);

          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          endShape();
        }       
      } else if (this.drawMode === QUADS) {
        for (let iu = 0; iu <= iuMax; iu++) {
          fill(random(minH, maxH), random(minS, maxS), random(minB, maxB), this.meshAlpha);
          beginShape(this.drawMode);
          let r1 = this.meshDistortion * random(-1, 1);
          let r2 = this.meshDistortion * random(-1, 1);
          let r3 = this.meshDistortion * random(-1, 1);
          
          v1 = getVec(iv, iu, r1, r2, r3);
          v2 = getVec(iv+1, iu, r1, r2, r3);
          v3 = getVec(iv+1, iu+1, r1, r2, r3);
          v4 = getVec(iv, iu+1, r1, r2, r3);
          
          nVec = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v4, v1)).normalize();
          normal(nVec.x, nVec.y, nVec.z);

          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
          vertex(v3.x, v3.y, v3.z);
          vertex(v4.x, v4.y, v4.z);
          endShape();
        }        
      } else {
        // Draw Strips
        fill(random(minH, maxH), random(minS, maxS), random(minB, maxB), this.meshAlpha);
        beginShape(this.drawMode);
        for (let iu = 0; iu <= iuMax; iu++) {
          let r1 = this.meshDistortion * random(-1, 1);
          let r2 = this.meshDistortion * random(-1, 1);
          let r3 = this.meshDistortion * random(-1, 1);
          
          v1 = getVec(iv, iu, r1, r2, r3);
          v2 = getVec(iv+1, iu, r1, r2, r3);
          
          if (iu < iuMax) {
            v3 = getVec(iv, iu+1, 0, 0, 0); // peek next
            nVec = p5.Vector.sub(v2, v1).cross(p5.Vector.sub(v3, v1)).normalize();
            // normal is set per vertex for light to reflect off smoothly or flatly depending on normal vector direction.
            normal(-nVec.x, -nVec.y, -nVec.z); 
          }
          
          vertex(v1.x, v1.y, v1.z);
          vertex(v2.x, v2.y, v2.z);
        }  
        endShape();
      }
    }

    pop();
  }

}
