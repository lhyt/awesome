> 如果觉得没有面试题，那么lodash每一个方法就可以当作一个题目，可以看着效果反过来实现，以不同的方法实现、多种方法实现，巩固基础。除了某些一瞬间就可以实现的函数，下面抽取部分函数作为试炼。时代在进步，下文所有的解法都采用es2015+

<span style="color: red">本文实现方法都是看效果倒推实现方法，并进行一些拓展和思考，和源码无关。lodash这个库在这里更像一个题库，给我们刷题的</span>

能收获什么：
- 修炼代码基本功，了解常见的套路
- 了解到一些操作的英文命名和规范
- 积累经验，面对复杂逻辑问题可以迅速解决
- 也许可以查到自己的js基础知识的漏洞

概念：
- SameValue标准: 目前已有等价的api——Object.is(a, b)，表示a和b在SameValue标准下是否相等。Object.is和===不同的地方在于，可以判断NaN和NaN相等，但是0 和 -0是不相等
- SameValueZero标准: 与SameValue差别仅仅在于，此标准下0和-0是相等的，Array.prototype.includes、Set.prototype.has内部就是使用SameValueZero

注意：
- 三星难度以上的会具体拓展和讲解
- 文中使用的基本都是数组原生api以及es6+函数式编程，代码简洁且过程清晰
- 如果说性能当然是命令式好，实现起来稍微麻烦一些而且比较枯燥无味
- 时代在进步，人生苦短，我选择语法糖和api。面临大数据的性能瓶颈，才是考虑命令式编程的时候

# 准备工作
lodash数组方法里面有好几个函数是本身+By+With一组的。假设lodash里面有一个函数`foo`，对应的有`fooBy`、`fooWith`方法。`fooBy`、`fooWith`方法多了一个参数，是对数据进行预处理的。`fooBy`最后一个参数可以是函数、数组、字符串，如果是函数，则对前面数组参数每一个元素进行预处理再执行真正的逻辑；如果是数组、字符串，则先调用`_.property(lastArg)`返回一个函数，使用该函数对前面数组参数每一个元素进行预处理

```js
// 都是一样的
fooBy(arr, 'x');
fooWith(arr, _.property('x'));
fooWith(arr, item => item.x);
```

下文有`_.property`的简单实现，详细的等待后续更新

# difference系列
## difference
- 描述： `_.difference(array, [values])`，创建一个差异化后的数组
- 难度系数： ★
- 建议最长用时：2min

```js
_.difference([3, 2, 1], [4, 2]);
// => [3, 1]
```
```js
_.difference([3, 2, 1], [4, 2]);
// => [3, 1]
```

<details>
<summary>参考代码</summary>

```js
function difference(origin, diff = []) {
  return origin.reduce(
    (acc, cur) => [...acc, ...(!diff.includes(cur) ? [cur] : [])],
    []
  );
}
```

</details>



## differenceBy
- 描述： `_.differenceBy(array, [values], [iteratee=_.identity])`，这个方法类似 _.difference，除了它接受一个 iteratee 调用每一个数组和值。iteratee 会传入一个参数：(value)。
- 参数
array (Array):
需要处理的数组
[values] (...Array):
用于对比差异的数组
[iteratee=_.identity] (Function|Object|string):
这个函数会处理每一个元素
- 难度系数： ★ (不包括Object|string, 即differenceWith同样的功能)
- 建议最长用时：2min

```js
// example
_.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
// => [3.1, 1.3]

// 使用了 `_.property` (返回给定对象的 path 的值的函数)的回调结果
_.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
// => [{ 'x': 2 }]
```

<details>
<summary>参考代码</summary>

```js
function differenceBy(origin, diff = [], iteratee) {
  return origin.reduce(
    (acc, cur) => [...acc, ...(!~diff.findIndex(d => iteratee(d) === iteratee(cur))  ? [cur] : [])],
    []
  );
}
// 注意，使用`[].find`找到假值会导致误判
```

</details>

