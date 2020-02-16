# 前言
我们如果使用过ppt、keynote，元素的小控件一定少不了，可以实现修改修改宽高和位移，大概是这样

![](https://user-gold-cdn.xitu.io/2020/1/8/16f80f0cc0dbba0c?w=636&h=426&f=png&s=264227)


![](https://user-gold-cdn.xitu.io/2020/1/8/16f81180d81460ec?w=1604&h=496&f=png&s=32223)


最终效果预览：

![](https://user-gold-cdn.xitu.io/2020/1/9/16f85ed17c87a16d?w=640&h=400&f=gif&s=211958)


下面，我们从0开始，使用原生js实现这个效果，并封装成插件

# 过程分析
- 一个元素正常展示。点击的时候，会多出边框，边框的角落会有拖拽修改宽高的控件,控件位置、大小和元素一模一样
- 点击某个角落的拖拽控件，以该控件的<span style="color: #f00">的中心对称点</span>为中心点，变更宽高。新的width = 旧的width + 控件x坐标变化量(可正可负)，height也是
![](https://user-gold-cdn.xitu.io/2020/1/8/16f81256e2d4b5bc?w=1274&h=490&f=png&s=81389)
- 点击非某个角落的拖拽控件的拖拽控件，拖拽整个元素，此时`cursor`为`all-scroll`
- 点击其他地方，控件消失，元素变成原本样子

![](https://user-gold-cdn.xitu.io/2020/1/8/16f8129e8bfed46a?w=1298&h=444&f=png&s=156367)
- 代码复用：多处涉及到拖拽，拖拽需要抽取出来做公共方法

# 实现一个拖拽
> ❌ 错误示范

给**元素**加上mousedown(按下的时候)事件，此时开始绑定mousemove；当鼠标弹起，移除mousemove事件绑定。也就是鼠标在元素上按下的时候，每次move都移动元素，鼠标弹起的时候，清除事件绑定

mousemove事件触发的时候，计算本次位置和上次位置x、y坐标（即left、top）差值，并加上left、top位置，即可获得拖动后的新位置

```js
// html只有一个div，并且有设置position
    const ele = document.querySelector("div");
    ele.addEventListener("mousedown", e => {
    // 记录首次位置，也是为了存放上次位置
      let x0 = e.clientX;
      let y0 = e.clientY;
      const handleMove = ({ clientX, clientY, target }) => {
      // 本次位置和上次位置的变化量
        ele.style.left = `${parseFloat(ele.style.left, 10) + clientX - x0}px`;
        ele.style.top = `${parseFloat(ele.style.top, 10) + clientY - y0}px`;
          // 上次位置更新
        x0 = clientX;
        y0 = clientY;
      };
      ele.addEventListener("mousemove", handleMove);
      ele.addEventListener("mouseup", () => {
        ele.removeEventListener("mousemove", handleMove);
      });
    });
```

慢慢拖、慢慢拖，很ok

但是......试试快速拖动会发生什么事情，是不是有一种手滑的效果？然后元素跟丢了。如果你的div很大，跟丢的概率会小很多

![](https://user-gold-cdn.xitu.io/2020/1/8/16f85c59815ac8bb?w=640&h=400&f=gif&s=61483)

> ✅  正确的做法

给顶部节点(如document)加上事件绑定，然后通过事件代理来实现拖拽元素准确定位：
```js
    const ele = document.querySelector("div");
    // 换成document
    document.addEventListener("mousedown", e => {
    // 这里过滤掉非目标元素
      if (e.target !== ele) {
        return;
      }
      let x0 = e.clientX;
      let y0 = e.clientY;
      const handleMove = ({ clientX, clientY, target }) => {
        ele.style.left = `${parseFloat(ele.style.left, 10) + clientX - x0}px`;
        ele.style.top = `${parseFloat(ele.style.top, 10) + clientY - y0}px`;
        x0 = clientX;
        y0 = clientY;
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleMove);
      });
    });
```

canvas写字其实也是同样的道理，**按下后的移动单位时间元的变化量加到目标元素上**。都是利用了x、y坐标变化量，只是move处理的时候是用画canvas替代了修改html元素样式

# 增加控件
- 控件容器定位准确：控件一定要和元素完全一样的定位，所以使用getBoundingClientRect计算初始位置，后面使用fixed定位来维护
- 控件容器内小控件使用绝对定位，保证控件是在控件容器固定位置
- 鼠标指针修改：不同的位置有相应的方向的cursor，追求更好的用户体验
- 目标元素最好是fixed定位，可以忽略层级、嵌套，直接以根节点为基准来维护坐标

## 基本样式和定位
```js
      function getPxNumber(str) {
        return parseFloat(str, 10);
      }
    
      const ele = document.querySelector("div");
      // 获取目标元素精确的初始位置
      const { x, y, width, height } = ele.getBoundingClientRect();
      // 控件容器
      const controlWrapper = document.createElement("div");
      // 挂一个数据代理，设置代理对象的时候同时设置目标元素和控件容器样式
      const _style_ = new Proxy(controlWrapper.style, {
        get(o, key) {
          // 获取controlWrapper.style.xxx的xxx样式值
          let originalStyleValue = Reflect.get(o, key);
          // 接下来我们改的是这4个key
          if (
            ["width", "height", "left", "top"].includes(key) &&
            !originalStyleValue
          ) {
            // dom.style.xxx 没设置过是""，所以第一次要这样获取
            originalStyleValue = controlWrapper.getBoundingClientRect()[key];
          }
          return originalStyleValue;
        },
        set(o, key, val) {
          // 比如获取"16.6px"的16.6数字
          const pxNumber = getPxNumber(val);
          // 我们改的是这4个key
          // 改控件容器的时候，顺便把目标元素的style也改一下
          if (["width", "height", "left", "top"].includes(key)) {
            ele.style[key] = val;
          }
          Reflect.set(o, key, val);
          return val;
        }
      });
      // 设置控件容器初始样式
      Object.assign(controlWrapper.style, {
        position: "fixed",
        width: `${width}px`,
        height: `${height}px`,
        top: `${y}px`,
        left: `${x}px`,
        // 拖拽整个元素移动的时候，是"all-scroll"光标
        cursor: "all-scroll", 
        border: "1px dashed #000"
      });
      // 代理_style_挂在controlWrapper上
      controlWrapper._style_ = _style_;

```
此时，我们已经有控件容器了，加上虚线，方便辨识

![](https://user-gold-cdn.xitu.io/2020/1/9/16f86403f4ea0593?w=1258&h=220&f=png&s=17072)

接着，我们需要把四个角的控件加上，拖拽一个角控制宽高的：

它们的样式先来一个
```css
      .controller-corner {
        width: 10px;
        height: 10px;
        background-color: #faa;
        position: absolute;
      }
```
这是一个创建4个控件元素的方法，这个函数返回这4个元素供外部使用

![](https://user-gold-cdn.xitu.io/2020/1/9/16f864d4770d074e?w=1184&h=504&f=png&s=36265)
```js
    function renderCorner({ width, height }) {
    // 来4个元素
      const eles = Array.from({ length: 4 }).map(() =>
        document.createElement("div")
      );
      eles.forEach(x => x.classList.add("controller-corner"));
      // 分别在topleft、topright、bottomleft、bottomright位置
      const [tl, tr, bl, br] = eles;

      // 每一个角都移动半个身位
      Object.assign(tl.style, {
        top: `-5px`,
        left: `-5px`,
        cursor: "nw-resize"
      });
      Object.assign(tr.style, {
        top: `-5px`,
        cursor: "ne-resize",
        right: `-5px`
      });
      Object.assign(bl.style, {
        bottom: `-5px`,
        cursor: "sw-resize",
        left: `-5px`
      });
      Object.assign(br.style, {
        bottom: `-5px`,
        cursor: "se-resize",
        right: `-5px`
      });
      return { eles };
    }
```

## 添加拖拽事件与功能逻辑
- 拖拽四个角，改变元素宽高。拖右边两个角，只改变宽高，宽高改变量和新的宽高是正相关的；拖左边两个角，除了宽高还要改变top、left，而且宽高改变量和新的宽高是负相关的

![](https://user-gold-cdn.xitu.io/2020/1/9/16f88c00d3bb2fe0?w=1058&h=664&f=png&s=88253)
![](https://user-gold-cdn.xitu.io/2020/1/9/16f88c2ce75c2d7f?w=1082&h=676&f=png&s=106329)
- 拖拽target是控件容器里面非四个角，改变元素位置。这个情况比较简单了，直接用x、y坐标变化量加上原本位置即可

多次涉及到拖拽，先实现一个公共的处理方法：
```js
// 拖拽的套路修改一下
// onMove就是处理mousemove的函数
// bindUpAndDown是用来绑定up和down事件的，作为开始和收尾
    function handleMouseDown(onMove, bindUpAndDown) {
      return function({ target, clientX: x, clientY: y }) {
        let x0 = x;
        let y0 = y;
        function handleMove(e, ...rest) {
          const { clientX, clientY } = e;
          e.preventDefault();
          const detaX = clientX - x0;
          const detaY = clientY - y0;
          x0 = clientX;
          y0 = clientY;
          // 我们前面说到，拖拽过程中，x、y坐标变化量是核心的参数
          onMove(target, detaX, detaY, ...rest);
        }
        // 透传target和handleMove，因为开始和收尾的down和up都要用到它们
        bindUpAndDown(target, handleMove);
      };
    }
```
添加功能逻辑
```js
    // 获取四个角——eles，传入的width, height是目标元素的getBoundingClientRect
      const { eles } = renderCorner({ width, height });
      const [tl, tr, bl, br] = eles;
      // 在handleMouseDown传入onMove, bindUpAndDown
      const handleControlerMouseDown = handleMouseDown(
        (target, detaX, detaY, isMoveTargetElement) => {
        // 移动的时候的处理
        // 是否是左边两个角
          const isLeft = [tl, bl].includes(target);
        // 是否是上面两个角
          const isTop = [tl, tr].includes(target);
          // 在左边，deta变化量要相反
          const directionLeft = !isLeft ? 1 : -1;
          const directionTop = !isTop ? 1 : -1;
          // 新的宽度、高度
          let newWidth = getPxNumber(ele._style_.width) + directionLeft * detaX;
          let newHeight =
            getPxNumber(ele._style_.height) + directionTop * detaY;

        // 区分拖动非4个角的控件的情况，此时是拖动整个元素本身
          if (isMoveTargetElement) {
            const newL = getPxNumber(ele._style_.left);
            const newT = getPxNumber(ele._style_.top);
            ele._style_.left = `${newL + detaX}px`;
            ele._style_.top = `${newT + detaY}px`;
            return;
          }

        // 拖动4个角
          ele._style_.width = `${newWidth}px`;
          ele._style_.height = `${newHeight}px`;
          // 拖左边的时候，实际上也会拖动元素本身
          ele._style_.left = isLeft
            ? `${getPxNumber(ele._style_.left) - directionLeft * detaX}px`
            : ele._style_.left;

          ele._style_.top = isTop
            ? `${getPxNumber(ele._style_.top) - directionTop * detaY}px`
            : ele._style_.top;
        },
        (target, handleMove) => {
        // 绑定事件的时候的处理
          const handleMoveTargetElement = e => handleMove(e, true);
          // 针对拖动4个角和非4个角的处理
          // 拖4个角改变宽高
          if (eles.includes(target)) {
            document.addEventListener("mousemove", handleMove);
          } else {
          // 拖控件非4个角的本体部分改变位置
            document.addEventListener("mousemove", handleMoveTargetElement);
          }
          document.addEventListener("mouseup", ({ target }) => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mousemove", handleMoveTargetElement);
          });
        }
      );
      document.addEventListener("mousedown", handleControlerMouseDown);
      // 挂载元素
      eles.forEach(e => {
        ele.appendChild(e);
      });
```

# 支持随时移除、增加控件
有了新增事件监听，那也很自然要有删除事件监听的方法。如何设计最简单呢，当然是万能的return一个新函数大法：
```js
// 在挂载元素后，return一个清除事件的方法
      eles.forEach(e => {
        ele.appendChild(e);
      });
      return {
        removeControler() {
          eles.forEach(e => {
            ele.removeChild(e);
          });
          document.removeEventListener("mousedown", handleControlerMouseDown);
        },
        eles: [...eles, ele]
      };
```
后面一直透传这个方法就行，给最外面那层使用。最外面那个函数，是给元素新增这些功能的总入口：
```js
    function injectDragger(ele) {
      let removeDragger;
      ele.addEventListener("click", () => {
        if (!removeDragger) {
        // 增加控件，然后保存暴露出来的清除方法随时使用
          const { removeAllControler, eles } = injectController(ele);
          removeDragger = removeAllControler;
          const handleRemove = ({ target }) => {
              // 监听鼠标弹起，如果不是从控件容器弹起，也就是点了其他地方，那这些控件都要删掉
            if (![...eles, ele].includes(target)) {
              removeDragger && removeDragger();
              removeDragger = undefined;
              document.removeEventListener("mouseup", handleRemove);
            }
          };
          document.addEventListener("mouseup", handleRemove);
        }
      });
    }
```


# 解决body自带margin错位问题
因为页面默认body有8个margin，如果不处理，那么前面这套在使用的时候，getBoundingClientRect和fixed定位不会完全对齐，造成每次编辑有8个px差错。

所以，我们在最开始的ele.getBoundingClientRect那一步开始，要加上margin
```js
      const { x, y, width, height } = ele.getBoundingClientRect();
      // 获取body自带的margin
      const bodyMargin = getPxNumber(getComputedStyle(document.body).margin);
      const controlWrapper = document.createElement("div");
      const _style_ = new Proxy(controlWrapper.style, {
        get(o, key) {
          let originalStyleValue = Reflect.get(o, key);
          if (
            ["width", "height", "left", "top"].includes(key) &&
            !originalStyleValue
          ) {
            originalStyleValue = controlWrapper.getBoundingClientRect()[key];
          }
          return originalStyleValue;
        },
        set(o, key, val) {
          const pxNumber = getPxNumber(val);
          // 设置位置的时候，需要去掉自带的margin影响
          if (["left", "top"].includes(key)) {
            ele.style[key] = `${pxNumber - bodyMargin}px`;
          } else if (["width", "height"].includes(key)) {
            ele.style[key] = val;
          }
          Reflect.set(o, key, val);
          return val;
        }
      });
```

# 同时支持pc、移动端
上面代码全是pc的鼠标事件，移动端加不能用了，当然，再写一份就可以。作为完美追求者，这种事情一定不会做的，我们看看移动端touch和pc的mouse在本功能上最主要的区别：
- pc: e.target.clientX
- 移动端: e.target.touches[0].clientX(移动端可以多手指触屏，我们这里按照第一个手指行为来做)

自己给原型对象挂一个新的事件绑定。写好后，第一步是全局替换原有的名字
```js
    const MOBILE_MAP = {
      mousedown: "touchstart",
      mousemove: "touchmove",
      mouseup: "touchend"
    };
    HTMLDocument.prototype._addEventListener = function(key, cb, ...rest) {
      document.addEventListener(key, cb, ...rest);
      document.addEventListener(MOBILE_MAP[key], cb, ...rest);
    };
    HTMLDocument.prototype._removeEventListener = function(key, cb, ...rest) {
      document.removeEventListener(key, cb, ...rest);
      document.removeEventListener(MOBILE_MAP[key], cb, ...rest);
    };
```
替换名字后，在代码中clientX、clientY要兼容双端：
```js
// ...
      let x0 = e.clientX || e.touches[0].clientX;
      let y0 = e.clientY || e.touches[0].clientY;
      const handleMove = ({
        touches,
        clientX = touches[0].clientX,
        clientY = touches[0].clientY,
        target
      }) => {}
// ...
```

# 最后
扩展：最开始的时候，传入一个config对象，每一个函数都会透传这个对象，这个对象贯穿整个过程，控制每一个流程可以个性化配置

代码比较多，具体代码见[codesandbox](https://codesandbox.io/s/static-5bn0c?fontsize=14&hidenavigation=1&theme=dark)，还有旋转功能没有实现，其实就是扩展一下控件即可

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)