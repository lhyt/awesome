# 0.前言
我们知道最常见的模块化方案有CommonJS、AMD、CMD、ES6，AMD规范一般用于浏览器，异步的，因为模块加载是异步的，js解释是同步的，所以有时候导致依赖还没加载完毕，同步的代码运行结束；CommonJS规范一般用于服务端，同步的，因为在服务器端所有文件都存储在本地的硬盘上，传输速率快而且稳定。
# 1.script标签引入
最开始的时候，多个script标签引入js文件。但是，这种弊端也很明显，很多个js文件合并起来，也是相当于一个script，造成变量污染。项目大了，不想变量污染也是很难或者不容易做到，开发和维护成本高。
而且对于标签的顺序，也是需要考虑一阵，还有加载的时候同步，更加是一种灾难，幸好后来有了渲染完执行的defer和下载完执行的async，进入新的时代了。

接着，就有各种各样的动态创建script标签的方法，最终发展到了上面的几种方案。


# 2.AMD与CMD
## 2.1AMD
异步模块定义，提供定义模块及异步加载该模块依赖的机制。AMD遵循依赖前置，代码在一旦运行到需要依赖的地方，就马上知道依赖是什么。而无需遍历整个函数体找到它的依赖，因此性能有所提升。但是开发者必须先前知道依赖具体有什么，并且显式指明依赖，使得开发工作量变大。而且，不能保证模块加载的时候的顺序。
典型代表requirejs。require.js在声明依赖的模块时会立刻加载并执行模块内的代码。require函数让你能够随时去依赖一个模块，即取得模块的引用，从而即使模块没有作为参数定义，也能够被使用。他的风格是依赖注入，比如：
```javascript
/api.js
define('myMoudle',['foo','bar'],function(foo,bar){
    //引入了foo和bar，利用foo、bar来做一些事情
    return {
        baz:function(){return 'api'}
               }
});
require(['api'],function(api) {
	console.log(api.baz())
})
```

然后你可以在中间随时引用模块，但是模块第一次初始化的时间比较长。这就像开始的时候很拼搏很辛苦，到最后是美滋滋。
## 2.2CMD
通用模块定义，提供模块定义及按需执行模块。遵循依赖就近，代码在运行时，最开始的时候是不知道依赖的，需要遍历所有的require关键字，找出后面的依赖。一个常见的做法是将function toString后，用正则匹配出require关键字后面的依赖。CMD 里，每个 API 都简单纯粹。可以让浏览器的模块代码像node一样，因为同步所以引入的顺序是能控制的。
对于典型代表seajs，一般是这样子：

```javascript
define(function(require,exports,module){
    //...很多代码略过
     var a = require('./a');
    //要用到a，于是引入了a
    //做一些和模块a有关的事情

});
```
对于b.js依赖a.js
```javascript
//a.js
define(function(require, exports) {
    exports.a = function(){//也可以把他暴露出去
    // 很多代码	
    };
});

//b.js
define(function(require,exports){
      //前面干了很多事情，突然想要引用a了
        var fun = require('./a');
　　　　console.log(fun.a()); // 就可以调用到及执行a函数了。
   })

//或者可以use
seajs.use(['a.js'], function(a){
    //做一些事情
});
```

AMD和CMD对比：
AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。

AMD需要先列出清单，后面使用的时候随便使用（依赖前置），异步，特别适合浏览器环境下使用（底层其实就是动态创建script标签）。而且API 默认是一个当多个用。

CMD不需要知道依赖是什么，到了改需要的时候才引入，而且是同步的，就像临时抱佛脚一样。

对于客户端的浏览器，一说到下载、加载，肯定就是和异步脱不了关系了，注定浏览器一般用AMD更好了。但是，CMD的api都是有区分的，局部的require和全局的require不一样。

# 3.CommonJS与ES6
## 3.1 ES6

ES6模块的script标签有点不同，需要加上type='module'
```html
<script src='./a.js' type='module'>...</script>
```

对于这种标签都是异步加载，而且是相当于带上defer属性的script标签，不会阻塞页面，渲染完执行。但是你也可以手动加上defer或者async，实现期望的效果。
ES6模块的文件后缀是mjs，通过import引入和export导出。我们一般是这样子：
```javascript
//a.mjs
import b from 'b.js'
//b.mjs
export default b
```
ES6毕竟是ES6，模块内自带严格模式，而且只在自身作用域内运行。在ES6模块内引入其他模块就要用import引入，暴露也要用export暴露。另外，一个模块只会被执行一次。
import是ES6新语法，可静态分析，提前编译。他最终会被js引擎编译，也就是可以实现编译后就引入了模块，所以ES6模块加载是静态化的，可以在编译的时候确定模块的依赖关系以及输入输出的变量。ES6可以做到编译前分析，而CMD和AMD都只能在运行时确定具体依赖是什么。

