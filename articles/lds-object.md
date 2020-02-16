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

# assignIn
- `_.assignIn(object, [sources])`这个方法类似 Object.assign。 但是它会遍历并继承来源对象的属性。注意: 这方法会改变源对象
- 参数object (Object)是目标对象。[sources] (...Object)是来源对象
- 返回值 (Object)是assignIn后的返回对象
- 难度系数： ★★
- 建议最长用时：6min

```js
// example
function Foo() {
  this.b = 2;
}

function Bar() {
  this.d = 4;
}

Foo.prototype.c = 3;
Bar.prototype.e = 5;

_.assignIn({ 'a': 1 }, new Foo, new Bar);
// => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
```

参考代码：
```js
function assignIn(target, ...newObjs) {
  return  newObjs.reduce((res, o) => {
    for (const key in o) {
      res[key] = o[key];
    }
    Object.getOwnPropertySymbols(o).forEach(sb => {
      res[sb] = o[sb];
    });
    return res;
  }, target);
}

```


# at
- `_.at(object, [paths])`根据 object 的路径获取值为数组。
- `object (Object)`是要遍历的对象
- `[paths] (...(string|string[])`是指要获取的对象的元素路径，单独指定或者指定在数组中
- 返回值是选中值的数组
- 难度系数： ★★★
- 建议最长用时：9min


```js
//example
var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };

_.at(object, ['a[0].b.c', 'a[1]']);
// => [3, 4]

_.at(['a', 'b', 'c'], 0, 2);
// => ['a', 'c']
```
参考代码
```js
// 这里顺便把get都实现了
function get(o, path) {
// _和$都可以做key的哦
// `${path}`考虑到传入的是数字
  const keys = `${path}`.match(/(\w|\$)+/g)
  if (keys) {
    return keys.reduce((acc, key, i) => 
      acc && acc[key]
    , o)
  }
}

function at(target, ...paths) {
  return paths.reduce((res, path) => {
    if (Array.isArray(path)) {
      return [...res, ...path.map(key => get(target, key))]
    }
    return [...res, get(target, path)]
  }, [])
}
```

# defaultsDeep
- `_.defaultsDeep(object, [sources])`分配来源对象的可枚举属性到目标对象所有解析为 undefined 的属性上。 来源对象从左到右应用。 一旦设置了相同属性的值，后续的将被忽略掉。会递归分配默认属性。注意: 这方法会改变源对象
- 参数object (Object): 目标对象
- `[sources] (...Object)`: 来源对象
- 返回值 (Object): 返回对象
- 难度系数： ★★★
- 建议最长用时：9min

```js
// example
_.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
// => { 'user': { 'name': 'barney', 'age': 36 } }
```
参考代码
```js
function defaults(target, obj) {
// 基本数据类型、null排除
  if (!obj || typeof obj !== 'object') {
    return target;
  }
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (acc[key] === undefined) {
      acc[key] = value
    } else if (typeof acc[key] === 'object') {
// 递归
      defaults(acc[key], value)
    }
    return acc
  }, target)
}

function defaultsDeep(target, ...objs) {
  return objs.reduce((acc, obj) => {
    defaults(acc, obj)
    return acc;
  }, target)
}
```

# merge
- `_.merge(object, [sources])`递归合并来源对象的自身和继承的可枚举属性到目标对象。 跳过来源对象解析为 undefined 的属性。 数组和普通对象会递归合并，其他对象和值会被直接分配。 来源对象从左到右分配，后续的来源对象属性会覆盖之前分配的属性。注意: 这方法会改变源对象
- 参数: `object (Object)`目标对象。`[sources] (...Object)`是指来源对象
- 返回值 (Object)：返回对象
- 难度系数： ★★★
- 建议最长用时：9min

```js
// example
var users = {
  'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
};

var ages = {
  'data': [{ 'age': 36 }, { 'age': 40 }]
};

_. (users, ages);
// => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
```
参考代码
```js
function mergeOne(target, obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof acc[key] === 'object' && typeof value === 'object') {
      mergeOne(acc[key], value)
    } else {
      acc[key] = value
    }
    return acc
  }, target)
}

function merge(target, ...objs) {
  return objs.reduce((acc, obj) => {
    mergeOne(acc, obj)
    return acc
  }, target)
}
```

# set
- `_.set(object, path, value)`设置值到对象对应的属性路径上，如果没有则创建这部分路径。 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。 使用 _.setWith 定制创建。
- 参数`object (Object)`是要修改的对象。`path (Array|string)`是要设置的对象路径，`value (*)`是要设置的值
- 返回值 (Object)是返回设置的对象
- 难度系数： ★★★
- 建议最长用时：9min

```js
// example
var object = { 'a': [{ 'b': { 'c': 3 } }] };

_.set(object, 'a[0].b.c', 4);
console.log(object.a[0].b.c);
// => 4

_.set(object, 'x[0].y.z', 5);
console.log(object.x[0].y.z);
// => 5
```

参考代码
```js
// 对于前面实现的get改造一下
function get(o, path, defaultValue) {
  const keys = `${path}`.match(/(\w|\$)+/g)
  if (keys) {
    return keys.reduce((acc, key) => 
      acc ? (acc[key] === undefined ? (acc[key] = defaultValue) : acc[key]) : (acc[key] = defaultValue)
    , o)
  }
}

function set(target, path, value) {
  const paths = `${path}`.match(/(\w|\$)+/g)
  if (paths && paths.length) {
    const lastKey = paths.pop()
    const last = get(target, paths.join('.'), {})
    last[lastKey] = value
  }
  return target
}
```

# unset
- `_.unset(object, path)`移除对象路径的属性。 注意: 这个方法会改变源对象
- 参数`object (Object)`要修改的对象，`path (Array|string)`要移除的对象路径
- 移除成功返回 true，否则返回 false
- 难度系数： ★★★
- 建议最长用时：9min

```js
// example
var object = { 'a': [{ 'b': { 'c': 7 } }] };
_.unset(object, 'a[0].b.c');
// => true

console.log(object);
// => { 'a': [{ 'b': {} }] };

_.unset(object, 'a[0].b.c');
// => true

console.log(object);
// => { 'a': [{ 'b': {} }] };
```

参考代码
```js
function unset(object, path) {
  const paths = `${path}`.match(/(\w|\$)+/g)
  if (paths && paths.length) {
    const lastKey = paths.pop()
    let temp = object
    while (paths.length) {
      temp = temp[paths.shift()]
    }
    if (lastKey in temp) {
      delete temp[lastKey]
      return true
    }
    return false
  }
  return false
}
```


> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)