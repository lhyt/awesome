# 0. 前言
一个异步请求，当请求返回的时候，拿到数据马上setState并把loading组件换掉，很常规的操作。但是，当那个需要setState的组件被卸载的时候(切换路由、卸载上一个状态组件)去setState就会警告：
![image](https://user-gold-cdn.xitu.io/2018/12/5/1677a084e515a485?w=972&h=118&f=png&s=51854)
于是，一个很简单的方法也来了：
```javascript
// 挂载
componentDidMount() {
  this._isMounted = true;
}

// 卸载
componentWillUnmount() {
   this._isMounted = false;
}

// 请求
request(url)
.then(res => {
  if (this._isMounted) {
    this.setState(...)
  }
})
```
问题fix。

# 1. 不想一个个改了
项目肯定不是简简单单的，如果要考虑，所有的异步setState都要改，改到何年何日。最简单的方法，换用preact，它内部已经考虑到这个case，封装了这些方法，随便用。或者console它的组件this，有一个`__reactstandin__isMounted `的属性，这个就是我们想要的`_isMounted`。

不过，项目可能不是说改技术栈就改的，我们只能回到原来的react项目中。不想一个个搞，那我们直接改原生的生命周期和setState吧。
```javascript
// 我们让setState更加安全，叫他safe吧
function safe(setState, ctx) {
  console.log(ctx, 666);
  return (...args) => {
    if (ctx._isMounted) {
      setState.bind(ctx)(...args);
    }
  } 
}

// 在构造函数里面做一下处理
constructor() {
  super();
  this.setState = a(this.setState, this);
}

// 挂载
componentDidMount() {
  this._isMounted = true;
}

// 卸载
componentWillUnmount() {
   this._isMounted = false;
}
```

# 2. 不想直接改
直接在构造函数里面改，显得有点耍流氓，而且不够优雅。本着代码优雅的目的，很自然地就想到了装饰器`@`。如果项目的babel不支持的，安装`babel-plugin-transform-decorators-legacy`，加入babel的配置中：
```javascript
    "plugins": [
      "transform-decorators-legacy"
    ]
```
考虑到很多人用了`create-react-app`，这个脚手架原本不支持装饰器，需要我们修改配置。使用命令`npm run eject`可以弹出个性化配置，这个过程不可逆，于是就到了webpack的配置了。如果我们不想弹出个性化配置，也可以找到它的配置文件：`node_modules => babel-preset-react-app => create.js`，在plugin数组加上`require.resolve('babel-plugin-transform-decorators-legacy')`再重新启动项目即可。

回到正题，如果想优雅一点，每一个想改的地方不用写太多代码，想改就改，那么可以加上一个装饰器给组件：
```javascript
function safe(_target_) {
  const target = _target_.prototype;
  const {
    componentDidMount,
    componentWillUnmount,
    setState,
  } = target;
  target.componentDidMount = () => {
    componentDidMount.call(target);
    target._isMounted = true;
  }

  target.componentWillUnmount = () => {
    componentWillUnmount.call(target);
    target._isMounted = false;
  }

  target.setState = (...args) => {
    if (target._isMounted) {
      setState.call(target, ...args);
    }
  } 
}

@safe
export default class Test extends Component {
 // ...
}
```
这样子，就封装了一个这样的组件，对一个被卸载的组件setstate的时候并不会警告和报错。

但是需要注意的是，我们装饰的只是一个类，所以类的实例的this是拿不到的。在上面被改写过的函数有依赖this.state或者props的就导致报错，直接修饰构造函数以外的函数实际上是修饰原型链，而构造函数也不可以被修饰，这些都是没意义的而且让你页面全面崩盘。所以，最完美的还是直接在constructor里面修改this.xx，这样子实例化的对象this就可以拿到，然后给实例加上生命周期。

```javascript
// 构造函数里面
    this.setState = safes(this.setState, this);
    this.componentDidMount = did(this.componentDidMount, this)
    this.componentWillUnmount = will(this.componentWillUnmount, this)

// 修饰器
function safes(setState, ctx) {
  return (...args) => {
    if (ctx._isMounted) {
      setState.bind(ctx)(...args);
    }
  } 
}
function did(didm, ctx) {
  return(...args) => {
    ctx._isMounted = true;
    didm.call(ctx);
  }
}
function will(willu, ctx) {
  return (...args) => {
    ctx._isMounted = false;
    willu.call(ctx);
  } 
}
```

# 3. 添加业务生命周期
我们来玩一点更刺激的——给state赋值。

平时，有一些场景，props下来的都是后台数据，可能你在前面一层组件处理过，可能你在constructor里面处理，也可能在render里面处理。比如，传入1至12数字，代表一年级到高三；后台给stringify过的对象但你需要操作对象本身等等。有n种方法处理数据，如果多个人开发，可能就乱了，毕竟大家风格不一样。是不是想过有一个beforeRender方法，在render之前处理一波数据，render后再把它改回去。
```javascript
// 首先函数在构造函数里面改一波
this.render = render(this.render, this);

// 然后修饰器，我们希望beforeRender在render前面发生
function render(_render, ctx) {
  return function() {
    ctx.beforeRender && ctx.beforeRender.call(ctx);
    const r = _render.call(ctx);
    return r;
  }
} 

// 接着就是用的问题
constructor() {
    super()
    this.state = {
      a: 1
    }
  this.render = render(this.render, this);
}
  beforeRender() {
    this._state_ = { ...this.state };
    this.state.a += 100;
  }

  render() {
    return (
      <div>
        {this.state.a}
      </div>
    )
  }
```
我们可以看见输出的是101。改过人家的东西，那就得改回去，不然就是101了，你肯定不希望这样子。didmpunt或者didupdate是可以搞定，但是需要你自己写。我们可以再封装一波，在背后悄悄进行：
```javascript
// 加上render之后的操作：
function render(_render, ctx) {
  return function(...args) {
    ctx.beforeRender && ctx.beforeRender.call(ctx);
    const r = _render.call(ctx);
    // 这里只是一层对象浅遍历赋值，实际上需要考虑深度遍历
    Object.keys(ctx._state_).forEach(k => {
      ctx.state[k] = ctx._state_[k];
    })
    return r;
  }
} 
```
一个很重要的问题，千万不要`this.state = this._state_`，比如你前面的didmount在几秒后打印this.state，它还是原来的state。因为那时候持有对原state对象的引用，后来你赋值只是改变以后state的引用，对于前面的dimount是没意义的。

```javascript
// 补上componentDidMount可以测试一波
  componentDidMount() {
    setTimeout(() => {
      this.setState({ a: 2 })
    }, 500);
    setTimeout(() => {
      console.log(this.state.a, '5秒结果') // 要是前面的还原是this.state = this._state_，这里还是101
    }, 5000);
  }
```
当然，这些都是突发奇想的。考虑性能与深度遍历以及扩展性，还是有挺多优化的地方，什么时候要深度遍历，什么时候要赋值，什么时候可以换一种姿势遍历或者什么时候完全不用遍历，这些都是设计需要思考的点。

# 4. 更简单一些吧
能拿到实例的this，只能在构造函数，而构造函数不能被修饰，怎么更简单呢？那就是高阶组件了，封装好我们前面的所有逻辑，成为一个被我们改造过的特殊高阶组件：
```javascript
function Wrap(Cmp) {
  return class extends Cmp {
    constructor() {
      super()
      this.setState = safes(this.setState, this);
      this.componentDidMount = did(this.componentDidMount, this)
      this.componentWillUnmount = will(this.componentWillUnmount, this)
      this.render = render(this.render, this);
    }
  }
}

// 我们只需要这样就可以使用
@Wrap 
export default class Footer extends Component {
  constructor() {
    super()
    this.state = {
      a: 123
    }
  }
}
```
利用继承，我们再自己随意操作子类constructor的this，满足了我们的需求，而且也简单，改动不大，一个import一个装饰器。


# 5. 让我们更疯狂一点
想极致体验，又不能改源码，那就介于这两者之间——经过我们手里滋润一下下：
```javascript
// 我们写一个myreact.js文件
import * as React from 'react';
// ...前面一堆代码
function Wrap(Cmp) {}
export default React
export const Component = Wrap(React.Component)
```
我们再引入它们
```javascript
import React, { Component } from './myreact'
// 下面的装饰器也不用了，就是正常的react
// ...
```
不，这还不够极致，我们还要改import路径。最后，一种‘你懂的’眼光投向了webpack配置去：
```javascript
resolve: {
  alias: {
    '_react': './myreact', // 为什么不直接'react': './myreact'？做人嘛，总要留一条底线的
  }
}
```
对于具有庞大用户的`create-react-app`，它的配置在哪里？我们一步步来找：根路径package.json里面script是这样：
```javascript
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
```
都知道它的配置是藏着node_modules 里面的，我们找到了`react-scripts`，很快我们就看见熟悉的config，又找到了配置文件。打开webpack.config.dev.js，加上我们的alias配置代码，完事。
最后：
```javascript
import React, { Component } from '_react'
```
> 最终我们可以做到不动业务代码，就植入人畜无害的自己改过的react代码