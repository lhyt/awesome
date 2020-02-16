> 如果觉得没有面试题，那么lodash每一个方法就可以当作一个题目，可以看着效果反过来实现，以不同的方法实现、多种方法实现，巩固基础。除了某些一瞬间就可以实现的函数，下面抽取部分函数作为试炼。时代在进步，下文所有的解法都采用es2015+

<span style="color: red">本文实现方法都是看效果倒推实现方法，并进行一些拓展和思考，和源码无关。lodash这个库在这里更像一个题库，给我们刷题的</span>

能收获什么：
- 修炼代码基本功，了解常见的套路
- 了解到一些操作的英文命名和规范
- 积累经验，面对复杂逻辑问题可以迅速解决
- 也许可以查到自己的js基础知识的漏洞

注意：
- 三星难度以上的会具体拓展和讲解
- 文中使用的基本都是数组原生api以及es6+函数式编程，代码简洁且过程清晰
- 如果说性能当然是命令式好，实现起来稍微麻烦一些而且比较枯燥无味
- 时代在进步，人生苦短，我选择语法糖和api。面临大数据的性能瓶颈，才是考虑命令式编程的时候

> 函数系列的总体难度比之前的数组、集合系列都要大一些。恰好，lodash函数系列的方法是面试中经常会问到的

# bind
- `_.bind(func, thisArg, [partials])`创建一个函数 func，这个函数的 this 会被绑定在 thisArg。 并且任何附加在 _.bind 的参数会被传入到这个绑定函数上。 这个 _.bind.placeholder 的值，默认是以 _ 作为附加部分参数的占位符。
- 注意: 不同于原生的 Function#bind，这个方法不会设置绑定函数的 length 属性。
- 参数：func (Function)是要绑定的函数。thisArg (*)的这个 this 会被绑定给 func。[partials] (...*)指附加的部分参数
- 返回值 (Function)：新的绑定函数
- 难度系数： ★★★★
- 建议最长用时：12min

```js
var greet = function(greeting, punctuation) {
  return greeting + ' ' + this.user + punctuation;
};

var object = { 'user': 'fred' };

var bound = _.bind(greet, object, 'hi');
bound('!');
// => 'hi fred!'

// 使用了占位符
var bound = _.bind(greet, object, _, '!');// 填了第二个参数
bound('hi'); // 再传第一个参数
// => 'hi fred!'

var bound = _.bind(greet, object, _, "!");// 填了第二个参数
bound(_, "hi")// 填了第2个参数，第一个参数`_`补上初始参数第一个空格，第二个参数hi接在后面
// => 'fred!'
```

参考代码
```js
const _ = {
  bind(f, thisArg, ...rest) {
    return function(...args) {
// 参数有空格，走新的逻辑
      return f.apply(thisArg, (rest.includes(_) || args.includes(_))? _.mergeArgs(rest, args):  [...rest, ...args])
    }
  },
  toString() {
    return '' // 隐式转换
  },
  mergeArgs(init, args) {
    return init.map((arg) => {
// 执行时传入的参数作为填补
      if (arg === _ && args.length) {
        return args.shift()
      }
      return arg
    }).concat(args) // 剩下的参数都接到后面
  }
}
```
实现一个bind倒是很简单，但是lodash的bind还有填空格的操作。把lodash自己填进去就是一个空格，而且我们还可以从`console.log(bound(_, "hi"))`发现，它具有隐式转换：`_ + '' === ''`。实现lodash的bind的时候，除了兼容正常的函数bind之外，还要兼容传入`_`的时候的空格的case，并merge初始化参数和调用时参数


# curry
## 正向柯里化
- `_.curry(func, [arity=func.length])`创建一个函数，该函数接收一个或多个 func 的参数。 当该函数被调用时,如果 func 所需要传递的所有参数都被提供，则直接返回 func 所执行的结果。 否则继续返回该函数并等待接收剩余的参数。 可以使用 func.length 强制需要累积的参数个数。
- 这个 _.curry.placeholder 的值，默认是以 _ 作为附加部分参数的占位符。
- 注意: 这个方法不会设置 "length" 到 curried 函数上。
- 参数:` func (Function)`是需要 curry 的函数。`[arity=func.length] (number)`是指需要提供给 func 的参数数量
- 返回 curry 后的函数
- 难度系数： ★★★★★
- 建议最长用时：15min

```js
// example
var abc = function(a, b, c) {
  return [a, b, c];
};

var curried = _.curry(abc);

curried(1)(2)(3);
// => [1, 2, 3]

curried(1, 2)(3);
// => [1, 2, 3]

curried(1, 2, 3);
// => [1, 2, 3]

// 使用了占位符
curried(1)(_, 3)(2);
// => [1, 2, 3]
```

