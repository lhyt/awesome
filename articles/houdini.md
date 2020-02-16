# 0. 前言
平时写CSS，感觉有很多多余的代码或者不好实现的方法，于是有了预处理器的解决方案，主旨是write less &do more。其实原生css中，用上css变量也不差，加上bem命名规则只要嵌套不深也能和less、sass的嵌套媲美。在一些动画或者炫酷的特效中，不用js的话可能是用了css动画、svg的animation、过渡，复杂动画实现用了js的话可能用了canvas、直接修改style属性。用js的，然后有没有想过一个问题：“要是canvas那套放在dom上就爽了”。因为复杂的动画频繁操作了dom，违背了倒背如流的“性能优化之一：尽量少操作dom”的规矩，嘴上说着不要，手倒是很诚实地`ele.style.prop = <newProp>`，可是要实现效果这又是无可奈何或者大大减小工作量的方法。

我们都知道，浏览器渲染的流程:解析html和css（parse），样式计算（style calculate），布局（layout），绘制（paint），合并（composite），修改了样式，改的环节越深代价越大。js改变样式，首先是操作dom，整个渲染流程马上重新走，可能走到样式计算到合并环节之间，代价大，性能差。然后痛点就来了，浏览器有没有能直接操作前面这些环节的方法呢而不是依靠js？有没有方法不用js操作dom改变style或者切换class来改变样式呢？

于是就有CSS Houdini了，它是W3C和那几个顶级公司的工程师组成的小组，让开发者可以通过新api操作CSS引擎，带来更多的自由度，让整个渲染流程都可以被开发者控制。上面的问题，不用js就可以实现曾经需要js的效果，而且只在渲染过程中，就已经按照开发者的代码渲染出结果，而不是渲染完成了再重新用js强行走一遍流程。