## 3.2CommonJS
一般服务端的文件都在本地的硬盘上面。对于客户，他们用的浏览器是要从这里下载文件的，在服务端一般读取文件非常快，所以同步是不会有太大的问题。require的时候，马上将require的文件代码运行

代表就是nodejs了。用得最多的，大概就是：
```javascript
//app.js
var route = require('./route.js')//读取控制路由的js文件

//route.js
var route  = {......}
module.exports = route
```
require 第一次加载脚本就会马上执行脚本，生成一个对象

区别：
CommonJS运行时加载，输出的是值的拷贝，是一个对象（都是由module.export暴露出去的），可以直接拿去用了，不用再回头找。所以，当module.export的源文件里面一些原始类型值发生变化，require这边不会随着这个变化而变化的，因为被缓存了。但是有一种常规的操作，写一个返回那个值的函数。就像angular里面$watch数组里面的每一个对象，旧值是直接写死，新值是写一个返回新值的函数，这样子就不会写死。module.export输出一个取值的函数，调用的时候就可以拿到变化的值。

ES6是编译时输出接口，输出的是值的引用，对外的接口只是一种静态的概念，在静态解释后已经形成。当脚本运行时，根据这个引用去原本的模块内取值。所以不存在缓存的情况，import的文件变了，谁发出import的也是拿到这个变的值。模块里面的变量绑定着他所在的模块。另外，通过import引入的这个变量是只读的，试图进行对他赋值将会报错。



# 4.循环依赖
就是a依赖b，b依赖a，对于不同的规范也有不同的结果。
## 4.1CommonJS
对于node，每一个模块的exports={done:false}表示一个模块有没有加载完毕，经过一系列的加载最后全部都会变为true。
同步，从上到下，只输出已经执行的那部分代码
首先，我们写两个js用node跑一下：
```javascript
//a.js
console.log('a.js')
var b = require('./b.js')
console.log(1)
//b.js
console.log('b.js')
var a = require('./a.js')
console.log(2)

//根据他的特点，require一个文件的时候，马上运行内部的代码，所以相当于
console.log('a.js')
console.log('b.js')
console.log(2)
console.log(1)
//输出是a.js、b.js、2、1
```

加上export的时候：
```javascript
//a.js
module.exports = {val:1}
var b = require('./b.js')
console.log(b.val)
module.exports = {val:2}
b.val = 3
console.log(b)

//b.js
module.exports = {val:1}
var a = require('./a.js')
console.log(a.val)
module.exports = {val:2}
a.val = 3
console.log(a)

//1.在a.js暴露出去一个对象module.exports = {val:1}
//2.require了b，来到b，运行b脚本
//3.b的第一行，把{val:1}暴露出去，引入刚刚a暴露的{val:1}，打印a.val的结果肯定是1
//4.重新暴露一次，是{val:2}，然后做了一件多余的事情，改a.val为3（反正是拷贝过的了怎么改都不会影响a.js），毫无疑问打印出{ val: 3 }
//5.回到a，继续第三行，打印b.val，因为b暴露的值是2，打印2
//6.继续再做一件无意义的事情，打印{ val: 3 }
```
解决办法：代码合理拆分

## 4.2ES6模块
ES6模块是输出值的引用，是动态引用，等到要用的时候才用，因此可以完美实现相互依赖，在相互依赖的a.mjs和b.mjs，执行a的时候，当发现import马上进入b并执行b的代码。当在b发现了a的时候，已经知道从a输入了接口来到b的，不会回到a。但是在使用的过程中需要注意，变量的顺序。

如果是单纯的暴露一个基本数据类型，当然会报错not defined。
因为函数声明会变量提升，所以我们可以改成函数声明（不能用函数表达式）
```javascript
//a.mjs
import b from './b'
console.log(b())
function a(){return 'a'}
export default a
//b.mjs
import a from './a'
console.log(a())
function b(){return 'b'}
export default b
```

## 4.3 require
我们一般使用的时候，都是依赖注入，如果是有循环依赖，那么可以直接利用require解决
```javascript
define('a',['b'],function(b){
    //dosomething
});
define('b',['a'],function(a){
    //dosomething
});
//为了解决循环依赖，在循环依赖发生的时候，引入require：
define('a',['b','require'],function(b,require){
    //dosomething
    require('b')
});
```

## 4.4 sea
循环依赖，一般就是这样
```javascript
//a.js
define(function(require, exports, module){
    var b = require('./b.js');
    //......
});
//b.js
define(function(require, exports, module){
    var a = require('./a.js');
    //......
});
```
而实际上，并没有问题，因为sea自己解决了这个问题：
一个模块有几种状态：
>'FETCHING':  模块正在下载中 
'FETCHED':  模块已下载 
'SAVED':  模块信息已保存 
'READY':  模块的依赖项都已下载，等待编译 
'COMPILING':模块正在编译中 
'COMPILED':  模块已编译 

