### 本文来自我的[github](https://github.com/lhyt/issue/issues/14)
# 0.前言
这些都是js基础进阶的必备了，有时候可能一下子想不起来是什么，时不时就回头看看基础，增强硬实力。
# 1.this
## 1.1this指向
谁最后调用，就指向谁
先简单复习一次，this指向就那么几种：
1. new 关键字
指向new 创建的对象
```javascript
function F() {
        this.name = 1
}
var f = new F()
```
2. call、apply、bind
指向传入函数的第一个参数。a.call（b），函数a内部如果是要用到this。则这个this指向b

3. 对象的方法
对象内部的方法指向对象本身
```javascript
 var obj = {
                value: 5,
                printThis: function () {
                    console.log(this);
                }
            };
```
4. 按值传递
指向全局
```javascript
 var obj = {
                value: 5,
                printThis: function () {
                    console.log(this);
                }
            };
var f = obj.printThis
f()
```
## 如果出现上面对条规则的累加情况，则优先级自1至4递减，this的指向按照优先级最高的规则判断。

5.箭头函数
指向箭头函数定义时外层上下文
```javascript
var obj = {
                value: 5,
                printThis: function () {
                        return function(){ console.log(this)}
                   }
            };
obj.printThis()//window

 var obj = {
                value: 5,
                printThis: function () {
                                      return () => console.log(this)
                                 }
            };
obj.printThis()()//obj

```

# 2.call、apply、bind
前两者都是一样，只是参数表现形式不同，bind表示的是静态的前两者，需要手动调用
`a.call(b,args)`让函数a执行上下文指向b，也就是b的属性就算没有a函数，也能像b.a(args)这样子调用

方法大家都知道，我们不妨来自己实现一下这三个：
## 2.1 call实现
再看一次概念，b没有a方法，也就是没有b.a，如果想要这个效果，那就利用这三个函数来改变执行上下文。于是我们就可以想到，要是自己实现一个，大概就是，给b强行加上这个a 的方法，然后拿到argument去调用：
```javascript
Function.prototype.mycall = function(){
	var ctx = arguments[0]||window||global//获取上下文，call的第一个参数
	var len = arguments.length
	var hash = new Date().getTime()//避免名字重复
	ctx[hash] = this//将this缓存，this就是那个想在另一个上下文利用的函数
	var result
	if(len === 1){
		result = ctx[hash]()//如果后面没有其他参数直接运行
	} else{
		var i = 1
		var args = []
		for(;i<len;i++){
			args.push(arguments[i])
		}
		args = args.join(',')
		result = eval('ctx[hash](' + args + ')')//将参数传递进去调用
	}
	delete ctx[hash]//删除临时增加的属性
	return result
}
```

apply也是同理，而且少了数组这一步，更加简单接下来我们看一下bind怎么实现：

```javascript
Function.prototype.mybind = function(){
	var ctx = arguments[0]||window||global
	var f = this
	var args1 = []
	if(arguments.length>1){//预先填入的参数
		var i = 1
		for(;i < arguments.length;i++){
			args1.push(arguments[i])
		}
	}
	return function(){
		var args2 = Array.prototype.slice.call(arguments)//call和apply我们都可以实现，这里就不再重复
		return f.apply(ctx,args1.concat(args2))//将预先填入的参数和执行时的参数合并
	}
}
```
此外，需要注意的，一个函数被bind后，以后无论怎么用call、apply、bind，this指向都不会变，都是第一次bind的上下文


