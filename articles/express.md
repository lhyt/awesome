
# 0.前言
在node中，express可以说是node中的jQuery了，简单粗暴，容易上手，用过即会，那么我们来试一下怎么实现。下面我们基于**4.16.2**版本进行研究
# 1. 从入口开始
# 1.1入口
主入口是index.js，这个文件仅仅做了require引入express.js这一步，而express.js暴露的主要的函数createApplication，我们平时的`var app = express();`就是调用了这个函数。
```
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

//var EventEmitter = require('events').EventEmitter;
//var mixin = require('merge-descriptors');
//用了merge-descriptors这个包混合两个对象(包括set、get)，也可用assign
  mixin(app, EventEmitter.prototype, false); 
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, { //在app加上一个属性，它的值是一个对象，继承于req
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init(); //初始化
  return app;
}
```

# 1.2 proto
我们也看见有proto这个东西，其实他是`var proto = require('./application');`这样来的，而这个文件就是给app这个对象写上一些方法：
```
var app = exports = module.exports = {};
app.init = function (){}
app.handle = function (){}
app.use = function (){}
app.route = function (){}
//此外，下面的还有listen,render,all,disable,enable,disabled,set,param,engine等方法
```
上面我们已经把这个application.js的app对象和express.js里面的app对象混合，也就是express.js这个文件里面的app.handle、app.init也是调用了这个文件的
# 1.2.1 app.init方法
其实就是初始化
```
app.init = function init() {
  this.cache = {};
  this.engines = {};
  this.settings = {}; //存放配置
  this.defaultConfiguration(); //默认配置
};
```
defaultConfiguration默认配置：已省略一些代码
```
app.defaultConfiguration = function defaultConfiguration() {
  // 默认设置
  this.enable('x-powered-by');
  this.set('etag', 'weak');
  this.set('env', env);
    // 让app继承父的同名属性
    setPrototypeOf(this.request, parent.request)
    setPrototypeOf(this.response, parent.response)
    setPrototypeOf(this.engines, parent.engines)
    setPrototypeOf(this.settings, parent.settings)
  });

  // setup locals
  this.locals = Object.create(null);

  // top-most app is mounted at /
  this.mountpath = '/';

  // default locals
  this.locals.settings = this.settings;

  // default configuration
  this.set('view', View);
  this.set('views', resolve('views'));
  this.set('jsonp callback name', 'callback');
};
```
我们再看app.set
```
app.set = function set(setting, val) {
  if (arguments.length === 1) {
    // 只传一个参数直接返回结果
    return this.settings[setting];
  }

  //对settings设置值
  this.settings[setting] = val;

  // 值的匹配，具体过程略过
  switch (setting) {
    case 'etag':
      break;
    case 'query parser':
      break;
    case 'trust proxy':
      break;
  }
  return this;
};
```
# 1.2.2 app.handle方法
把回调函数先写好
```
app.handle = function handle(req, res, callback) {
  var router = this._router;
  // 路由匹配成功触发回调
  var done = callback || finalhandler(req, res, {
    env: this.get('env'),
    onerror: logerror.bind(this)
  });
  // 没有路由
  if (!router) {
    done();
    return;
  }
  router.handle(req, res, done);
};
```
那么，我们的`this._router`来自哪里？
# 1.2.3 每一个method的处理
我们的`this._router`来自 this.lazyrouter()方法
```
//methods是常见的http请求以及其他一些方法名字的字符串数组
methods.forEach(function(method){
//app.get app.post等等我们常用的api
  app[method] = function(path){
    if (method === 'get' && arguments.length === 1) {
      // app.get(setting)
      return this.set(path);
    }

    this.lazyrouter();

    var route = this._router.route(path);
    route[method].apply(route, slice.call(arguments, 1)); //就是常用的route.get('/page',callback)
    return this;
  };
});
```
# 1.2.4 app.lazyrouter产生this._router
```
app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({ //新建路由
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });

    this._router.use(query(this.get('query parser fn')));
    this._router.use(middleware.init(this));
  }
};
```

