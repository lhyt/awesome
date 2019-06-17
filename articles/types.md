# 0.前言
js身为一种弱类型的语言，不用像c语言那样要定义好数据类型，因为允许变量类型的隐式转换和允许强制类型转换。我们在定义一个变量的时候，就一个var、let、const搞定，不用担心数据的类型。比如常见的字符串拼接，用+号可以实现变量和字符串的拼接。

对于object和number、string、boolean之间的转换关系，这里偷网上一幅图
![1](https://user-gold-cdn.xitu.io/2018/4/10/162ae092c3a46478?w=1216&h=610&f=jpeg&s=88094)

- Object 与Primitive，需要Object转为Primitive
-  String 与 Boolean，需要两个操作数同时转为Number。
- String/Boolean 与 Number，需要String/Boolean转为Number。
- undefined 与 null  ，和所有其他值比较的结果都是false，他们之间==成立

ToPrimitive是指转换为js内部的原始值，如果是非原始值则转为原始值，调用`valueOf()`和`toString()`来实现。`valueOf`返回对象的值：在控制台，当你定义一个对象按回车，控制台打印的是`Object{...}`，`toString()`返回对象转字符串的形式，打印的是`"[object Object]"`
- 如果参数是Date对象的实例，那么先`toString()`如果是原始值则返回，否则再`valueOf()`，如果是原始值则返回，否则报错。
- 如果参数不是Date对象的实例，同理，不过先`valueOf`再`toString()`。

> Date的转换原理：Date 对象的 [@@toPrimitive]() 方法可以返回一个原始值string | number。
如果 hint 是 "string" 或 "default"，[@@toPrimitive]() 将会调用 toString。如果 toString 属性不存在，则调用 valueOf。如果 valueOf 也不存在，则抛出一个TypeError。

如果 hint 是 "number"，[@@toPrimitive]() 会首先尝试 valueOf，若失败再尝试 toString。

当期望一个原始值却收到一个对象时，JavaScript 可以自动的调用 [@@toPrimitive]() 方法来将一个对象转化成原始值，所以你很少会需要自己调用这个方法。



# 1.一些例子
在浏览器控制台输入一些各种运算符的组合，会出现一些有意思的结果：
```javascript
![] //false;
 +[]  // 0
 +![]  // 0
[]+[] // ""
{}+{}//"[object Object][object Object]"
{}+[]//0
{a:0}+1 // 1
[]+{}//"[object Object]"
[]+![]//"false"
{}+[]//0
![]+[] // "false"
''+{} //"[object Object]"
{}+'' //0
[]["map"]+[] //"function map() { }"
[]["a"]+[] // "undefined"
[][[]] + []// "undefined"
+!![]+[] //"1"
+!![] //1
1-{} //NaN
1-[] //1
true-1 //0
{}-1 //-1
[]==![] //true
```
# 2.从[]==![]开始
我们知道，[]!=[]，主要是因为他们是引用类型，内存地址不同所以不相等。那么为什么加了一个！就能划上等于号了
### 符号的优先度
可以参考mdn上的这个汇总表格：
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table
可以看见，`[]==![]`这个情况下先判断！再判断=
给[]取反，会是布尔值，[]的取反的布尔值就是false

## 2.1 []的反就是false？

#### 常见的一些转换：
非布尔类型转布尔类型：undefined、null 、0、±0、NaN、0长度的字符串=》false，对象=》true
非数字类型转数字类型：undefined=》NaN，null=》0，true=》1，false=》0，字符串：字符串数字直接转数字类型、字符串非数字=》NaN

回到`[]==![]`的问题上，`[]`也是对象类型（`typeof [] == "object"`），转为布尔类型的`![]`就是false

## 2.2 等号两边对比
我们知道，在比较类型的时候，先会进行各种各样的类型转换。
从开头的表格可以看见，他们比较的时候都是先转换为数字类型。右边是布尔值false，左边为一个空数组对象，对于左边，先进行ToPrimitive操作，先执行`valueOf([])`返回的是`[]`，非原始类型，再
`[].toString()`，返回的是`""`，那ToPrimitive操作之后，结果就是`""`了
最后，左边`""`和右边`false`对比，他们再转换为数字，就是`0 == 0`的问题了

# 3.更多玩法
## 3.1 间接获取数组方法
我们知道，数组有自己的一套方法，比如`var arr = [1,2];arr.push(1)`，我们可以写成`[1,2].push(1)`，还可以写成`[1,2]['push'](1)`，那么前面抛出的问题就解决了
```javascript
[]['push'](1) //[1]
[]["map"] //function map() { [native code] }
[]["map"]+[] // "function map() { [native code] }"
```
## 3.2 间接进行下标操作
### 3.2.1数字的获取
我们可以通过类型转换，获得0和1两个数字，既然能得到这两个数字，那么也可以得到其他的一切数字了：
`+[] === 0; +!![] === 1`
那么，` +!![]+!![] ===2`，`+((+![])+(+!![])+[]+(+![]))===10`

那么10-1=9也就来了：
`+((+![])+(+!![])+[]+(+![]))-!![] ===9`
简直就是无所不能

### 3.2.2 字符串下标
```javascript
(![]+[])[+[]] //"f"
(![]+[])[+!![]] // "a"
```
`(![]+[])`是`"false"`，其实`(![]+[])[+[]]` 就相当于`"false"[0]`，第一个字母，就是f
我们就可以从上面的那些获得单词的字符串获得其中的字母了，比如：`(![]+[])[+!![]+!![]+!![]] +([]+{})[+!![]+!![]]`

掌握基本套路后，我们可以随心所欲发挥，在浏览器的控制台输入一些符号的组合，然后回车看一下我们写的“密码”会转换成什么
```
([][[]] + [])[(+!![] + [] + [] + +![] ) >> +!![]] +
$$('*')[~~[]].nodeName[- ~ -+~[]] +
(this + [])[+!![]+[] + +[] - !!{} - !!{}] +
([]+![])[+!!{} << +!![] -~[]] +
({}+{})[+!![] -~[]]
```
# 4. 两个面试题
曾经遇到两个这种类型的面试题：
## 4.1 (a==1 && a==2 && a==3) 能不能为true
`(a==1 && a==2 && a==3) `或者`(a===1 && a===2 && a===3)` 能不能为true？
事实上是可以的，就是因为在==比较的情况下，会进行类型的隐式转换。前面已经说过，如果参数不是Date对象的实例，就会进行类型转换，先`valueOf`再`obj.toString()`
所以，我们只要改变原生的valueOf或者tostring方法就可以达到效果：
```javascript
var a = {
  num: 0,
  valueOf: function() {
    return this.num += 1
  }
};
var eq = (a==1 && a==2 && a==3);
console.log(eq);

//或者改写他的tostring方法 
var num = 0;
Function.prototype.toString = function(){
	return ++num;
}
function a(){}

//还可以改写ES6的symbol类型的toP的方法
var  a = {[Symbol.toPrimitive]: (function (i) { return function(){return  ++i } }) (0)};
```

每一次进行等号的比较，就会调用一次valueOf方法，自增1，所以能成立。
另外，减法也是同理：
```javascript
var a = {
  num: 4,
  valueOf: function() {
    return this.num -= 1
  }
};
var res = (a==3 && a==2 && a==1);
console.log(res);
```

另外，如果没有类型转换，是 === 的比较，还是可以的。
在vue源码实现双向数据绑定中，就利用了defineProperty方法进行观察数据被改变的时候，触发set。
每一次访问对象中的某一个属性的时候，就会调用这个方法定义的对象里面的get方法。每一次改变对象属性的值，就会访问set方法
在这里，我们自己定义自己的get方法：
```javascript
var b = 1
Object.defineProperty(window, 'a', {
  get:function() { return b++; }
})
var s = (a===1 && a===2 && a === 3 )
console.log(s)
```
每一次访问a属性，a的属性值就会+1，当然还是交换位置就不能为TRUE了

## 4.2 完善Cash打印三个101
要求只能在class里面增加代码：
```javascript
class Cash {}
const a = new Cash(1)
const b = new Cash(100)
console.log(`${a.add(b)},${Cash.add(a,b)},${new Cash(a+b)}`) // 101,101,101
```
 
 首先，三个输出结果是以**隐式转换**的形式出现的，这是关键之处。
 a和b都是new出来的对象，由`new Cash(a+b)`可以看出构造函数传入的也是两个Cash的实例对象。那么new出来的结果肯定不是简简单单的一个object，不然就是被转换成`'[object Object]'`，但是你又不得不以object类型出现，那就只能魔改隐式转换用到的toString和valueOf
 ```
class Cash {
    constructor (a) {
        this.m = a // 缓存真正的值
        this.valueOf = function () {
            console.log('value')
            return a
        }
    }

    add ($) { // a.add(b)
        return this.m + $
    }

    toString () { // 隐式转换调用
        return this.m
    }

    static add (v1, v2) { //Cash.add
        return v1 + v2
    }
}
```


# END
然而，实际项目中两个数据作比较的时候，我们尽量不要写甚至完全不要写两个等号，应该写三个等号，而且js也慢慢有向强类型过渡的趋势，让这些骚操作回到我们的个人收藏里面去吧