> [关于houdini最近动态可点击这里](https://drafts.css-houdini.org/)
上次CSS大会知道了有Houdini的存在，那时候只有cssom，layout和paint api。前几天突然发现，Animation api也有了，不得不说，以后很可能是Houdini遍地开花的时代，现在得进一步了解一下了。**一句话：这是css in js到js in css的转变**

# 1. CSS变量
如果你用less、sass只为了人家有变量和嵌套，那用原生css也是差不多的，因为原生css也有变量：

比如定义一个全局变量--color（css变量双横线开头）
```css
:root {
  --color: #f00;
}
```
使用的时候只要var一下
```css
.f{
  color: var(--color);
}
```
我们的html：
```html
<div class="f">123</div>
```
于是，红色的123就出来了。

css变量还和js变量一样，有作用域的：
```css
:root {
  --color: #f00;
}

.f {
  --color: #aaa
} 

.g{
  color: var(--color);
}

.ft {
  color: var(--color);
}
```
html：
```html
        <div className="f">
          <div className="ft">123</div>
        </div>
        <div className="">
          <div className="g">123</div>
        </div>
```
于是，是什么效果你应该也很容易就猜出来了：
![image](https://user-gold-cdn.xitu.io/2018/10/31/166c5f4e511e23f0?w=74&h=80&f=png&s=3279)

css能搞变量的话，我们就可以做到修改一处牵动多处的变动。比如我们做一个像准星一样的四个方向用准线锁定鼠标位置的效果：
![image](https://user-gold-cdn.xitu.io/2018/10/31/166c5f4e5124e27a?w=1496&h=1250&f=png&s=46032)
用css变量的话，比传统一个个元素设置style优雅多了：
```html
<div id="shadow">
    <div class="x"></div>
    <div class="y"></div>
    <div class="x_"></div>
    <div class="y_"></div>
  </div>
```

```css
  :root{
    --x: 0px;
    --y: 0px;
  }
  body{
    margin: 0
  }
#shadow{
  width: 50%;
  height: 600px;
  border: #000 1px solid;
  position: relative;
  margin: 0;
}

.x, .y, .x_, .y_ {
  position: absolute;
  border: #f00 2px solid;
}

.x {
  top: 0;
  left: var(--x);
  height: 20px;
  width: 0;
}
.y {
  top: var(--y);
  left: 0;
  height: 0;
  width: 20px;
}
.x_ {
  top: 600px;
  left: var(--x);
  height: 20px;
  width: 0;
}
.y_ {
  top: var(--y);
  left: 100%;
  height: 0;
  width: 20px;
}
```

```javascript
const style = document.documentElement.style
shadow.addEventListener('mousemove', e => {
  style.setProperty(`--x`, e.clientX + 'px')
  style.setProperty(`--y`, e.clientY + 'px')
})
```

那么，对于github的404页面这种内容和鼠标位置有关的页面，思路是不是一下子就出来了

# 2. CSS type OM
都有DOM了，那CSSOM也理所当然存在。我们平时改变css的时候，通常是直接修改style或者切换类，实际上就是操作DOM来间接操作CSSOM，而type om是一种把css的属性和值存在attributeStyleMap对象中，我们只要直接操作这个对象就可以做到之前的js改变css的操作。另外一个很重要的点，attributeStyleMap存的是css的数值而不是字符串，而且支持各种算数以及单位换算，比起操作字符串，性能明显更优。

> 接下来，基本脱离不了window下的CSS这个属性。在使用的时候，首先，我们可以采取渐进式的做法： `if('CSS' in window){...}`
## 2.1 单位
```javascript
CSS.px(1); // 1px  返回的结果是：CSSUnitValue {value: 1, unit: "px"}
CSS.number(0); // 0  比如top：0，也经常用到
CSS.rem(2); //2rem
new CSSUnitValue(2, 'percent'); // 还可以用构造函数，这里的结果就是2%
// 其他单位同理
```

## 2.2 数学运算
自己在控制台输入CSSMath，可以看见的提示，就是数学运算
```javascript
new CSSMathSum(CSS.rem(10), CSS.px(-1)) // calc(10rem - 1px)，要用new不然报错
new CSSMathMax(CSS.px(1),CSS.px(2)) // 顾名思义，就是较大值，单位不同也可以进行比较
```

## 2.3 怎么用
既然是新的东西，那就有它的使用规则。

- 获取值`element.attributeStyleMap.get(attributeName)`，返回一个CSSUnitValue对象
- 设置值`element.attributeStyleMap.set(attributeName, newValue)`，设置值，传入的值可以是css值字符串或者是CSSUnitValue对象

当然，第一次get是返回null的，因为你都没有set过。“那我还是要用一下getComputedStyle再set咯，这还不是和之前的差不多吗？”

实际上，有一个类似的方法：`element.computedStyleMap`，返回的是CSSUnitValue对象，这就ok了。我们拿前面的第一部分CSS变量的代码测试一波
```javascript
document.querySelector('.x').computedStyleMap().get('height') // CSSUnitValue {value: 20, unit: "px"}
document.querySelector('.x').computedStyleMap().set('height', CSS.px(0)) // 不见了
```

# 3. paint API
paint、animation、layout API都是以worker的形式工作，具体有几个步骤：
- 建立一个worker.js，比如我们想用paint API，先在这个js文件注册这个模块registerPaint('mypaint', class)，这个class是一个类下面具体讲到
- 在html引入CSS.paintWorklet.addModule('worker.js')
- 在css中使用，background: paint(mypaint)
主要的逻辑，全都写在传入registerPaint的class里面。paint API很像canvas那套，实际上可以当作自己画一个img。既然是img，那么在所有的能用到图片url的地方都适合用paint API，比如我们来自己画一个有点炫酷的背景(满屏随机颜色方块)。有空的话可以想一下js怎么做，再对比一下paint API的方案。
![image](https://user-gold-cdn.xitu.io/2018/10/31/166c5f4e51149fd6?w=1708&h=1204&f=png&s=43306)

```javascript
// worker.js
class RandomColorPainter {
    // 可以获取的css属性，先写在这里
    // 我这里定义宽高和间隔，从css获取
    static get inputProperties() {
        return ['--w', '--h', '--spacing'];
      }
      /**
       * 绘制函数paint，最主要部分
       * @param {PaintRenderingContext2D} ctx 类似canvas的ctx
       * @param {PaintSize} PaintSize 绘制范围大小(px) { width, height }
       * @param {StylePropertyMapReadOnly} props 前面inputProperties列举的属性，用get获取
       */
    paint(ctx, PaintSize, props) {
        const w = props.get('--w') && +props.get('--w')[0].trim() || 30;
        const h = props.get('--h') && +props.get('--h')[0].trim() || 30;
        const spacing = +props.get('--spacing')[0].trim() || 10;
        
        for (let x = 0; x < PaintSize.width / w; x++) {
            for (let y = 0; y < PaintSize.height / h; y++) {
                ctx.fillStyle = `#${Math.random().toString(16).slice(2, 8)}`
                ctx.beginPath();
                ctx.rect(x * (w + spacing), y * (h + spacing), w, h);
                ctx.fill();
            }
        }
    }
}