# 2. Router(下文讲到router和route，注意区分)
实际上就是`var Router = require('./router');`，于是我们打开router这个文件夹。
- index.js: Router类，他的stack用于存储中间件数组，处理所有的路由
- layer.js 中间件实体Layer类，处理各层路由中间件或者普通中间件；
- route.js Route类，用于处理子路由和不同方法（get、post）的路由中间件
## 2.1 index.js文件
上面我们也看见了new一个新路由的过程，index.js用于处理存储中间件数组。在router文件夹下的index.js里面，暴露的是proto，我们require引入的Router也是proto：
```
var proto = module.exports = function(options) {
  var opts = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // router也获得了proto 的方法了
  setPrototypeOf(router, proto)

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = []; //栈存放中间件

  return router;
};
//接下来是proto的一些方法：proto.param 、proto.handle 、proto.process_params、proto.use、proto.route
//后面是对于methods加上一个all方法，进行和上面methods类似的操作
methods.concat('all').forEach(function(method){
  proto[method] = function(path){ //route.all, route.get, router.post
    var route = this.route(path)
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});
```
this.route方法
```
proto.route = function route(path) {
  var route = new Route(path);
  var layer = new Layer(path, { //layer是中间件实体
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route; //注意这里

  this.stack.push(layer); //中间件实体压入Router路由栈
  return route;
};
```
## 2.2 layer.js
```
function Layer(path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);//无new调用
  }

  var opts = options || {};
  this.handle = fn;
  this.name = fn.name || '<anonymous>';
  this.params = undefined;
  this.path = undefined;
  this.regexp = pathRegexp(path, this.keys = [], opts);

  // 路径匹配相关设置
  this.regexp.fast_star = path === '*'
  this.regexp.fast_slash = path === '/' && opts.end === false
}

Layer.prototype.handle_request = function handle(req, res, next) {
  var fn = this.handle;

  if (fn.length > 3) {//参数是req,res,next，长度是3,这时候有next了
    return next();
  }
  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
```
Layer.prototype后面接着handle_error（处理错误）、match（正则匹配路由）、decode_param（decodeURIComponent封装）方法，具体不解释了