## property & differenceBy完整版
- `_.property(path)` 创建一个返回给定对象的 path 的值的函数。参数: path (Array|string), 要得到值的属性路径。differenceBy第三个参数实际上也使用了 `_.property`，下面实现differenceBy完整版
- 难度系数： ★ ★  (iteratee包括Object|string)
- 建议最长用时：6min

```js
// example
var objects = [
  { 'a': { 'b': { 'c': 2 } } },
  { 'a': { 'b': { 'c': 1 } } }
];

_.map(objects, _.property('a.b.c'));
// => [2, 1]

_.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
// => [1, 2]
```

<details>
<summary>参考代码</summary>

```js
// 本文只实现一个简单的_.property
function property(path) {
  return function(o) {
    const temp = Array.isArray(path) ? path : path.split(".");
    let res = o;
    while (temp.length && res) {
      res = res[temp.shift()];
    }
    return res;
  };
}

function differenceBy(origin, diff = [], iteratee) {
  iteratee = typeof iteratee === 'function' ? iteratee : property(iteratee);
  return origin.reduce(
    (acc, cur) => [...acc, ...(!~diff.findIndex(d => iteratee(d) === iteratee(cur))  ? [cur] : [])],
    []
  );
}
```

</details>


# intersection系列
## intersection
- `_.intersection([arrays])`，创建一个包含所有使用 SameValueZero 进行等值比较后筛选的唯一值数组。
- 参数: [arrays] (...Array), 需要处理的数组队列；返回值 (Array): 所有数组共享元素的新数组
- 难度系数： ★★★
- 建议最长用时：9min

```js
// example
_.intersection([2, 1], [4, 2], [1, 2]);
// => [2]
```


<details>
<summary>参考代码</summary>

```js
// 如果下一个组没有上一个组的元素，那么那个元素可以pass了
// 用当前组的结果和上一组对比，再将当前组的结果覆盖上一组的结果
// 使用同样的方法遍历每一组，最终结果即是交集

// 常规数组解法

function intersection(...arrs) {
  let temp;
  return arrs.reduce((acc, arr) => {
    if (!acc) { // 第一次进来，第一组做参照物
      return temp = arr
    }
// 辗转计算上一组结果
    return temp = arr.reduce((ret, item) => {
 // 上一组有本元素，且最终输出结果内没有本元素(保证去重)
      if (temp.includes(item)) {
 // 这里if不能合在一起使用&&，防止走到下面逻辑
        if (!ret.includes(item)) {
          ret.push(item);
        }
      } else {
// 发现本元素不在上一组的元素中，那就删掉
        const idx = ret.findIndex(x => x === item)
        if (~idx) {
          ret.splice(idx, 1);
        }
      }
      return ret
    }, [])
  }, void 0)
}

// 对象映射解法
function intersection(...arrs) {
  let temp;
// 如果用Object.keys会转字符串所以使用Object.values
  return Object.values(arrs.reduce((acc, arr) => {
    if (!acc) {
// 第一次初始化麻烦一些
      return temp = arr.reduce((o, c) => ({ ...o, [c]: c }), {})
    }
    return temp = arr.reduce((ret, item) => {
// 中间这里查找有没有存在, 不存在就从最终结果删除
// 一定要in不能ret[item] 判断，不然如果ret[item] 是假值就骗过这个if了
      if (item in temp) {
        ret[item] = item;
      } else if (ret[item]) {
        delete ret[item]; // in与delete配合美滋滋
      }
      return ret
    }, {})
  }, void 0))
}

// 高级解法
// Set内部使用SameValueZero加去重，无需担心NaN, -0
// Set增加删除元素很方便，而且性能好
// 查询是否存在某元素只需要O(1)时间
function intersection(...arrs) {
  let temp;
  return [...arrs.reduce((acc, arr) => {
    return temp = !acc ? new Set(arr) : arr.reduce((ret, item) => {
      ret[temp.has(item) ? 'add' : 'delete'](item)
      return ret
    }, new Set);
  }, void 0)]
}
```

</details>


