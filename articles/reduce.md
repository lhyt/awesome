> 关于遍历，只要具备可遍历结构，都可以使用reduce解决，不管是数组、字符串、对象、set、map

# 1. 用reduce实现数组一些api
给数组prototype加上基于reduce实现的api：
```js
Object.assign(Array.prototype, {
  myMap(cb, _this = this) {
    return this.reduce((res, cur, index, array) => [...res, cb.call(_this, cur, index, array)], []);
  },
  myFind(cb, _this = this) {
    return this.reduce((res, cur, index, array) => res || (cb.call(_this, cur, index, array) ? cur : undefined), undefined)
  },
  myFilter(cb, _this = this) {
    return this.reduce((res, cur, index, array) => [...res, ...(cb.call(_this, cur, index, array) ? [cur] : [])], []);
  },
  myEvery(cb, _this = this) {
    return this.reduce((res, cur, index, array) => res && !!cb.call(_this, cur, index, array), true);
  },
  mySome(cb, _this = this) {
    return this.reduce((res, cur, index, array) => res || !!cb.call(_this, cur, index, array), false);
  },
});
```
接下来写测试用例：
```js
// 函数用例
const tests = {
  map: [
    item => item * 2,
    function(_, index) { return this[index] } // 这this是专门测cb传入第二个参数使用的
  ],
  find: [
    item => item,
    item => item === 6,
    item => item === Symbol(),
    function(_, index) { return this[index] === 6 }
  ],
  filter: [
    item => item > 6,
    item => item,
    function(_, index) { return this[index] > 6 }
  ],
  every: [
    item => item,
    item => item > 6,
    function(_, index) { return this[index] > 6 }
  ],
  some: [
    item => item,
    item => item > 6,
    function(_, index) { return this[index] > 6 }
  ],
}

// 数据源
const example = [
  [1,2,3,4,5,6,7],
  [1,2,3,4,5],
  [11,12,13,14,15],
];
```
测试用例考虑普通情况以及第二个改变this的参数的情况，最后需要一个用例执行的方法：
```js
// 简单的比较相等
function isEqual(a, b) {
  if (typeof a !== 'object' && typeof b !== 'object') {
    return a === b
  }
  // 这是测试[1, 2, 3]和[1, 2, 3]用的
  // 本文只有number和number[]没有其他数据结构
  return `${a}` === `${b}`;
}

function doTest(example, tests) {
  // 以数据源为key，数组的isEqual是通过隐式转换比较
  return example.reduce((res, cur) => {
  // 对函数用例逐个执行，把有没有相等的true和false写进去
    res[cur] = Object.entries(tests).reduce((result, [key, fns]) => {
      result[key] = fns.map(fn =>
        example.map(eg =>
          isEqual(
            eg[key](fn, [5, 6, 7]),
            eg[`my${key[0].toUpperCase()}${key.slice(1)}`](fn, [5, 6, 7])
            )
        ));
      return result;
    }, {});
    return res;
  }, {});
}

doTest(example, tests)
// 如果全部都是true，说明测试通过
```
# 2. 不是数组怎么reduce
上面的测试也用了reduce，是对一个对象reduce。只要是遍历某个数据结构，产生一个结果，那么都可以使用reduce解决：
- 普通对象：使用Object.keys,Object.values,Object.entries再reduce
- 类数组对象：使用[...o]
- 字符串: [].reduce.call(string, (res, cur) => {}, result)
- 假数组: 如{ 0: 'a', 1: 'b', length: 2 }，使用Array.from(o)、Array.apply(null, o)
- 有symbol做key的对象:使用getOwnPropertySymbols

> 下面先来几个最简单的例子，希望平时基本没用reduce的人，可以通过几个例子找到一点reduce的感觉。reduce可以简化代码，让思路更加清晰，而不是被for循环的下标迷惑了自己

根据对象生成一个简单schema:
```js
// value值变成对应的type，如果是对象，则递归下一级
function transformSchema(o) {
  return Object.entries(o).reduce((res, [key, value]) => {
    res[key] = typeof value !== 'object' ? typeof value : transformSchema(value);
    return res;
  }, Array.isArray(o) ? [] : {});
}

transformSchema({ a: 1, b: '2', c: { d: 1, e: [{a: 1, b:2}]} })
```
统计页面上a标签的个数
```js
[...document.querySelectorAll('*')]
  .reduce((sum, node) => node.nodeName === 'A' ? sum : sum + 1, 0)
```
统计字符串每一个字符出现次数：
```js
;[].reduce.call('asfsdhvui3u2498rfrvh 93c  293ur0jvdf', (res, cur) => {
  res[cur] = res[cur] || 0;
  res[cur] ++;
  return res;
}, {})
```
扁平化数组(不用flat和join)
```js
function flattern(arr) {
  return arr.reduce((res, cur) => 
    res.concat(Array.isArray(cur) ? flattern(cur) : [cur]),
  []);
}
```

