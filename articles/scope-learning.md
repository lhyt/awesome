
> 近来在多个群里面看见有人发了一个题，`{ a = 1; function a(){} };console.log(a)`和`{ function b(){}; b = 1 };console.log(b)`输出的是什么。结果两个情况的输出结果都是代码块里面的第一个，咦，好像和之前所学的变量提升有点不一样。我们下面开始探究一下

<b style="color: red">本文基于chrome展开研究。前方告警：这是一次无聊的探索记录</b>

# 温故知新——变量提升
相信大部分人都了解了，这里再重复啰嗦一下。js是解析执行的，变量提升是js中执行上下文的工作方式。变量声明和函数声明在编译阶段会被提前。
```js
console.log(a); // undefined
a = 1;
console.log(a); // 1
var a;

// 相当于
var a;
console.log(a); // undefined
a = 1;
console.log(a); // 1
```
意外的全局变量，但是如果不去掉第一句console就会报错
```js
a = 1;
console.log(a); // 1
```
函数声明的提升
```js
console.log(a); // 打印函数a
function a() {}

// 相当于
function a() {}
console.log(a);
```
函数声明的提升大于变量声明的提升
```js
console.log(a);
var a;
function a() {}

// 都是打印函数a
console.log(a);
function a() {}
var a;
```
注意了，if里面的声明也是会提升的，即使没执行
```js
console.log('a' in window); // true
if (false) {
  function a(){}
}
```

# var、let、const发生了什么
> 生命周期：声明（作用域注册一个变量）、初始化（分配内存，初始化为undefined）、赋值

- var：遇到有var的作用域，在任何语句执行前都已经完成了**声明和初始化**，也就是变量提升而且拿到undefined的原因由来
- function： **声明、初始化、赋值一开始就全部完成**，所以函数的变量提升优先级更高
- let、const：解析器进入一个块级作用域，发现let关键字，变量**只是先完成声明**，并没有到初始化那一步。此时如果在此作用域提前访问，则报错Cannot access 'a' before initialization，这就是存在暂时性死区的表现。等到解析到有let那一行的时候，才会进入初始化阶段。如果let的那一行是赋值操作，则初始化和赋值同时进行

> <b style="color: #f00">注意：变量提升仅提升声明，而不提升初始化</b>

# 代码块
可以看见，这个题目和一般的变量提升有点套路不一样，加了一个花括号。这里花括号的意思是代码块。函数实际上就可以理解为“可复用代码块”。for循环后面也是跟一个代码块、while的后面也是一个代码块，表示重复执行该代码块里面的代码：
```js
while(1) {
    // 代码块
}
```
甚至你可以无缘无故地写一个代码块：
```js
{
    console.log(123);
};
// 这种写法，chrome下可以不加分号，一些其他的浏览器(safari)需要加分号否则报错
// 为了稳妥，所以还是加分号吧
```
## 块级作用域
对于var是没有块级作用域的，所以下面代码输出了2
```js
var a = 1;
{
  var a = 2;
};
console.log(a); // 2
```
而let、const是有块级作用域的，如下输出了1
```js
// const是一样的
let a = 1;
{
  let a = 2;
};
console.log(a); // 1
// 注意：如果没有{}代码块，两个let(const)在同一个作用域里面会报错的
// Identifier 'a' has already been declared
```
## 打断点看看发生了什么事情