registerPaint('randomcolor', RandomColorPainter);
```
接着我们需要引入该worker：
> `CSS && CSS.paintWorklet.addModule('worker.js'); `

最后我们在一个class为paint的div应用样式：
```css
.paint{
  background-image: paint(randomcolor);
  width: 100%;
  height: 600px;
  color: #000;
  --w: 50;
  --h: 50;
  --spacing: 10;
}
```
再想想用js+div，是不是要先动态生成n个，然后各种计算各种操作dom，想想就可怕。如果是canvas，这可是canvas背景，你又要在上面放一个div，而且还要定位一波。
> 注意： worker是没有window的，所以想搞动画的就不能内部消化了。不过可以靠外面的css变量，我们用js操作css变量可以解决，也比传统的方法优雅

[可以来我的githubio看看效果](https://lhyt.github.io/src/houdini/index.html)

# 4.  自定义属性
> 支持情况 [点击这里查看](https://ishoudinireadyyet.com/)
首先，看一下支持度，目前浏览器并没有完全稳定使用，所以需要跟着它的提示：`Experimental Web Platform features” on chrome://flags`，在chrome地址栏输入`chrome://flags`再找到`Experimental Web Platform features`并开启。

```javascript
CSS.registerProperty({
    name: '--myprop', //属性名字
    syntax: '<length>', // 什么类型的单位，这里是长度
    initialValue: '1px', // 默认值
    inherits: true // 会不会继承，true为继承父元素
  }); 
```
说到继承，我们回到前面的css变量，已经说了变量是区分作用域的，其实父作用域定义变量，子元素使用该变量实际上是继承的作用。如果`inherits: true`那就是我们看见的作用域的效果，如果不是true则不会被父作用域影响，而且取默认值。

这个自定义属性，精辟在于，可以用永久循环的animation驱动一次性的transform。换句话说，我们如果用了css变量+transform，可以靠js改变这个变量达到花俏的效果。但是，现在不需要js，只要css内部消化，transform成为永动机。
```javascript
// 我们先注册几种属性
  ['x1','y1','z1','x2','y2','z2'].forEach(p => {
      CSS.registerProperty({
        name: `--${p}`,
        syntax: '<angle>',
        inherits: false,
        initialValue: '0deg'
      });
    });
```
然后写个样式
```css
#myprop, #myprop1 {
  width: 200px;
  border: 2px dashed #000;
  border-bottom: 10px solid #000;
  animation:myprop 3000ms alternate infinite ease-in-out;
  transform: 
    rotateX(var(--x2))
    rotateY(var(--y2))
    rotateZ(var(--z2))
}
```
再来看看我们的动画，为了眼花缭乱，加了第二个改了一点数据的动画
```css
@keyframes myprop {
  25% {
    --x1: 20deg;
    --y1: 30deg;
    --z1: 40deg;
  }
  50% {
    --x1: -20deg;
    --z1: -40deg;
    --y1: -30deg;
  }
  75% {
    --x2: -200deg;
    --y2: 130deg;
    --z2: -350deg;
  }
  100% {
    --x1: -200deg;
    --y1: 130deg;
    --z1: -350deg;
  }
}

@keyframes myprop1 {
  25% {
    --x1: 20deg;
    --y1: 30deg;
    --z1: 40deg;
  }
  50% {
    --x2: -200deg;
    --y2: 130deg;
    --z2: -350deg;
  }
  75% {
    --x1: -20deg;
    --z1: -40deg;
    --y1: -30deg;
  }
  100% {
    --x1: -200deg;
    --y1: 130deg;
    --z1: -350deg;
  }
}
```
html就两个div:
```html
  <div id="myprop"></div>
  <div id="myprop1"></div>
```
效果是什么呢，自己可以跑一遍看看，反正功能很强大，但是想象力限制了发挥。

> 自己动手改的时候注意一下，动画关键帧里面，不能只存在1，那样子就不能驱动transform了，做不到永动机的效果，因为我的rotate写的是 rotateX(var(--x2))。接下来随意发挥吧


# 最后
再啰嗦一次
- [关于houdini最近动态可点击这里](https://drafts.css-houdini.org/)
- [关于houdini在浏览器的支持情况](https://ishoudinireadyyet.com/)
> ENJOY YOURSELF!!!