数组去重，兼容各种类型，比较完美的版本：
```js
function isNotSimple(o) {
  return Object.prototype.toString.call(o) === '[object Object]' || Array.isArray(o) || typeof o === 'function'
}

function deepEqual(a = {}, b = {}, cache = new Set()) {
  if (typeof a === 'function') { // 函数的情况
    return a.toString() === b.toString()
  }
  if (cache.has(a)) { // 解决环引用
    return a === b
  }
  cache.add(a)
  const keys = Object.keys(a)
  const symbolKeys = Object.getOwnPropertySymbols(a) // 考虑symbol做key
  return (keys.length === Object.keys(b).length &&
    symbolKeys.length === Object.getOwnPropertySymbols(b).length) &&
    [...keys, ...symbolKeys].every(key => !isNotSimple(a[key]) ?
      a[key] === b[key] : deepEqual(a[key], b[key], cache))
}

function unique(arr) {
  const cache = new Set() // set可以干掉NaN
  const objCache = []
  // 简单的基本类型直接来，复杂的使用deepEqual
  return arr.reduce((res, cur) => (
    !isNotSimple(cur) ? !cache.has(cur) && res.push(cur) && cache.add(cur)
      : !objCache.find(o => deepEqual(o, cur)) && objCache.push(cur) && res.push(cur),
    res
  ), []);
}
```
将传入的所有参数生成一个单链表：
```js
function createLinkList(...init) {
  let current
  return init.reduce((res, cur) => {
    current = current || res
    current.value = cur
    current.next = current.next || {}
    current = current.next
    return res
  }, {})
}
createLinkList(1,2,4,5,6);
```

创建一个树形结构：
```js
const ran = () => ~~(Math.random() * 2) + 1
function createTree(dept = 0) {
  if (dept > 1) {
    return null;
  }
  // 如果每一层是数组型的树结构，用map也可以
  // reduce还可以兼容非数组的结构，还可以完成其他更复杂的需求
  return Array.apply(null, { length: ran() }).reduce((res, cur, i) => {
    res[i] = {
      value: ran(),
      nodes: createTree(dept + 1),
    }
    return res;
  }, {});
}
const tree = createTree();
```
基于上面的树结构，找出某个节点值的出现次数:
```js
// 如果当前节点值等于target，则+1；如果有子节点，则带上sum递归计算
function targetFromTree(tree = {}, target, sum = 0) {
  return Object.values(tree).reduce((res, node) => 
    res + ~~(node.value === target) + targetFromTree(node.nodes, target, sum)
  , sum);
}
```
# 3. compose思想
对于数组api，经常有链式操作，如:
```js
[1,2,3,4,5].filter(x => x > 3).map(x => x * 2)
```
这样子，对每一个元素filter一下，遍历一次。对每一个元素map，再遍历一次。其实这一切我们可以做到只遍历一次就完成两个操作，遍历的时候对每一个元素做所有的函数复合起来的一个总函数的操作

```js
class MagicArray extends Array {
  temp = []; // 存放链式操作的方法

  FLAG = Symbol(); // filter标记

  // 如果有filter标记则直接返回
  myMap(cb, _this = this) {
    this.temp.push((cur, index, array) => cur === this.FLAG ? this.FLAG : cb.call(_this, cur, index, array));
    return this;
  }

  // 不符合要求的打上filter标记
  myFilter(cb, _this = this) {
    this.temp.push((cur, index, array) => cb.call(_this, cur, index, array) ? cur : this.FLAG);
    return this;
  }

  run() {
    // 函数compose
    const f = this.temp.reduceRight((a, b) => (cur, ...rest) => a(b(cur, ...rest), ...rest));
    const result = this.reduce((res, cur, index, arr) => {
      const ret = f(cur, index, arr);
      // filter标记的元素直接跳过
      if (ret === this.FLAG) {
        return res;
      }
      res.push(ret);
      return res;
    }, []);
    this.temp = [];
    return result;
  }
}
```
我们已经完成了一个具有magic的数组，接下来测试一下和原生操作谁快：
```js
const a = new MagicArray(...Array.apply(null, { length: 10000 }).map(x => Math.random() * 10));
console.time('normal')
a.map(x => x * 2).filter(x => x > 5)
console.timeEnd('normal')

console.time('compose')
a.myMap(x => x * 2).myFilter(x => x > 5).run()
console.timeEnd('compose')
```
经过多次测试，compose过的数组与常规数组耗时比约为3:5
> 对于`this.temp.reduceRight((a, b) => (cur, ...rest) => a(b(cur, ...rest), ...rest));`这段代码怎么理解？

类似于各种框架的中间件的实现，我们这里的实现是传入参数和数组的item, index, array一致，但是我们这里的item是上一次的运行结果，故有`b(cur, ...rest), ...rest)`的操作

总之，遇到遍历一个数据结构最后生成一个或多个结果(多个结果res用一个对象多个属性表示)的情况，那就<span style="color: red">用reduce盘它</span>就是了

# 【广告】ts类型注解生成器
多使用几次reduce，就会发现它带来更好的开发体验和提高效率，也是造轮子用的比较多的。最近写了一个小工具，将已知的json结构转成ts声明。在源码里面，可以感受一下用了reduce后，递归、遍历逻辑一切都十分明朗。
```ts
// 已知json
{
  "a": 1,
  "b": "1",
  "c": {
    "d": 1,
    "e": [
      "1",
      {
        "g": 1,
        "r": "asd",
        "gg": true
      },
      1
    ]
  }
}
// 转换结果
{
  a: number;
  b: string;
  c: {
    d: number;
    e: number | {
      g: number;
      r: string;
      gg: boolean;
    } | string [];
  };
}
```
[项目地址](https://github.com/lhyt/ts-declaration-gen)

ts-declaration-gen: [npm包地址](https://www.npmjs.com/package/ts-declaration-gen)

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)