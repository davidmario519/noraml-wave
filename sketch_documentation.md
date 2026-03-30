# Interactive 3D Wave Surface (p5.js)

## 1. 개요 (Overview)
본 스케치(Sketch)는 p5.js의 WEBGL 모드를 이용하여 마우스 위치에 반응하는 3차원 파동 표면(Wave Surface)을 생성합니다. 2차원 그리드상에서 동적으로 Z축 높이를 계산하고 이를 3D 렌더링 파이프라인(`QUAD_STRIP`)에 넘겨줌으로써 연속적이고 부드러운 수면 다이내믹스를 시각화합니다. 특히, 입체적인 3D 조명 효과를 온전히 구현하기 위해 **수학적인 편미분을 통한 동적 법선 벡터(Normal Vector) 연산**을 포함하고 있는 것이 이 구현의 핵심 기술적 특징입니다.

---

## 2. 그리드 초기화 및 좌표 매핑
`setup()` 영역에서는 `50x50` 크기의 2D 정점(Vertex) 그리드를 배열로 생성합니다. `-100`부터 `100`까지의 `u`(x축)와 `v`(y축) 범위를 매핑하여 3D 공간 상에 기준 평면을 선언합니다.

매 프레임(`draw()`) 렌더링에 앞서 마우스 화면 좌표를 3D 공간상의 그리드 좌표계로 보정합니다.
```javascript
let mx = map(mouseX, 0, width, uMin, uMax);
let my = map(mouseY, 0, height, vMin, vMax);
```
이 매핑을 통해 화면상 마우스의 위치가 3D 표면 위 어느 곳에 떨어지는지(투영점)를 정확하게 짚어내 상호작용의 중심점으로 삼습니다.

---

## 3. 파동 발생 알고리즘 (Wave Generation)
파동을 만들어내기 위해 기준점(마우스 교점)으로부터 각 격자점(Grid Point)까지의 **유클리드 거리(`dist()`)** 와 삼각함수 **`sin()`** 을 조합합니다. 중심에서부터 거리에 따라 물결이 진동하는 파동 공식을 사용합니다.

$$ Z(x, y) = \sin(\text{distance} \times \text{freq} - \text{time} \times \text{speed}) \times \text{amplitude} $$

실제 코드는 다음과 같이 구현되어 있습니다.
```javascript
let d = dist(mx, my, pt.x, pt.y);
pt.z = sin(d * 0.2 - frameCount * 0.1) * 3;
```
- **`d * 0.2` (주파수/Frequency)**: 마우스와의 거리를 곱합니다. 여기서 `0.2`는 파동의 촘촘함을 의미하며, 숫자가 커질수록 물결이 좁은 형태가 됩니다.
- **`frameCount * 0.1` (위상 이동/Phase Shift)**: `frameCount`(시간 흐름)를 빼줌으로써 시간이 지남에 따라 파동이 밖으로 퍼져나가는 형태의 애니메이션을 생성합니다.
- **`* 3` (진폭/Amplitude)**: 파동의 상하 높이값 제어합니다. (최대 Z축 높이를 결정)

---

## 4. 입체 조명을 위한 법선 벡터(Normal Vector) 연산
커스텀 형태의 굴곡진 점들을 `beginShape()` ~ `endShape()`로 렌더링하고 여기에 `directionalLight()` 조명을 비출 때 완전한 입체감을 시뮬레이션 하려면, 엔진은 "각 꼭짓점 표면이 어느 방향으로 향해있는지(기울기)" 알고 있어야 합니다. 이를 **법선 벡터(Normal Vector)** 라고 부릅니다. 

곡면의 법선 벡터를 구하기 위해 유한 차분법(Finite Difference Method)을 이용한 **수치적 편미분(Pseudo-Derivative)** 기법을 사용하여 표면의 경사도를 구했습니다.

### 4.1. 수치적 편미분(Gradient) 추출
```javascript
let dX = dist(mx, my, pt.x + 0.1, pt.y);
let dY = dist(mx, my, pt.x, pt.y + 0.1);

let pxZ = sin(dX * 0.2 - frameCount * 0.1) * 3; // X로 살짝 이동했을 때 가상 높이
let pyZ = sin(dY * 0.2 - frame, count * 0.1) * 3; // Y로 살짝 이동했을 때 가상 높이

let dzdx = (pxZ - pt.z) / 0.1;
let dzdy = (pyZ - pt.z) / 0.1;
```
아주 작은 값(`+0.1`)만큼 떨어져 있는 x, y 좌표의 가상 Z고도를 구한 뒤, `변화량 / 0.1` 을 통해 각각 **$x$ 방향 기울기(`dz/dx`)**, **$y$ 방향 기울기(`dz/dy`)** 를 근사해 냅니다.

### 4.2. 3D 벡터 정규화 (Normalization)
수학적 기준 기하에 따르면 곡면의 법선 벡터 $\vec{N}$ 은 기울기 데이터를 반전시킨 $(-\frac{\partial z}{\partial x}, -\frac{\partial z}{\partial y}, 1)$ 의 형태를 가집니다. p5.js 엔진이 오차 없이 정확한 빛(Specular 및 Diffuse) 반사율을 산출해 내려면, 해당 수선의 길이를 `1`로 만들어 주는 정규화(Normalization) 과정이 필요합니다.

```javascript
// 피타고라스 정리에 의한 벡터 크기 (Magnitude)
let mag = sqrt(dzdx*dzdx + dzdy*dzdy + 1);

// 크기로 나눠주어 정규화 벡터 저장 (-nx, -ny, nz 튜플)
pt.nx = -dzdx / mag;
pt.ny = -dzdy / mag;
pt.nz = 1 / mag;
```

---

## 5. 렌더링 및 재질 (Rendering & Material)
좌표 및 법선 벡터의 계산이 모두 완료되면 배열된 정점들을 그물 형태로 출력(`QUAD_STRIP`)합니다. 

```javascript
specularMaterial(200);  // 반짝거리는 광택 재질 선언
shininess(30);          // 스펙큘러 라이트가 맺히는 범위와 선명도 제어

...

// 직전에 연산한 법선 벡터를 알려준 후 vertex 생성
normal(p1.nx, p1.ny, p1.nz);
vertex(p1.x, p1.y, p1.z);
```

점(vertex)을 출력하기 이전에 `normal()` 함수로 법선 데이터를 건네줍니다. `directionalLight()`의 방향과 표면의 법선 벡터가 3D 엔진 내부에서 연산(Dot Product 등)됨으로써, 물결의 볼록한 부분은 하얀 광택을 내고 오목한 부분에는 어두운 그림자 처리가 되는 **다이내믹 입체 물결** 비주얼이 최종 완성됩니다.