# 3.从call到继承
首先，js没有严格意义上的子类父类，实现继承是依靠原型链来实现类似于所谓的类的效果。
## 3.1 call继承（构造函数继承）
我们希望G继承F，或者是说，开发的时候，由于G有很多属性继承F我们想偷懒，那么就可以这样
```javascript
function F(name,age){
  this.name = name 
  this.age = age
}
function G(name,age,a) {
  F.call(this,...arguments)
  this.a = a
}
var g = new G('a',12,1) //G {name: "a", age: 12, a: 1}
```
这个方法特别之处是，子类可以向父类构造函数传参。但是，无法获取F的原型上的属性。
另外，方法也是写在内部
`this.f = function(){}`
也注定无法实现函数复用了，每一个实例都有一个函数，浪费内存。
## 3.2 prototype继承
要想子类获得父类的属性，如果是通过原型来实现继承，那么就是父类的一个实例是子类的原型：
```javascript
function F(){
  this.a = [1,2,3,4]
  this.b = 2
}
var f = new F()
function G(){}
G.prototype = f
var g = new G()
var h = new G()
g.a //[1,2,3,4]
g.b //2
//对于引用类型，如果我们修改g.a（不是用=赋值，用=不会操作到原型链）
g.a.push(123)
g.a//[1,2,3,4,123]
//而且其他的实例也会变化
h.a //[1,2,3,4,123]
g.b = 666 //只是在实例里面对b属性进行改写，不会影响原形链
```
可以看见，对于父类的引用类型，某个值是引用类型的属性被改写后，子类的所有的实例继承过来的属性都会变，主要的是，子类都可以改变父类。但是=赋值操作相当于直接在某一个实例上面改写。因为属性查找是按照原型链查找，先查找自身再查找原型链，找到为止。用了等号，先给自身赋值，所以自身赋值成功了也不会继续去原型链查找。

因为都有各自的缺陷，所以就有一种组合继承，将构造函数继承和prototype继承混合起来，方法写在父类的prototype上，是比较常见的方法。但是实例化都会调用两次构造函数，new和call
## 3.3Object.create继承（原型继承）
这样子，可以在两个prototype中间加上一个中介F类，使得子类不会污染父类，子类A是父类B继承而来，而且还可以在中间给他定义属性
```javascript
function A() {}  
function B() {}  
A.prototype = Object.create(B.prototype,{father:{value:[1,2,3]}});

//Object.create的hack
Object.create =Object.create|| function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
}
//其实create函数内部的原理就是这样子，看回去上面的A和B，这些操作相当于
var F = function () {};
F.prototype = B.prototype;//原型被重写，a.__proto__.constructor是B而不是F
A.prototype = new F()

//create方法，第二个参数类似于defineProperty，而且定义的属性可以自行配置，默认是不可以重新赋值
var a = new A()
a.father //[1,2,3]
a.father = 1
a.father //[1,2,3]
```
在不需要动用构造函数的时候，只是想看到让子类父类这种继承关系，create基本上是完美选择

## 3.4 寄生式继承
利用一个封装好继承过程的函数来实现继承，不需要另外定义一个子类，直接把子类的方法写在函数里面
```javascript
function createobj (obj) {
	var temp = Object.create(obj)
	temp.f = function () {
		console.log('this is father')
	}
	return temp
}
function B() {}  
var b = createobj (B.prototype)
b.f() //this is father
```
但是，不能做到函数复用，每一个实例都要写一份，而且写了一个createobj就是写死了，也不能获取B类的内部属性

## 3.5 寄生组合式继承
对于上面的仅仅依靠Object.create继承，a.__proto__原型对象被重写，他的构造函数是B，而不是中间量F，对于这种中间类F无意义，而且只是依靠中间原型对象，我们可以用比较完美的寄生组合式继承：
```javascript
function A() {}  
function B() {}  
var prototype = Object.create(B.prototype)//创建
prototype.constructor = A//增强
A.prototype = prototype//指定，这下a.__proto__.constructor 就是A了
var a = new A()
```
不用创建中间类F，而且构造函数A的确是造出a的（a.__proto__.constructor == A），而不是像create那样改写原型链，构造函数是B

附上原型链图解：（注意终点是null，中间的都是正常new构造，没有改写prototype）
![default](https://user-gold-cdn.xitu.io/2018/4/12/162b57180dbae81f?w=833&h=675&f=bmp&s=1687554)