步骤：
- 1.模块a下载并且下载完成FETCHED
- 2.编译a模块（执行回调函数）
- 3.遇到了依赖b，b和自身没有循环依赖，a变成SAVED
- 4.模块b下载并且下载完成FETCHED
- 5.b遇到了依赖a，a是SAVED，和自身有循环依赖，b变成READY，编译完成后变成COMPILED
- 6.继续回到a，执行剩下的代码，如果有其他依赖继续重复上面步骤，如果所有的依赖都是READY，a变成READY
- 7.继续编译，当a回调函数部分所有的代码运行完毕，a变成COMPILED


对于所有的模块相互依赖的通用的办法，将相互依赖的部分抽取出来，放在一个中间件，利用发布订阅模式解决

# 5.webpack是如何处理模块化的
假设我们定义两个js：app.js是主入口文件，a.js、b.js是app依赖文件，用的是COMMONJS规范
webpack首先会从入口模块app.js开始，根据引入方法require把所有的模块都读取，然后写在一个列表上：
```javascript
var modules = {
  './b.js': generated_b,
  './a.js': generated_a,
  './app.js': generated_app
}
```
'generated_'+name是一个IIFE，每个模块的源代码都在里面，不会暴露内部的变量。比如对于没有依赖其他模块的a.js一般是这样，没有变化：
```javascript
function generated_a(module, exports, webpack_require) {
   // ...a的全部代码
}
```

对于app.js则不一样了：
```javascript
function generated_app(module, exports, webpack_require) {
  var a_imported_module = __webpack_require__('./a.js');
  var b_imported_module = __webpack_require__('./b.js');
  a_imported_module['inc']();
  b_imported_module['inc']();
}
```
__webpack_require__就是require、exports、import这些的具体实现，够动态地载入模块a、b，并且将结果返回给app

对于webpack_require，大概是这样的流程
```javascript
var installedModules = {};//保存已经加载完成的模块
function webpack_require(moduleId) {
  if (installedModules[moduleId]) {//如果已经加载完成直接返回
    return installedModules[moduleId].exports;
  }
  var module = installedModules[moduleId] = {//如果是第一次加载，则记录在表上
            i: moduleId,
            l: false,//没有下载完成
            exports: {}
  };
//在模块清单上面读取对应的路径所对应的文件，将模块函数的调用对象绑定为module.exports，并返回
  modules[moduleId].call(module.exports, module, module.exports,__webpack_require__);
  module.l = true;//下载完成
  return module.exports;
}
```

对于webpack打包后的文件，是一个庞大的IIFE，他的内容大概是这样子：

```javascript
(function(modules) { 
    var installedModules = {};
    function __webpack_require__(moduleId) { /*...*/}
    __webpack_require__.m = modules;//所有的文件依赖列表
    __webpack_require__.c = installedModules;//已经下载完成的列表
    __webpack_require__.d = function(exports, name, getter) {//定义模块对象的getter函数
        if(!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                configurable: false,
                enumerable: true,
                get: getter
            });
        }
    };
    __webpack_require__.n = function(module) {//当和ES6模块混用的时候的处理
        var getter = module && module.__esModule ?//如果是ES6模块用module.default
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };//是COMMONJS则继续用module
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
    __webpack_require__.o = function(object, property) { //判断是否有某种属性（如exports）
return Object.prototype.hasOwnProperty.call(object, property); 
};
    __webpack_require__.p = "";//默认路径为当前
    return __webpack_require__(__webpack_require__.s = 0);//读取第一个模块
})
/************************************************************************/
//IIFE第二个括号部分
([
(function(module, exports, __webpack_require__) {
var a = __webpack_require__(1);
var b = __webpack_require__(2);
//模块app代码
}),

(function(module, exports, __webpack_require__) {
//模块a代码
module.exports = ...
}),
(function(module, exports, __webpack_require__) {
//模块b代码
module.exports = ...
})
]);
```


如果是ES6模块，处理的方法也不一样。还是假设我们定义两个js：app.js是主入口文件，a.js、b.js是app依赖文件。
```javascript
(function(modules) {
//前面这段是一样的
})
([
(function(module, __webpack_exports__, __webpack_require__) {//入口模块
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    var __WEBPACK_IMPORTED_MODULE_0__m__ = __webpack_require__(1);
    var __WEBPACK_IMPORTED_MODULE_1__m__ = __webpack_require__(2);
    Object(__WEBPACK_IMPORTED_MODULE_0__m__["a"])();//用object包裹着，使得其他模块export的内容即使是基本数据类型，也要让他变成一个引用类型
    Object(__WEBPACK_IMPORTED_MODULE_1__m__["b"])();

}),
(function(module, __webpack_exports__, __webpack_require__) {
__webpack_exports__["a"] = a;//也就是export xxx
//....
}),
(function(module, __webpack_exports__, __webpack_require__) {
__webpack_exports__["b"] = b;
//....
})
]);

```
