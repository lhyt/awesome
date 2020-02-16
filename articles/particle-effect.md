> 满天星斗、炫动的粒子、大量的元素交互，看起来是很炫酷。作为前端工程师，看见大量的节点，花哨的动画，忽然为浏览器感到心疼。前端工程师，身为一位圆梦者，如何实现出来，而且效果炫酷呢？下面，我们基于threejs进行逐步进行探究


[codesandbox demo地址](https://codesandbox.io/embed/static-gjtyz?fontsize=14&hidenavigation=1&theme=dark)





# 如何构建粒子世界
## 基于THREE.CSS3dObject

![](https://user-gold-cdn.xitu.io/2019/12/1/16ebd7a1ef45c7fb?w=640&h=400&f=gif&s=199285)

CSS3dObject这个对象，可以让我们像操作threejs对象那样来操作div，使用threejs丰富的api来实现css+div的3d效果。实际上最终效果就是把threejs的参数转化为css的matrix。我们看一段简单的代码，这是创建一个div元素，然后使用three的api控制它的位置：
```js
      const element = document.createElement("div");
      element.className = "element";
      element.style.width = "4px";
      element.style.height = "4px";
      element.style.borderRadius = "50%";
      const object = new THREE.CSS3DObject(element);

      // 使用threejs的api
      object.position.x = x;
      object.position.y = y;
      object.position.z = z || 0;
```

当然，这些代码还不足以渲染出来，因为three还是得使用three那套流程：场景、相机、渲染器，将物体加入场景，渲染器render。这样子，才能让3d世界展示眼前
```js
// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 2000;
// 渲染器
const renderer = new THREE.CSS3DRenderer();
// 把对象加入场景
scene.add(object);
// 渲染
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
```

结果是一个个div:
![](https://user-gold-cdn.xitu.io/2019/12/1/16ebd7393b1d3ed0?w=1080&h=459&f=png&s=483599)

[最终效果](https://gjtyz.csb.app/sphere.html)


> 适用场景：量级为几十，炫酷的、具有交互的页面元素。


## 基于THREE的粒子系统

![](https://user-gold-cdn.xitu.io/2019/12/1/16ebd7a6420c3d6f?w=640&h=400&f=gif&s=448133)
使用`THREE.Points`粒子系统实现
```js
// 球坐标下的标准球方程
// 这里是球坐标和直角坐标的转换
// size相当于球坐标的r
const getSphere = (i, count, size) => {
  const phi = Math.acos(-1 + (2 * i) / count);
  const theta = Math.sqrt(count * Math.PI) * phi;
  return {
    x: size * Math.cos(theta) * Math.sin(phi),
    y: size * Math.sin(theta) * Math.sin(phi),
    z: -size * Math.cos(phi)
  };
};

const color = new THREE.Color();
// 1000 个点
for (let i = 0; i < 1000; i++) {
  // 获取点的坐标
  const { x, y, z } = getSphere(i, 1000, 500);
  positions.push(x, y, z);
  // 设置颜色
  color.setRGB(2 * Math.random(), 2 * Math.random(), 2 * Math.random());
  colors.push(color.r, color.g, color.b);
}
// 创建缓冲几何体
const geometry = new THREE.BufferGeometry();
// 给几何体加上属性，一些版本的设置属性函数的名称为setAttribute
// positions: [x1, y1, z1, x2, y2, z2, ...]
geometry.addAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
// colors: [r1, g1, b1, r2, g2, b2, ...]
geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

// 给粒子系统加入PointsMaterial材料
const points = new THREE.Points(
  geometry,
  new THREE.PointsMaterial({
    size: 20, // 粒子大小
    vertexColors: THREE.VertexColors // 使用顶点颜色
  })
);
scene.add(points);

// 动起来，体验一下立体感
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  points.rotation.x += 0.0025;
  points.rotation.y += 0.005;
  renderer.render(scene, camera);
}
```
此时，可以看见由一个个点构成的几何体展示出来了。demo代码在codesandbox的vec.html


> 适用场景：量级大，无细微交互、丰富的粒子变换场景


## 基于paint api
这个不多说，之前我[另一篇文章](https://juejin.im/post/5bd890a2e51d4563b12d433d#heading-6)已经介绍过


![](https://user-gold-cdn.xitu.io/2019/12/1/16ebd76ac1aae0e7?w=1280&h=902&f=png&s=333246)

> 适用场景：chrome浏览器，支持复杂的动画，但只能简单的交互且没有参数输出



# tweenjs
`tweenjs`是一个数据缓动的库，里面有一些内置的缓动函数，通常用于动画。使用方法：
```js
const o = { v: 0 }
new TWEEN.Tween(o)
  .delay(10000) // 延迟10s
  .to({ v: 1 }, 5000) // 5s内把v从0变成1
  .start(); // 执行

```
[tween自带缓动效果预览](https://gjtyz.csb.app/tween.html)

# 与tween结合
## THREE.CSS3dObject与tween结合

基于CSS3dObject实现的，如何动起来？举个例子，一开始，先把全部点放在原点。然后，把这些点缓动成一个球。缓动成球的方法：生成球的坐标点集合，遍历全部在原点的点集，一个个地添加tween，缓动到最终球的坐标点坐标上：
```js
        const count = 60;
// 先放在原点
        Object.assign(object.position, {
          x: 0,
          y: 0,
          z: 0
        });

// 缓动到球的每一个点的坐标上
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        const SIZE = 800;

        new TWEEN.Tween(object.position)
          .delay(1500)
          .to({
            x: SIZE * Math.cos(theta) * Math.sin(phi),
            y: SIZE * Math.sin(theta) * Math.sin(phi),
            z: -SIZE * Math.cos(phi)
          })
          .start();
```
此时，效果也可以想象出来，就是像爆炸一样

demo地址：[https://gjtyz.csb.app/sphere.html](https://gjtyz.csb.app/sphere.html)


## 粒子系统与tween结合
粒子系统使用的是缓冲几何体，我们可以自己给缓冲几何体加上一些自定义属性，然后通过顶点着色器来读取，达到控制顶点属性的效果。

![](https://user-gold-cdn.xitu.io/2019/12/1/16ebd7ae65ccefdf?w=640&h=400&f=gif&s=188340)
### 着色器
webgl的着色器的是gpu执行的，所以性能很好，大量的粒子动态渲染都可以不卡。接下来，我们实现一个位置、大小、颜色同时缓动的粒子特效。参考官方文档，我们修改一下代码，得到满足我们需求的顶点着色器代码：
```c
        attribute float size;
        attribute vec3 position2;
        uniform float lamda; // 自己传入
        uniform float size1; // 自己传入
        void main() {
            vec3 temp;
            temp.x = position.x * lamda + position2.x * (1. - lamda);
            temp.y = position.y * lamda + position2.y * (1. - lamda);
            temp.z = position.z * lamda + position2.z * (1. - lamda);
            vec4 mvPosition = modelViewMatrix * vec4( temp, 1.0 );
            gl_PointSize = size1;
            gl_Position = projectionMatrix * mvPosition;
        }
```
改变颜色的是片元着色器：
```c
// 传入color变量
        uniform vec3 color;
        void main() {
            gl_FragColor = vec4(color, 1.0);
        }
```
### canvas文字转粒子坐标
大概的思路：创建一个canvas，获取ctx，使用ctx写红色字。再遍历getImageData的点，发现是红点，则把红点坐标加入。最终返回结果是Float32Array类型化数组(x1, y1, z1, x2, y2, z2......)，因为THREE的几何体addAttribute的时候需要Float32Array对象
```js
    function getTxtData(str) {
      const c = document.createElement("canvas");
      c.width = innerHeight;
      c.height = innerWidth;
      const t = c.getContext("2d");
      t.fillStyle = "#f00";
      t.font = "150px Georgia";
      t.fillText(str, 100, 100);
      const { data, width, height } = t.getImageData(
        0,
        0,
        innerHeight,
        innerWidth
      );
      const temp = [];
      const gap = 3;
      for (let w = 0; w < width; w += gap) {
        for (let h = 0; h < height; h += gap) {
          const index = (h * width + w) * 4;
          if (data[index] == 255) {
            temp.push(w / 10, -h / 10, 0);
          }
        }
      }
      return new Float32Array(temp);
    }
```
### 给缓冲几何体加上属性&加入tween
```js
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const geometry = new THREE.BufferGeometry();
// 字多的、复杂的，粒子多
      const m = getTxtData("I am here");
      geometry.addAttribute("position", new THREE.BufferAttribute(m, 3));
// 字少的、简单的，粒子少
      const newPositions = getTxtData("lhyt");
      const newLen = newPositions.length;
      const positionArr = geometry.attributes.position.array;

      const positionLen = positionArr.length;
      const position2 = new Float32Array(positionLen);
      position2.set(newPositions);
      // 顶点较少的模型顶点坐标，后半部分从头开始赋值
      // 其实也可以隐藏的，不过重复赋值效果好一些
      for (let i = newLen, j = 0; i < positionLen; i++, j++) {
        position2[i] = newPositions[j];
        position2[i + 1] = newPositions[j + 1];
        position2[i + 2] = newPositions[j + 2];
      }

// position2是第二个状态，粒子多的那个状态
      geometry.addAttribute(
        "position2",
        new THREE.BufferAttribute(position2, 3)
      );
// 给tween用的缓动操作对象
      const o = {
        v: 0,
        s: 1,
        c: 0x00ffff
      };
      let uniforms = {
        // 顶点颜色
        color: {
          type: "v3",
          value: new THREE.Color(o.c)
        },
        // 传递lamda、size1值，用于shader计算顶点位置
        lamda: {
          value: o.v
        },
        size1: {
          value: o.s
        }
      };
      // 着色器材料
      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
        attribute float size;
        attribute vec3 position2;
        uniform float lamda; // 自己传入
        uniform float size1; // 自己传入
        void main() {
            vec3 temp;
// lamda为0，取position；lamda为0，取position2，达到状态切换的效果
            temp.x = position.x * lamda + position2.x * (1. - lamda);
            temp.y = position.y * lamda + position2.y * (1. - lamda);
            temp.z = position.z * lamda + position2.z * (1. - lamda);
// emm，因为需要4维矩阵来运算
            vec4 mvPosition = modelViewMatrix * vec4( temp, 1.0 );
            gl_PointSize = size1;
            gl_Position = projectionMatrix * mvPosition;
        }
        `,
        fragmentShader: `
        uniform vec3 color;
        void main() {
            gl_FragColor = vec4(color, 1.0);
        }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      // 创建粒子系统
      const particleSystem = new THREE.Points(geometry, shaderMaterial);

      scene.add(particleSystem);

      new TWEEN.Tween(o)
        .delay(1000)
        .to({ v: 1, s: 10, c: 0x0000ff }, 2000) // 切换的参数最终状态
        .onUpdate(() => {
// tween更新的时候，把粒子系统的uniforms里面参数也更新，着色器也会根据参数更新
          particleSystem.material.uniforms.lamda.value = o.v;
          particleSystem.material.uniforms.size1.value = o.s;
          particleSystem.material.uniforms.color.value = new THREE.Color(o.c);
        })
        .start();
```


后面就是一些渲染、raf方法，具体代码参考codesandbox的textParticle.html部分的代码

![](https://user-gold-cdn.xitu.io/2019/12/1/16ebd7b1f4fc84ea?w=640&h=400&f=gif&s=320588)

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)