```js
debugger;
var a = 1;
{
  debugger;
  var a = 2;
  debugger;
};
debugger;
```
第一个点，变量提升，`var a;`然后因为是直接使用控制台执行，a也顺便变成了window下的a了。script展开也是没有什么变化的
![](https://user-gold-cdn.xitu.io/2019/10/1/16d86e3343ede345?w=916&h=1142&f=png&s=151436)
第二、三个点，对a赋值1和2，也很符合预期，其他没有变化
![](https://user-gold-cdn.xitu.io/2019/10/1/16d86e5bd8faf64a?w=970&h=1174&f=png&s=163467)
第四个点，就一直是2了，和第三个点的信息是一模一样的

![](https://user-gold-cdn.xitu.io/2019/10/1/16d86e6887244f29?w=958&h=1162&f=png&s=153631)
> 想必这是一个很无聊的事情，但我们还是再把var换成let看看

第一个点，因为是let，所以global里面没有看见a。道理和`let a = 1`，`window.a`是undefined一样的，`'a' in window === false` 
![](https://user-gold-cdn.xitu.io/2019/10/1/16d8723c010adfba?w=916&h=1134&f=png&s=143801)


第二个点，我们可以看见多了一个block，这个表示的是块级作用域。也可以看见<span style="color: #f00">a是存在变量提升的！！</span>，只是你访问它会报错，此时代码块里面，`let a = 2`以上的代码都是暂时性死区。还有一个事情，现在用了let，script展开可以看见有a了，这个a是代码块外面的a
![](https://user-gold-cdn.xitu.io/2019/10/1/16d8730f551b011c?w=896&h=1140&f=png&s=149348)

第三个点不用想，block里面的a肯定是2了，然后script的a还是外面那个
![](https://user-gold-cdn.xitu.io/2019/10/1/16d87322b39cc88b?w=904&h=1146&f=png&s=146090)

最后又回到了外面，a还是script的a，没有block了
![](https://user-gold-cdn.xitu.io/2019/10/1/16d87328b3efebd1?w=870&h=1106&f=png&s=153927)
# 实践是检验真理的唯一标准
有了前面的铺垫以及一些前面介绍的断点调试的技巧，我们开始步入正题。先看`{ a = 1; function a(){} }`

## { a = 1; function a(){} }
这个的结果是1，符合常规思维，函数被提前，然后a赋值1。但是打点看一下，有点不一样——第一个点Global里面的a为什么不是函数而是undefined
```js
// 开始打点
debugger; // Global => a: undefined
  {
    debugger;  // Block => a: function, Global => a: undefined
    a = 1;
    debugger; // Block => a: 1, Global => a: undefined
    function a(){}
    debugger;  // Block => a: 1, Global => a: 1
  };
debugger;// Global => a: 1
```
先看代码块里面，Block里面的a还是和常规的变量提升是一样的表现：首先函数声明大于变量声明，所以第二个点的Block的a是一个函数。接着a被赋值，第三个点a是1，<span style="color: red">此时Global的a是undefined而不是1。</span>第四个点，Global的a才是1。

> 第一个点Global里面的a为什么不是函数而是undefined，第三个点Global的a为什么是undefined而不是1，而且要在`function a(){}`后面才开始赋值1?

实际上chrome对于这种情况的函数声明提升，最开始也是先undefined的。safari就不一样了，不会先undefined，直接function。而且{ a = 1; function a(){} }和{ function a(){}; a = 1 }都是输出1。在safari下，**这种情况加了代码块和没加是一样的**，相当于直接执行了`a = 1; function a(){}`

![](https://user-gold-cdn.xitu.io/2019/10/1/16d8754996561efb?w=918&h=446&f=png&s=106134)


## { function a(){}; a = 1 }
我们执行一下`{ function a(){}; a = 1 }`，发现最后的a居然是一个function了！！！这个题目答案的表现就是，代码块里面先声明什么，最终a的结果就是什么。问题转化成为：为什么外层的a是代码块的第一个声明的a？
```js
// 开始打点
debugger; // Global => a: undefined
  {
    debugger;  // Block => a: function, Global => a: undefined
    function a(){};
    debugger; // Block => a: function, Global => a: function
    a = 1;
    debugger;  // Block => a: 1, Global => a: function
  };
debugger;// Global => a: function
```

- 为什么`a = 1`对于Global的a无济于事？

## 问题汇总
```js
{
    a = 1;
    // 问题1: 此处Global的a为什么是undefined而不是1
    function a() {};
};


{
    function a() {};
    // 问题2: 此处Global的a直接是function了而且a = 1对Global的a无济于事
    a = 1;
};
```


# 更多的尝试
多个函数声明，取最后一个
```js
  {
    function a(){}
    function a(b){return 1}
    a = 1;
  };
  // >> function a(b){return 1}
```
多个赋值，取最后一个
```js
  {
    a = 1;
    a = 2;
    function a(){}
  };
  // >> 2
```
在代码块里面，function更像一个“赋值语句”
```js
debugger;
{
  debugger; // global的a： undefined
  function a() { }
  debugger; // ac
  a = 1;
  debugger; // ac
  function a(b) { }
  debugger;  // 1
  a = 2;
  debugger;  // 1
  a = 3;
  debugger;  // 1
  function a(c) { }
  debugger;  // 3
};
```
可以看出，在代码块里面，chrome的表现方式有这些特点：
- 代码块里面a变量提升、a赋值、函数声明a是和常规的一样
- 代码块里面所有的a函数的函数声明，也是和常规一样提升，取最后一个
- 代码块里面a函数声明语句，除了提升，还有一个神奇的表现：它会把代码块里面上一句a相关的赋值语句(a = xxx)的值“传递”出去，`function a(){}`更像一句“赋值语句”。具体为什么呢，大概是浏览器的内部对代码块的实现方式了
- 只有第一次a函数声明会“传递”，后面的a函数声明只会把上一句赋值语句(a = xxx)的值“传递”到全局

我们可以试一下，利用这些规律猜一下输出结果：
```js
{
  console.log(a, window.a);
  function a() { }
  console.log(a, window.a);
  a = 1;
  console.log(a, window.a);
  function a(b) { }
  console.log(a, window.a);
  a = 2;
  console.log(a, window.a);
  a = 3;
  console.log(a, window.a);
  function a(c) { }
  console.log(a, window.a);
  function a(ca) { }
  console.log(a, window.a);
};
```

<details>
<summary>点击展开查看解释</summary>

```js
{
  console.log(a, window.a);
  // function a(ca)变量提升，全局a是undefined
  function a() { }
  console.log(a, window.a);
  // function a(ca)，全局a是function a(ca)，上一句是a函数声明但又带function a(ca)提升，“传递”出去并赋值
  a = 1;
  console.log(a, window.a);// 1，function a(){}
  function a(b) { }
  console.log(a, window.a);
  // 1， 1因为上一次赋值是1，1被“传递”出去
  a = 2;
  console.log(a, window.a);
  // 2  1
  a = 3;
  console.log(a, window.a);
  // 3  1
  function a(c) { }
  console.log(a, window.a);
  // 3 3，因为上一次是a=3，3被“传递”出去
  function a(ca) { }
  console.log(a, window.a);
  // 3 3，因为函数声明只会第一次把自己“传递”出去，现在不会了，可以理解为挨着的function a(){}都合并掉了
};
```
</details>

> 然而，对于safari来说，这一切和没有代码块`{}`时的表现是一样的。折腾了一阵，原来是浏览器处理方式不一样。断点调试熟练度+10，经验+3 😊