参考代码：
```js
const _ = {
  curry(f, arity = f.length) {
    return function(...initValues) {
// 每次执行，都是一个新的闭包，executes的位置要放这里
      let executes = initValues
      function curried(...args) {
// 兼容空格
        const newArgs = _.mergeArgs(executes, args)
        executes = newArgs
// 过滤空格的真实长度
        if (_.getReallLength(newArgs) < arity) {
          return curried
        }
        const ret = f.apply(null, newArgs)
        return ret
      }
      return curried
    }
  },
  toString() {
    return ''
  },
  mergeArgs(init, args) {
// 有没有空格
    if (!init.includes(_)) {
      return [...init, ...args]
    }
    return init.map((arg) => {
      if (arg === _ && args.length) {
        return args.shift()
      }
      return arg
    }).concat(args)
  },
  getReallLength(args) {
// 获取真实长度
    return args.filter(arg => arg !== _).length
  }
}

function curry(f, arity = f.length) {
  const executes = []
  function curried(...args) {
    executes.push(...args)
    if (executes.length < arity) {
      return curried
    }
    const ret = f.apply(null, executes)
    executes.length = 0
    return ret
  }
  return curried
}
```
家喻户晓的柯里化，可能很多人都会写。但是在这里还要考虑到lodash的空格以及柯里化函数多次复用

## 反向柯里化
原理一样，只是取参数的时候从右边往左边取
- 难度系数： ★★★★★★(如果已经实现里正向柯里化curry，难度降为1星)
- 建议最长用时：18min

example
```js
var abc = function(a, b, c) {
  return [a, b, c];
};

var curried = _.curryRight(abc);

curried(3)(2)(1);
// => [1, 2, 3]

curried(2, 3)(1);
// => [1, 2, 3]

curried(1, 2, 3);
// => [1, 2, 3]

// 使用了占位符
curried(3)(1, _)(2);
// => [1, 2, 3]
```

参考代码：
```js
// 只需要把上文的mergeArgs方法改一下即可
  _.mergeArgs = function(init, args) {
    if (!init.includes(_)) {
// 就改这里，换个位置
      return [...init, ...args]
    }
    return init.map((arg) => {
      if (arg === _ && args.length) {
        return args.shift()
      }
      return arg
    }).concat(args)
  },
```

# debounce
- `_.(func, [wait=0] debounce, [options])`创建一个防抖动函数。 该函数会在 wait 毫秒后调用 func 方法。 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options 对象决定如何调用 func 方法， options.leading 与|或 options.trailing 决定延迟前后如何触发。 func 会传入最后一次传入的参数给防抖动函数。 随后调用的防抖动函数返回是最后一次 func 调用的结果。
- 注意: 如果 leading 和 trailing 都设定为 true。 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用防抖方法。
- 参数
- - func (Function)
要防抖动的函数
- - [wait=0] (number)
需要延迟的毫秒数
- - [options] (Object)
选项对象
- - [options.leading=false] (boolean)
指定调用在延迟开始前
- - [options.maxWait] (number)
设置 func 允许被延迟的最大值
- - [options.trailing=true] (boolean)
指定调用在延迟结束后
- 返回值 (Function)
返回具有防抖动功能的函数
- 难度系数： ★★★★★★
- 建议最长用时：20min

> 我相信，80%的人可以1分钟内写出trailing模式的debounce方法(定时器到了就执行函数，在定时器还没到期间重复执行函数，定时器重置)，但是同时支持options配置和leading模式的话，难度大大增加了

参考代码：
```js
// 执行方式：delay前、delay后、delay前后
function execute(f, timeout, ref, { isDelay, isDirectly }) {
  if (!ref.last && isDirectly) {
// 调用上一次保存下来的方法
    ref.isExecute = true
    ref.last = f
    f()
  }
  return setTimeout(() => {
    if (isDirectly) {
// 调用了就清掉
      ref.last = null
    }
    ref.isExecute = true
    if (isDelay) {
      f()
    }
  }, timeout);
}

function debounce(func, wait = 0, options = {}) {
  const { leading, maxWait, trailing = true } = options
  const ref = {
    t: undefined,
    isExecute: false, // 给maxWait用的标记
    maxWaitTimer: undefined,
    last: undefined, // leading模式用的
  }
  return function(...args) {
    const main = () => func.apply(null, args)
// 最大超时时间设置
    if ('maxWait' in options && !ref.maxWaitTimer) {
      ref.maxWaitTimer = setTimeout(() => {
        if (!ref.isExecute) {
          ref.maxWaitTimer = undefined
          return main()
        }
      }, maxWait);
    }
    clearTimeout(ref.t)
// 支持trailing、leading模式选择
    ref.t = execute(main, wait, ref, { isDelay: trailing, isDirectly: leading })
  }
}
```

