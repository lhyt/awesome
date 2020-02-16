# 前言
AOP(面向切面编程)针对业务中的一些关键点/关键时刻所做的事情(即切面)进行抽离，抽离的是代码执行的过程中的某个关键步骤。简单来说，AOP关注的是什么时间点下的什么行为/定义。

# 快速了解AOP和OOP区别
OOP(面向对象编程)对于前端er应该都很熟悉了，我们下面举个例子来对比一下AOP和OOP

## OOP
假设我们有一个“车🚗”的类：
```js
class Car {
  constructor({ name, door, material, accelaration }) {
    Object.assign(this, {
      name,
      door,
      material,
      accelaration
    })
  }

  // 起步
  start() {
    console.log('start!')
  }

  // 行驶中
  running() {
    console.log(`${this.name} is running!`)
  }


  // 开门
  open() {
    console.log(`open the ${this.door}`)
  }

  // 加速
  accelerate() {
    console.log(`accelerate with ${this.accelaration}`)
  }
}
```
然后有一个Lamborghini的类，继承于Car类


![](https://user-gold-cdn.xitu.io/2019/12/21/16f28b9e040b91d5?w=850&h=472&f=png&s=918007)

```js
class Lamborghini extends Car {
  // Lamborghini路过的时候，拥有很高的回头率，并且会被拍照
  running() {
    console.log(`${this.name} is running!`)
    console.log('girls: "Ahh! Lamborghini is comming!"')
    console.log('boys: "Look! Lamborghini is comming, let us take a photo"')
  }

  // Lamborghini开门的时候，大家都想看看车主究竟是什么样的
  open() {
    console.log(`open the ${this.door}`)
    console.log("who drive this?")
  }

  // Lamborghini加速的时候，巨大的声浪吸引了大家的回头
  accelerate() {
    console.log(`accelerate with ${this.accelaration}`)
    console.log('~~~~~~~~~~~')
    console.log("who's comming?")
  }
}

const o = new Lamborghini({ name: 'Aventador', door: 'scissors door',  material: 'carbon', accelaration: '3s 0-100'  });
o.start();
o.running();
o.accelerate();
o.open();
```
另外有一个救护车类

![](https://user-gold-cdn.xitu.io/2019/12/22/16f293a80c4d2243?w=500&h=376&f=png&s=95416)
```js

class ambulance extends Car {
  // 救护车路过的时候，大家会让开
  running() {
    console.log(`${this.name} is running!`)
    console.log('bi~bu~, bi~bu~')
    console.log('ambulance is comming, please go aside')
  }
  // 救护车开门的时候，医生会下来拯救伤员
  open() {
    console.log(`open the ${this.door}`)
    console.log("Are you ok?")
  }
  // 救护车加速的时候，没什么特别的
}
const c = new ambulance({ name: 'ambulance1', door: 'normal door',  material: 'normal', accelaration: 'normal'  });
c.start();
c.running();
c.accelerate();
c.open();
```
我们可以看见，OOP是通过继承来复用一些和父类共有的属性，如果有差异的话，那就在该子类的prototype上再定义差异之处。OOP是一种垂直上的代码复用

## AOP
AOP是面向切面、切点的编程，我们需要找到切面、切点，并把有差异的特性注入到切点前后，实现水平上的代码复用。

如果把上面的两个子类改成AOP实现，怎么做呢？首先我们可以发现，每一个子类不同的之处，只是父类的方法的一个修改。比如open方法是：
```js
// Lamborghini类open的时候
    console.log(`open the ${this.door}`)
    console.log("who drive this?")

// ambulance类open的时候
    console.log(`open the ${this.door}`)
    console.log("Are you ok?")
```
都有先`open the ${this.door}`，那么基于AOP的话，切点就是`open the ${this.door}`，我们要在`open  the door`后插入差异性的行为：
```js
function injectLamborghini(target) {
  const { open } = target.prototype
  target.prototype.open = function() {
    open.call(this) // 公共特性open，也是切点
    console.log("who drive this?") // 这就是差异性的行为
  }
  return target
}
```
同样的方法，我们将其他差异的特性注入到继承父类的一个子类里面，就是一个新的子类了：
```js
function injectLamborghini(target) {
  const { open, running, accelerate } = target.prototype
  target.prototype.open = function() {
    open.call(this) // 切点
    console.log("who drive this?")
  }
  target.prototype.running = function() {
    running.call(this) // 切点
    console.log('girls: "Ahh! Lamborghini is comming!"')
    console.log('boys: "Look! Lamborghini is comming, let us take a photo"')
  }
  target.prototype.accelerate = function() {
    accelerate.call(this) // 切点
    console.log('~~~~~~~~~~~')
    console.log("who's comming?")
  }
  return target
}
const injectLamborghiniSubClass = injectLamborghini(class extends Car{})
const o = new injectLamborghiniSubClass({ name: 'Aventador', door: 'scissors door',  material: 'carbon', accelaration: '3s 0-100'  })
o.start();
o.running();
o.accelerate();
o.open();

// injectLamborghiniSubClass可以使用装饰器语法：
// 需要babel，可以去自己的项目里面试一下
@injectLamborghini
class Lamborghini extends Car{}
```
至于ambulance类如何改成AOP风格来实现，相信大家应该心里有数了

![](https://user-gold-cdn.xitu.io/2019/12/22/16f293b2219b5327?w=56&h=56&f=png&s=1428)

# 在react中的运用
## 规避对卸载的组件setState
一个异步请求，当请求返回的时候，拿到数据马上setState并把loading组件换掉，很常规的操作。但是，当那个需要setState的组件被卸载的时候(切换路由、卸载上一个状态组件)去setState就会警告：

![](https://user-gold-cdn.xitu.io/2019/12/21/16f28ba126499b00?w=972&h=118&f=png&s=40383)

如果要解决这个问题，我们需要修改挂载、卸载、请求时的代码
```js
// 挂载
componentDidMount() {
  this._isMounted = true;
}
// 卸载
componentWillUnmount() {
   this._isMounted = false;
}
// 后面请求的时候
request(url)
.then(res => {
  if (this._isMounted) {
    this.setState(...)
  }
})
```
可以使用HOC来实现，也可以基于装饰器来实现AOP风格的代码注入。使用装饰器最终的表现就是，如果需要这个“不要对卸载的组件setState”功能的组件，加上一个装饰器即可：
```js

function safe(target) {
  const {
    componentDidMount,
    componentWillUnmount,
    setState,
  } = target.prototype;
  target.prototype.componentDidMount = function() {
    componentDidMount.call(this); // 挂载的切点
    this._isMounted = true;
  }

  target.prototype.componentWillUnmount = function() {
    componentWillUnmount.call(this);// 卸载的切点
    this._isMounted = false;
  }

  target.prototype.setState = function(...args) {
    if (this._isMounted) { // 让setstate只能在挂载后的元素进行
      setState.call(this, ...args); // setstate的切点
    }
  } 
}

// 使用的时候，只需要加一个safe的装饰器
@safe
export default class Test extends Component {
 // ...
}
```
## 在函数组件中使用
函数组件内部状态由hook维护，各种类似class组件的行为都可以使用hook来模拟。而且以后整个项目全是函数组件是一个趋势，没有class如何使用AOP呢？

其实，hook已经天生自带一丝的AOP的风格了，把一些逻辑写好封装到一个自定义hook里面，需要使用的时候，往函数组件里面插入该hook即可。

如果要在函数组件里面基于AOP来复用代码，首先，我们要明确指出切点是哪里。其次，我们要对切点前后注入其他代码。最简单的实现，就是使用发布-订阅模式往切点注入新的逻辑
```jsx
// 自定义一个hook
function useAOP(opts = {}) {
  const store = useRef({
    ...opts,
    $$trigger(key, ...args) {
      if (store[key]) {
        store[key].apply(null, args);
      }
    }
  }).current;
  return store.$$trigger;
}

// 函数组件
function Test(props) {
  const trigger = useAOP({
    mount() {
      console.log("did mount");
    },
    click() {
      console.log('click')
    }
  });
  useEffect(() => {
   // 切点是组件挂载
    trigger("mount");
  }, [trigger]); // trigger肯定是每次都一样的，只会执行一次这个effect
// 切点是点击的时候
  return <div onClick={() =>  trigger('click')}>1</div>;
}
```
上面的实现，可以支持依赖组件内部状态的情况。如果不需要依赖组件内部状态，那么我们可以直接在外面包一个函数，注入trigger到props里面：
```jsx
function createAOP(opts = {}) {
  const store = {
    ...opts,
    $$trigger(key, ...args) {
      if (store[key]) {
        store[key].apply(null, args);
      }
    }
  };
  return function(cpn) {
    return function(...args) {
      const props = args.shift(); // 给props注入trigger
      // 注意，不能直接赋值哦，只能传一个新的进去
      return cpn.apply(null, [
        { ...props, $$trigger: store.$$trigger },
        ...args
      ]);
    };
  };
}

// 函数组件Test
function Test(props) {
  const { $$trigger: trigger } = props;
  useEffect(() => {
   // 切点是组件挂载
    trigger("mount");
  }, [trigger]); // trigger肯定是每次都一样的，只会执行一次这个effect
// 切点是点击的时候
  return <div onClick={() =>  trigger('click')}>1</div>;
}

// 用的时候就用这个了
export default createAOP({
  mount() {
    console.log("did mount");
  },
  click() {
    console.log("click");
  }
})(Test)
```

## 应用场景举例
如果有两个页面，页面结构完全不一样，但是有几个接口以及数据处理逻辑是完全一样的（增删改）
```jsx
// 有两个页面，操作的时候，请求的接口方法一样

class A extends Component {
  state = {
    list: [{ info: "info1" }, { info: "info2" }]
  };
  add = () => {}
  del = (index) => {}
  edit = (index) => {}
  render() {
    // 删除和修改的时候传index进去处理某项数据
    return (
      <main>
        <button onClick={this.add}>新增</button>
        <ul>
          {this.state.list.map(({ info }, index) => (
            <li>
              <a onClick={this.del.bind(this, index)}>删除</a>
              <a onClick={this.edit.bind(this, index)}>修改</a>
              <h2>{info}</h2>
            </li>
          ))}
        </ul>
      </main>
    );
  }
}

class B extends Component {
  state = {
    list: [{ info: "不一样的信息" }, { info: "不一样的ui" }]
  };
  add = () => {}
  del = (index) => {}
  edit = (index) => {}
  render() {
    // 新增就新增，删除和修改的时候传index进去处理某项数据
    return (
      <section>
        {this.state.list.map(({ info }, index) => (
          <p>
            <span onClick={this.del.bind(this, index)}>del</span>
            <a onClick={this.edit.bind(this, index)}>edit</a>
            <footer>{info}</footer>
          </p>
        ))}
        <a onClick={this.add}>+</a>
      </section>
    );
  }
}

```
一般情况下，我们可能是把新增、修改、删除单独抽离出来，然后两个组件里面import进来，在class里面新增这些方法，和state关联起来（请求、请求成功、返回数据、setstate、做一些其他的挂在this下的操作），这样子我们还是做了一些类似且重复的事情。如果使用装饰器为这三个操作切点注入一些操作，那么最后我们只需要新增一行装饰器代码
```js
// 伪代码
function injectOperation(target) {
  target.prototype.add = function(...args) {
    // do something for this.state
    request('/api/add', {
      params: {
        // ...
      }
    }).then(r => { // this已经绑的了，对state做一些事情 })
  }
  target.prototype.edit = function() {} // 类似的
  target.prototype.del = function() {}
  return target;
}

// example，组件内部不再需要写add、edit、del函数
@injectOperation
class A extends Component {}
```


![](https://user-gold-cdn.xitu.io/2019/12/22/16f29393e1807a13?w=68&h=55&f=png&s=3260)


> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)