## intersectionBy
类似前面的differenceBy和differenceWith方法，基于上面的intersection方法修改，加上前面也说到了_.property的实现。intersectionBy除了它接受一个 iteratee 调用每一个数组和值。iteratee 会传入一个参数：(value)。
- 参数
array (Array):
需要处理的数组
[values] (...Array):
用于对比差异的数组
[iteratee=_.identity] (Function|Object|string):
这个函数会处理每一个元素
- 难度系数： ★★★ (不包括Object|string 的时候退化为intersectionWith同样的功能)
- 建议最长用时：8min

```js
// example
_.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
// => [2.1]

// 使用了 `_.property` 的回调结果
_.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
// => [{ 'x': 1 }]
```
但是也不是很简单，前面的方案会导致`_.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor)`返回的是2.4，所以需要改一下

<details>
<summary>参考代码</summary>

```js
// property继续copy前面的
function property(path) {
  return function (o) {
    const temp = Array.isArray(path) ? path : path.split(".");
    let res = o;
    while (temp.length && res) {
      res = res[temp.shift()];
    }
    return res;
  };
}

// sameValueZero标准
function sameValueZero(a, b) {
  return (a === b) || (isNaN(a) && isNaN(b));
}

function intersectionBy(...arrs) {
  let iteratee = arrs.pop();
  iteratee = typeof iteratee === 'function' ? iteratee : property(iteratee);
  let temp;
  return Object.values(arrs.reduce((acc, arr) => {
    if (!acc) {
      return temp = arr.reduce((o, c) => ({ ...o, [c]: c }), {})
    }
    return temp = arr.reduce((ret, item) => {
      // 需要根据当前值iteratee一下，再从之前的值iteratee过后里面找
      const prefix = iteratee(item);
      const newTemp = Object.values(temp);
      const newRet = Object.values(ret);
      const compare = t => sameValueZero(prefix, iteratee(t));
      if (newTemp.map(iteratee).includes(prefix)) {
        const preKey = newTemp.find(compare);
        if (preKey) {
          ret[preKey] = preKey;
        }
      } else if (newRet.map(iteratee).includes(prefix)) {
        const preKey = newRet.find(compare);
        if (preKey) {
          delete ret[preKey];
        }
      }
      return ret;
    }, {})
  }, void 0))
}

```

</details>


## 小结
最开始使用的方法，是以当前的结果去覆盖前面的结果，所以导致`intersectionBy`最终结果取的是后面组的元素。因此，如果想实现lodash的`intersectionBy`，就要固定最开始的那一组，然后围绕那一组开始走后面的逻辑。再次实现`intersectionBy`:
- 难度系数： ★★★ (不包括Object|string 的时候退化为intersectionWith同样的功能)
- 建议最长用时：8min

> 先实现普通的intersection

<details>
<summary>参考代码</summary>

```js
function intersection(...arrs) {
  return [...arrs.reduce((acc, arr) => {
// 遍历set结构而不是遍历每一组数组
    return !acc ? new Set(arr) : (acc.forEach(item => {
      if (!arr.includes(item)) {
        acc.delete(item)
      }
    }), acc)
  }, void 0)]
}
```

</details>

> 再稍微修改一下，实现intersectionBy，此时实现`intersectionBy`的难度是★

<details>
<summary>参考代码</summary>

```js
function intersectionBy(...arrs) {
  let iteratee = arrs.pop();
  iteratee = typeof iteratee === 'function' ? iteratee : property(iteratee);
  return [...arrs.reduce((acc, arr) => {
    return !acc ? new Set(arr) : (acc.forEach(item => {
// set结构转化为iteratee每一个元素后再对比
      if (!arr.map(iteratee).includes(iteratee(item))) {
        acc.delete(item)
      }
    }), acc)
  }, void 0)]
}
```

</details>


# union系列
## union
- _.union([arrays]), 创建顺序排列的唯一值组成的数组。所有值经过 SameValueZero 等值比较。返回处理好的数组。实际上就是对所有的数组求并集
- 难度系数： ★
- 建议最长用时：2min
```js
// example
_.union([2, 1], [4, 2], [1, 2]);
// => [2, 1, 4]
```

<details>
<summary>参考代码</summary>

