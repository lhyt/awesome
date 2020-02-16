# 0. 前言
作为一个不喜欢写样式的前端，遇到了直接对外的活动页面的需求，一下炸出一堆问题：
- 单位乱用，rem、vh、vw、px乱用甚至混在一起用
- html冗余，有时候一个div只是为了取margin
- 一个页面用多种布局方案，flex、float、relative+top、absolute+top、margin，自己坑自己
- 各种随意，不严格按照视觉稿
理论倒是熟悉，但用起来还是一塌糊涂。于是，回头自我救赎一波，好好复习基础。flex、grid后面不多作研究，尤其是grid这种一两行就可以搞定很多复杂样式。如果我们不知道新技术是为了什么而来的，解决什么痛点，没有体验一下刀耕火种的时代，又没有一个良好的团队合作能力，做起项目来还真的不一定是“写页面太简单了”这种事情。

# 1. 一些实践方案深入浅出
## 1.1 padding
看到百度的顶部，你会想到什么方案呢？
![](https://user-gold-cdn.xitu.io/2018/10/14/16672b154f947885?w=2034&h=208&f=png&s=46954)

我们看百度搜索的顶部，顶部的#head（搜索框这一行都是）是fixed的，紧接着的那个div是一个tab。当然fixed脱离文本流，就用padding把自己的主要内容顶到下面去，不然内容就直接置顶了。

没错，就是很简单的一个css，实现的方法有很多。然后我们再看一下这个视觉效果要怎么实现：
![](https://user-gold-cdn.xitu.io/2018/10/14/16672bcee00079fc?w=250&h=256&f=png&s=16151)
img+脱离文本流的方法?双div+定位？

其实，一个div+padding马上解决，div背景100%然后center+padding-top，div里面的文字就自然到下面去了，然后定位定准就好了。另外，文字换成伪元素也可以。

### 控制宽高比
一些人也知道，padding的百分比相对于width，那么这样就可以实现了一个等比例的盒子，然后随便缩放都可以了。比如做一个正方形，边长是屏幕宽度一半：
```
.scale50 {
  background: #aaa;
  width: 50%;
  height: 0;
  text-align: center;
  padding-top: 50%;
}
```
很多时候，我们需要什么4:3，16:9的图片，就可以用这样的方法解决了。
## 1.2 margin
再看看百度的右边栏
![](https://user-gold-cdn.xitu.io/2018/10/14/16672d21aa8a463f?w=586&h=1152&f=png&s=280897)

对于这个栏的左边部分，用margin还是padding呢？这个情况当然是padding，因为有一个边线😊。对于这个栏的上面，是padding还是margin呢？实际上，在这个情况下都是一样的，但是有一个潜在问题：如果有两行，而且垂直方向还有其他盒子的margin，那么就会发生垂直方向的margin坍塌（取较大值）;或者当有父盒子包裹，他的margin会走到外面影响外面。这时候，又要加上转化为bfc的代码。
- case1:
![image](https://user-gold-cdn.xitu.io/2018/10/16/166787689b2b0b37?w=923&h=253&f=png&s=28209)
- case2:
![1](https://user-gold-cdn.xitu.io/2018/10/16/166787689bc260aa?w=362&h=228&f=png&s=2709)


### 还敢乱来居中吗
比如，有一个设计稿是这样的：
![](https://user-gold-cdn.xitu.io/2018/10/14/16672f1ca043d605?w=574&h=482&f=png&s=24269)
可能看起来是居中，然后很快写出来子绝父相的万金油居中。然后设计突然走过来说，怎么总是感觉有点不对啊，于是看一下下半部分：
![](https://user-gold-cdn.xitu.io/2018/10/14/16672f454c9cbbf9?w=584&h=276&f=png&s=20424)
真的不是居中啊，水平方向的也是。那么，这时候，写死margin不就搞定了，保证视觉不来找你。

🐦...许多天后，测试说，某某手机视觉就出问题了。当然，写死px肯定药丸啊，所以移动端就是要用rem解决。我这里一个rem等于50px，那换算一下，图上第一个div（绿色的钩）的margin就是176 148 0 151，换成rem是3.52 2.96 0 3.02，后面的样式问题只要不是横屏或者ipad的（无视觉稿的前提）都不是你的锅了。

### 负的margin
正的就是撑开整个margin-box，那负的我们就可以想象出来，吃掉这个margin-box。一般的情况下，就是平移。如果加上了float就神奇了，还能跨行平移。双飞翼和圣杯布局其中一部分就是利用这个原理

> 前面都是废话，不就是一个盒子模型嘛。没错，盒子模型，谁都知道，但是用起来谁用的好，这就难说了

# 2. 开始试试水
> **接下来，准备用n种方法实现三列布局，中间自适应，两边固定宽度**
## 绝对定位
html: 
``` html
 <div class="container">  
   <div class="m">中间</div>
  <div class="l">左边</div>
  <div class="r">右边</div>
 </div>
```
css: 
```css
.container{
  position: relative;
  height: 100px;
}
.l, .m, .r {
  height: 100px;
  position: absolute;
}

.l {
  background: #f00;
  width: 100px;
}

.m {
  background: #0f0;
  width: calc(100% - 150px);
  margin: 0 50px 0 100px;
}

.r {
  background: #00f;
  width: 50px;
  right: 0;
}
```
分析：不论顺序，流式布局，中间先加载，但用了calc

> "calc?! 避免recalculate啊"

这时候，去吧，ie盒模型：
```css
.m {
  background: #0f0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 50px 0 100px;
}
```
看一下对比：
![](https://user-gold-cdn.xitu.io/2018/10/16/1667d2b0eed60572?w=830&h=760&f=png&s=122817)

## 圣杯与双飞翼布局
还是一样的html
```css
.container {
  height: 100px;
  width: 100%;
  padding: 0 50px 0 100px;
}

.m, .l, .r {
  height: 100px;
  float:left;
}

.m {
  background: #f00;
  width: 100%;
}

.l {
  background: #0f0;
  width: 100px;
  margin-left: -100%;
  position: relative;
  left: -100px;
}

.r {
  background: #00f;
  width: 50px;
  margin-right: -50px;
}
```
很多人说这个难懂，其实我们可以一步步来：先放好容器设好宽高背景，三个div是mlr顺序。然后float，显然m自己占一行，其他两个占一行。
![](https://user-gold-cdn.xitu.io/2018/10/16/1667d1a76cf599ae?w=988&h=752&f=png&s=41524)
接着，用到负margin，先把左边到移动一行，即是-100%，右边就移动一个身位-50px就ok，现在已经是视觉上的3列。最后，中间部分开头被遮住，而且占了100%行宽。那么我们只能用容器的padding或者自己的margin压自己。

![](https://user-gold-cdn.xitu.io/2018/10/16/1667d1dc74746515?w=1596&h=726&f=png&s=105210)
如果是用容器padding，将左右两边腾出来，刚刚好放下lr两个div。最后，l和r还是在m里面，所以还要移一下，relative就好。这就是圣杯布局

![](https://user-gold-cdn.xitu.io/2018/10/16/1667d2169d8668d5?w=1426&h=652&f=png&s=132803)

如果是用自己的margin压自己，那么就需要多一个div包住自己。前面步骤一样，包住自己的div占满一行，但是自身有margin，完美解决。这就是双飞翼布局。图示和上图基本一模一样，只是最外那层不是container而是m，真正的展示出来的中间部分是m里面的div，另外，l和r也不用relative了。
```
<div class="m">
  <div class="margin-setting">
  中间
  </div>
</div>
```
这是传统css+div的一套比较好的解决方案，不过我们愁的是高的问题了，需要自己设
## float+calc
```html
  <div class="container">
    <div class="l">左边</div>
    <div class="m">这是中间内容</div>
    <div class="r">右边</div>
  </div>
```
这次的html不能调换顺序写了
```css
.container {
  height: 100px;
  width: 100%;
}

.m, .l, .r {
  height: 100px;
  float: left;
}

.m {
  background: #f00;
  width: calc(100% - 150px);
}

.l {
  background: #0f0;
  width: 100px;
}

.r {
  background: #00f;
  width: 50px;
}
```
类似于前面的absolute方案，calc可以用ie盒子替代
##   行内元素
是不是遇到过行内元素总是有间隔的问题，html加注释就可以去掉分隔符，当然这里要实现3列布局：
```html
  <div class="l">左边</div><!--
  --><div class="m">中间</div><!--
  --><div class="r">右边</div>
```
css：
```css
.l, .m, .r {
  height: 100px;
  display: inline-block;
}

.l {
  background: #f00;
  width: 50px;
}

.m {
  background: #0f0;
  width: calc(100% - 150px);
}

.r {
  background: #00f;
  width: 100px;
}
```
特点：样式及其脆弱，内容换行马上崩了，只能在没文字的情况好一点。calc还是一样的方法，ie盒子完美解决
##   两个div实现三列
```html
  <div class="container" l="左边">中间</div>
  <div class="r">右边</div>
```
左边的内容用attr抓
```css
.container {
  float: left;
  height: 100px;
  background: #f00;
}

.container::before {
  content: attr(l);
  display: block;
  width: 100px;
  float: left;
  height: 100px;
  background: #0f0;
}

.r {
  height: 100px;
  width: 50px;
  float: left;
  background: #00f;
  margin-right: -100%;
}
```
用content做的内容，注定了左边不能再放html元素了

## flex与grid
html还是按顺序：
```html
<div class="container">
    <div class="l">左边</div>
    <div class="m">这是中间内容
    </div>
    <div class="r">右边</div>
</div>
```
大家都知道的flex实现：
```css
.container {
  display: flex;
  height: 100px;
}

.l {
  background: #f00;
  min-width: 100px;
}

.m {
  background: #0f0;
}

.r {
  background: #00f;
  min-width: 50px;
}
```
不过，我更看好grid，符合程序员思维，一个配置，两行代码，基本搞定大部分场景
```css
.container {
  display: grid;
  grid-template-columns: 100px auto 50px;
  grid-template-rows: 100px;
}

.container div:nth-of-type(1) {
  background: #f00;
}

.container div:nth-of-type(2) {
  background: #0f0;
}

.container div:nth-of-type(3) {
  background: #00f;
}
```
## 一个div实现
css:
```css
div {
  background: #f00;
  height: 100px;
  margin: 0 50px 0 100px;
  position: relative;
}

div::before {
  content: '左边';
  display: block;
  background: #0f0;
  height: 100px;
  width: 100px;
  position: absolute;
  left: -100px;
}

div::after {
  content: '右边';
  display: block;
  background: #00f;
  height: 100px;
  width: 50px;
  position: absolute;
  right: -50px;
  top: 0;
}
```
当然，只是娱乐而已，项目上谁会写这个。某些小装饰可能有机会上

> 又瞎搞一堆乱七八糟的，先冷静一下


> **我的博客即将同步至腾讯云+社区，邀请大家一同入驻：https://cloud.tencent.com/developer/support-plan?invite_code=1lj8vm522l4ci**