# throttle
- `_.throttle(func, [wait=0], [options])`创建一个节流函数，在 wait 秒内最多执行 func 一次的函数。 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options 对象决定如何调用 func 方法， options.leading 与|或 options.trailing 决定 wait 前后如何触发。 func 会传入最后一次传入的参数给这个函数。 随后调用的函数返回是最后一次 func 调用的结果。
- 注意: 如果 leading 和 trailing 都设定为 true。 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用。
- 参数: 
- - `func (Function)`
要节流的函数
- - [wait=0] (number)
需要节流的毫秒
- - [options] (Object)
选项对象
- - [options.leading=true] (boolean)
指定调用在节流开始前
- - [options.trailing=true] (boolean)
指定调用在节流结束后
- 返回值 (Function)
返回节流的函数
- 难度系数： ★★★★★
- 建议最长用时：15min


参考代码：
```js
function throttle(func, wait = 0, options = {}) {
  const { leading = true, maxWait, trailing } = options
  const ref = {
    t: undefined,
    isExecute: false,
    maxWaitTimer: undefined,
    last: undefined,
  }
  return function(...args) {
    const main = () => func.apply(null, args)
    if ('maxWait' in options && !ref.maxWaitTimer) {
      ref.maxWaitTimer = setTimeout(() => {
        if (!ref.isExecute) {
          ref.maxWaitTimer = undefined
          return main()
        }
      }, maxWait);
    }
    if (!ref.isExecute) {
      if (leading) {
        ref.isExecute = true
        main()
      }
      if (!ref.last && trailing) {
// 先记录下等下trailing模式要执行的函数
        ref.last = main
      }
    }
    if (ref.t === undefined) {
      ref.t = setTimeout(() => {
// wait时间内只能执行一次
        ref.isExecute = false
        ref.t = undefined
        if (ref.last && trailing) {
// 执行记录下来的函数
          ref.isExecute = true
          ref.last()
          ref.last = undefined
        }
      }, wait);
    }
  }
}
```

# memoize
- `_.memoize(func, [resolver])`创建一个会缓存 func 结果的函数。 如果提供了 resolver，就用 resolver 的返回值作为 key 缓存函数的结果。 默认情况下用第一个参数作为缓存的 key。 func 在调用时 this 会绑定在缓存函数上。
- 注意: 缓存会暴露在缓存函数的 cache 上。 它是可以定制的，只要替换了 _.memoize.Cache 构造函数，或实现了 Map 的 delete， get， has， 以及 set方法。
- 参数
- - func (Function)
需要缓存化的函数
- - [resolver] (Function)
这个函数的返回值作为缓存的 key
- - 返回值 (Function)
返回缓存化后的函数
- 难度系数： ★★
- 建议最长用时：6min

```js
// example
var object = { 'a': 1, 'b': 2 };
var other = { 'c': 3, 'd': 4 };

var values = _.memoize(_.values);
values(object);
// => [1, 2]

values(other);
// => [3, 4]

object.a = 2;
values(object);
// => [1, 2]

// 修改结果缓存
values.cache.set(object, ['a', 'b']);
values(object);
// => ['a', 'b']

// 替换 `_.memoize.Cache`
_.memoize.Cache = WeakMap;
```

参考代码：
```js
function memoize(func, resolver) {
  const cache = new Map()
  function f(...args) {
    const key = typeof resolver === 'function' ? resolver.apply(null, args) : args[0]
    if (!cache.get(key)) {
      const ret = func.apply(null, args)
      cache.set(key, ret)
      return ret
    } else {
      return cache.get(key)
    }
  }
  f.cache = cache
  return f
}

```

# 其他
其他方法都比较简单，不需要20行代码即可实现。需要注意的点是，执行传入的函数的时候，要call、apply一下null，默认没有this，这是基本操作。为什么呢？如果执行的那个函数内部依赖this，那传入的必须是箭头函数或者bind过this的函数。如果开发者传入的不是箭头函数或者bind过this的函数，框架代码里面执行传入的函数的时候又没有call、apply一下null的话，那框架本身就对业务代码造成了污染了。另外，如果不依赖this，那为何改他的this呢。我们可以看看丢失的this的例子：
```js
// 内部依赖this的函数，不bind的话，this指向改变了导致报错
const { getElementById } = document
getElementById('id')
// Uncaught TypeError: Illegal invocation

// 正确的做法
const getElementById = document.getElementById.bind(document)
getElementById('id')
```


> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)