```js
// 方法1
function union(...arrs) {
  return [...new Set(arrs.reduce((acc, arr) => [...acc, ...arr], []))]
}

// 方法2
function union(...arrs) {
  return arrs.reduce((acc, arr) =>
    [...acc, ...arr.filter(item => !acc.includes(item))], []);
}
```

</details>


## unionBy
- `_.unionBy([arrays], [iteratee=_.identity])`。这个方法类似 _.union，除了它接受一个 iteratee 调用每一个数组和值。也是和上面的by、with一样的
- 难度系数： ★(`_.property`已经实现，可以从上面copy)
- 建议最长用时：2min

```js
// example
_.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
// => [2.1, 1.2, 4.3]

// 使用了 `_.property` 的回调结果
_.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
// => [{ 'x': 1 }, { 'x': 2 }]
```
我们在union的第二种方法基础上改，很快就可以实现
<details>
<summary>参考代码</summary>

```js
function unionBy(...arrs) {
  let iteratee = arrs.pop();
  iteratee = typeof iteratee === 'function' ? iteratee : property(iteratee);
  return arrs.reduce((acc, arr) =>
    [...acc, ...arr.filter(item => !acc.map(iteratee).includes(iteratee(item)))], []);
}
```

</details>


> 类似的就是`uniq`系列了，即数组去重，`uniq`只传入一个数组进行去重。`union`传入多个数组求并集，实际上就是合并所有的数组再去重，道理都是差不多的。有对象组成的数组那种彻底去重，实际上是`_.uniqWith(arr, _.isEqual)`，` _.isEqual`是一个深度对比相等的方法，后续详细展开

# xor系列
- `_.xor([arrays])`创建一个包含了所有唯一值的数组。使用了 symmetric difference 等值比较。
- 参数: [arrays] (...Array)要处理的数组，返回值是所给数组的对等差分数组.
- 难度系数： ★★
- 建议最长用时：5min

```js
// example
_.xor([2, 1], [4, 2]);
// => [1, 4]
```

<details>
<summary>参考代码</summary>

```js
// 方法1
function xor(...arrs) {
  return [...arrs.reduce((acc, arr) => 
    !acc ? new Set(arr) : arr.reduce((res, item) => 
      (res[res.has(item) ? 'delete' : 'add'](item), res)
    , acc)
  , void 0)]
}

// 方法2，比较容易扩展成By和With方法
function sameValueZero(a, b) {
  return a === b || (isNaN(a) && isNaN(b));
}

function xor(...arrs) {
  return arrs.reduce((acc, arr) => {
    arr.forEach(item => {
      const index = acc.findIndex(x => sameValueZero(x, item))
      if (!~index) {
        acc.push(item)
      } else {
        acc.splice(index, 1);
      }
    })
    return acc;
  }, [])
}
```

</details>

> ok，到了这里，`xorBy`和`xorWith`大家都知道怎么做了吧

# sortedIndex系列
## sortedIndex
- `_.sortedIndex(array, value)`使用二进制的方式（二分查找）检索来决定 value 应该插入在数组中位置。它的 index 应该尽可能的小以保证数组的排序。
- 参数: array (Array) 是需要检索的已排序数组，value (*)是要评估位置的值
- 返回值 (number)，返回 value 应该在数组中插入的 index。
- 难度系数： ★★★
- 建议最长用时：7min

```js
// example
_.sortedIndex([30, 50], 40);
// => 1

_.sortedIndex([4, 5], 4);
// => 0
```

<details>
<summary>参考代码</summary>

```js
// 二分查找
function sortedIndex(arr, value) {
  let low = 0
  let high = arr == null ? low : arr.length

  while (low < high) {
    const mid = (low + high) >> 1
    const medium = arr[mid]
    if (medium !== null &&
      medium < value) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return high
}
```

</details>

sortedIndexBy也是同样的道理，就不多说了。相对的，还有sortedLastIndex方法，只是它是反过来遍历的：使用二进制的方式（二分查找）检索来决定 value 应该插入在数组中位置。它的 index 应该尽可能的**大**以保证数组的排序。



> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)