# 3. 中间件
我们平时这么用的:
```
app.use((req,res,next)=>{
  //做一些事情
  //next() 无next或者res.end，将会一直处于挂起状态
});
app.use(middlewareB);
app.use(middlewareC);
```
## 3.1 app.use
使用app.use(middleware)后，传进来的中间件实体（一个函数，参数是req,res,next）压入路由栈，执行完毕后调用next()方法执行栈的下一个函数。中间件有app中间件和路由中间件，其实都是差不多的，我们继续回到路由proto对象(也就是Router对象)：
```
proto.use = function use(fn) {
  var offset = 0; //表示从第几个开始
  var path = '/';//默认是/

//如果第一个参数不是函数，app.use('/page',(req,res,next)=>{})
  if (typeof fn !== 'function') {
    var arg = fn;

//考虑到第一个参数是数组
    while (Array.isArray(arg) && arg.length !== 0) { //一直遍历，直到arg不是数组
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1; //如果第一个参数不是函数，从第二个开始
      path = fn; //app.use('/page',(req,res,next)=>{}),第一个参数是路径
    }
  }

  var callbacks = flatten(slice.call(arguments, offset)); //数组扁平化与回调函数集合
  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i];
    // 增加中间件
    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);

    layer.route = undefined;  //如果是路由中间件就是一个Route对象，否则就是undefined。
//如果是路由中间件，在index.js的proto.route方法里面，给layer实例定义layer.route = route 
    this.stack.push(layer);//压入Router对象的栈中
  }
  return this;
};
```
## 3.2 route.js文件对methods数组处理
这个文件是用于处理不同method的，后面有一段与前面类似的对methods关键代码:
```
methods.forEach(function(method){
  Route.prototype[method] = function(){    //app.get('/page',(req,res,next)=>{})就这样子来的
    var handles = flatten(slice.call(arguments));
    for (var i = 0; i < handles.length; i++) {
      var handle = handles[i];
      var layer = Layer('/', {}, handle);
      layer.method = method;

      this.methods[method] = true;
      this.stack.push(layer);
    }


    return this;
  };
});
```
## 3.3 中间件种类
### 普通与路由中间件
- 普通中间件：app.use，不管是什么请求方法，只要路径匹配就执行回调函数
- 路由中间件：根据HTTP请求方法的中间件，路径匹配和方法匹配才执行
所以有两种Layer：
- 普通中间件Layer，保存了name，回调函数已经undefined的route变量。
- 路由中间件Layer，保存name和回调函数，route还会创建一个route对象
还有，中间件有父子之分：
![1](https://user-gold-cdn.xitu.io/2018/7/6/1646e3fb84989f6c?w=323&h=266&f=png&s=30442)
### Router与Route
Router类的Layer实例对象layer.route为undefined表示这个layer为普通中间件；如果layer.route是Route实例对象，这个layer为路由中间件，但没有method对象。而route对象的Layer实例layer是没有route变量的，有method对象，保存了HTTP请求类型，也就是带了请求方法的路由中间件。

所以Router类中的Layer实例对象是保存普通中间件的实例或者路由中间件的路由，而Route实例对象route中的Layer实例layer是保存路由中间件的真正实例。

![](https://user-gold-cdn.xitu.io/2018/7/6/1646dcd1bb2f8289?w=698&h=435&f=png&s=31225)

- Route类用于创建路由中间件，并且创建拥有多个方法（多个方法是指app.get('/page',f1,f2...)中的那堆回调函数f1、f2...）的layer（对于同一个路径app.get、app.post就是两个layer）保存stack中去。
- Router类的主要作用是创建一个普通中间件或者路由中间件的引导（layer.route = route），然后将其保存到stack中去。
-  Route类实例对象的stack数组保存的是中间件的方法的信息（get，post等等），Router类实例对象的stack数组保存的是路径（path）
# 4. 模板引擎
我们平时这样做的:
```
app.set('views', path.join(__dirname, 'views')); //设置视图文件夹
app.set('view engine', 'jade'); //使用什么模板引擎

//在某个请求里面，使用render
res.render('index');  //因为设置了app.set('view engine', 'jade'); ，所以我们不用res.render('index.jade');
```
set方法前面讲过，给setting对象加上key-value。然后我们开始调用render函数
## 4.1 从res.render开始
我们来到response.js，找到这个方法：
```
res.render = function render(view, options, callback) {
  var app = this.req.app;
  var done = callback;
  var opts = options || {};
  var req = this.req;
  var self = this;
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  opts._locals = self.locals;
  done = done || function (err, str) { //我们不写callback的时候，如res.render('index',{key:1}); 
    if (err) return req.next(err);
    self.send(str); //把对象转字符串发送
  };
  app.render(view, opts, done);
};
```
我们发现最后来到了app.render，我们简化一下代码
```
app.render = function render(name, options, callback) {
  var cache = this.cache;
  var done = callback;
  var engines = this.engines;
  var opts = options;
  var renderOptions = {};
  var view;
//对renderOptions混合 this.locals、opts._locals、opts
  merge(renderOptions, this.locals);
  if (opts._locals) {
    merge(renderOptions, opts._locals);
  }
  merge(renderOptions, opts);

  if (!view) {//第一次进，如果没有设置视图
    var View = this.get('view');
    view = new View(name, { //引用了view.js的View类
      defaultEngine: this.get('view engine'),
      root: this.get('views'),
      engines: engines
    });

  tryRender(view, renderOptions, done); //渲染函数，内部调用view.render(options, callback);
};
```
# 4.2 view.js
view.render方法在此文件中找到，实际上它内部再执行了this.engine(this.path, options, callback)。而engine方法是在View构造函数里面设置：
```
function View(name, options) {
  var opts = options || {};
  this.defaultEngine = opts.defaultEngine;
  this.ext = extname(name);
  this.name = name;
  this.root = opts.root;
  var fileName = name;
  if (!this.ext) {
    this.ext = this.defaultEngine[0] !== '.'
      ? '.' + this.defaultEngine
      : this.defaultEngine;
    fileName += this.ext;
  }

  if (!opts.engines[this.ext]) {
    var mod = this.ext.substr(1) //获取后缀 ejs、jade
 // 模板引擎对应express的处理函数，具体内容大概是把模板转为正常的html，这里不研究了
    var fn = require(mod).__express 

    if (typeof fn !== 'function') { //如果模板引擎不支持express就报错
      throw new Error('Module "' + mod + '" does not provide a view engine.')
    }
    opts.engines[this.ext] = fn 
    
    //当然，application.js也有类似的设置，现在是无opts.engines[this.ext]的情况下的设置
    //若app.engine设置过了就不会来到这里了
  }

  this.engine = opts.engines[this.ext];  // 设置模板引擎对应于express的编译函数
  this.path = this.lookup(fileName);// 寻找路径
}
```
那么this.engine(this.path, options, callback)实际上就是require(mod).__express(this.path, options, callback)，如果那个模板引擎支持express，那就按照他的规则走


> 看见一些文章说中间件用connect模块做的，我看了一下connect的确是可以，而且形参一模一样，但是我看源码里面压根就没有connect的影子。connect应该算是早期的express吧