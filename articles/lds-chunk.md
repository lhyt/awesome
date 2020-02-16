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

# chunk
- 描述： `_.chunk(array, [size=0])`，将数组拆分成多个 size 长度的块，并组成一个新数组。 如果数组无法被分割成全部等长的块，那么最后剩余的元素将组成一个块。
- 难度系数： ★★
- 建议最长用时：6min

```js
// example
_.chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]

_.chunk(['a', 'b', 'c', 'd'], 3);
// => [['a', 'b', 'c'], ['d']]
```

<details>
<summary>参考代码</summary>

```js
// 常规方法
    function chunk(arr, size = 0) {
      let current = 0;
      let temp = [];
      return arr.reduce((acc, cur, i) => {
        if (current++ < size) {
          temp.push(cur);
        }
        if (temp.length === size || i === arr.length - 1) {
          acc.push(temp);
          current = 0;
          temp = [];
        }
        return acc;
      }, []);
    }

// 抽象派
    function chunk(arr, size = 0) {
      let current = 0;
      let temp = [];
      return arr.reduce(
        (acc, cur, i) =>
          temp.push(...(current++ < size ? [cur] : [])) === size ||
          i === arr.length - 1
            ? [...acc, temp, ...((current = 0), (temp = []), [])]
            : acc,
        []
      );
    }
```

</details>


# zip系列
## zip&unzip
- `_.zip([arrays])`创建一个打包所有元素后的数组。第一个元素包含所有提供数组的第一个元素，第二个包含所有提供数组的第二个元素，以此类推。
- 参数[arrays] (...Array)，表示要处理的数组队列
- 返回值 (Array)是一个打包后的数组
`_.unzip(array)`类似 `_.zip`，接收一个打包后的数组并且还原为打包前的状态。
- 难度系数： ★
- 建议最长用时：2min * 2 = 4min

zip&unzip的例子
```js
var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
// => [['fred', 30, true], ['barney', 40, false]]

_.unzip(zipped);
// => [['fred', 'barney'], [30, 40], [true, false]]
```

<details>
<summary>参考代码</summary>

```js
function zip(target, ...arrs) {
  return target.map((item, index) => [item, ...arrs.map(arr => arr[index])])
}


function unzip(arrs) {
  return arrs.reduce((acc, arr) => {
    arr.forEach((item, index) => {
      acc[index] = acc[index] || [];
      acc[index].push(item)
    })
    return acc
  }, [])
}
```

</details>



## zipWith & unzipWith
- `_.zipWith`类似` _.zip`， 它另外接受一个 iteratee 决定如何重组值。 iteratee 会调用每一组元素，最后返回一个打包后的数组
- `_.unzipWith(array, [iteratee=_.identity])`另外接受一个 iteratee 来决定如何重组解包后的数组。iteratee 会传入4个参数：(accumulator, value, index, group)。每组的第一个元素作为初始化的值，返回一个解包后的数组
- 难度系数： ★★
- 建议最长用时：6min

```js
// example
_.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
  return a + b + c;
});
// => [111, 222]

// unzipWith
var zipped = _.zip([1, 2], [10, 20], [100, 200]);
// => [[1, 10, 100], [2, 20, 200]]

_.unzipWith(zipped, _.add);
// => [3, 30, 300]
```

<details>
<summary>参考代码</summary>

```js
// zipWith稍微修改一下就可以实现
function zipWith(target, ...arrs) {
  const iteratee = arrs.pop()
  return target.map((item, index) => [item, ...arrs.map(arr => arr[index])]).map(group => iteratee(...group))
}


function unzipWith(arrs, iteratee) {
// 使用唯一标记，避免`!result`的假值误判
  const FIRST_FLAG = Symbol()
  return arrs.reduce((acc, arr) => {
    arr.forEach((item, index) => {
      acc[index] = acc[index] || []
      acc[index].push(item)
    })
    return acc
  }, []).map(group => group.reduce((result, cur, index, all) =>
    result === FIRST_FLAG ? cur : iteratee(result, cur, index, all)
  ), FIRST_FLAG)
}
```

</details>



## zipObject & zipObjectDeep
- `_.zipObject([props=[]], [values=[]])`，接受属性key的数组和values的数组，返回每一对k-v形成的对象
- 难度系数： ★
- 建议最长用时：2min

```js
//example
_.zipObject(['a', 'b'], [1, 2]);
// => { 'a': 1, 'b': 2 }
```

```js
function zipObject(keys, values) {
  return keys.reduce((obj, key, index) => {
    obj[key] = values[index]
    return obj
  }, {})
}
```

- `_.zipObjectDeep([props=[]], [values=[]])`，类似 _.zipObject，它还支持属性路径。 
- 难度系数： ★★★★
- 建议最长用时：12min

```js
// example
_.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
// => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
```

<details>
<summary>参考代码</summary>

```js
// 从 'a'或者'[1]'这种抠出真正的key： a、1
function getRealKey(currentKey) {
  return /\[(\d+)\]/.test(currentKey) ? RegExp.$1 : currentKey
}

function zipObjectDeep(keys, values) {
  return keys.reduce((obj, key, index) => {
    const path = key.split(/\.|\B(?=\[\d+\])|\b(?=\[\d+\])/)
    // 辅助变量temp，利用引用类型的特性遍历和赋值整个对象
    let temp = obj
    // 预留一个空位，最后一下赋值
    while(path.length > 1) {
      const currentKey = path.shift()
      const realKey = getRealKey(currentKey)
      // 如果下一个是[1]这种，那么就是数组，不然就是一个对象
      // 如果你想给下一层的属性赋值，那么就要提前准备好它上一层的结构
      temp[realKey] = temp[realKey] || (/\[(\d+)\]/.test(path[0]) ? [] : {})
      temp = temp[realKey]
    }
    // 最后一下就是赋值了
    const lastKey = getRealKey(path.shift())
    temp[lastKey] = values[index]
    return obj
  }, {})
}
```
关于正则`key.split(/\.|\B(?=\[\d+\])|\b(?=\[\d+\])/)`的分析：
- split是可以传入正则的哦，对匹配到的内容进行分割。除了普通的`.`，还要考虑类似`[0]`这种，这种需要匹配到边界才可以完美分割
- 分成3部分，`.`、单词边界+[数字]、非单词边界+[数字]
- `.`匹配到的split一下就是 `'a.b.c' => ['a', 'b', 'c']`
- 单词边界+[数字] `'a[1]' => ['a', '[1]']`
- 非单词边界+[数字] `'[0][1]' => ['[0]', '[1]']`
- ?=是正向0宽断言，也就是说`/a(?=xx)/`匹配前面是`xx`的字符`a`，且`xx`不纳入捕获组中

</details>


# groupBy
- `_.groupBy(collection, [iteratee=_.identity])`key 是经 iteratee 处理的结果， value 是产生 key 的元素数组。 iteratee 会传入1个参数：(value)。
- 参数： `collection (Array|Object)`是需要遍历的集合。`[iteratee=_.identity] (Function|Object|string)`是一个函数，这个函数会处理每一个元素(和其他By系列的方法都是一样的，传入函数和With一样的效果，传入字符串或者数组会先调用`_.property`)
- 返回一个组成汇总的对象
- 难度系数： ★★(如果不知道property方法实现，再加多两星难度)
- 建议最长用时：6min

```js
// example
_.groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }

// 使用了 `_.property` 的回调结果
_.groupBy(['one', 'two', 'three'], 'length');
// => { '3': ['one', 'two'], '5': ['three'] }
```

<details>
<summary>参考代码</summary>

```js
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

function groupBy(...arrs) {
  let iteratee = arrs.pop();
  iteratee = typeof iteratee === 'function' ? iteratee : property(iteratee);
  return arrs.reduce((acc, arr) => {
    arr.forEach(item => {
      const key = iteratee(item)
      ;(acc[key] || (acc[key] = [])).push(item) 
    })
    return acc
  }, {})
}
```

</details>


# invokeMap
- `_.invokeMap(collection, path, [args])`调用 path 的方法处理集合中的每一个元素，返回处理的数组。 如果方法名是个函数，集合中的每个元素都会被调用到。
- 参数: `collection (Array|Object)`是需要遍历的集合，`path (Array|Function|string)`是要调用的方法名 或者 这个函数会处理每一个元素。`[args] (...*)`给方法传入的参数
- 返回数组结果
- 难度系数： ★
- 建议最长用时：3min

```js
// example
_.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
// => [[1, 5, 7], [1, 2, 3]]

_.invokeMap([123, 456], String.prototype.split, '');
// => [['1', '2', '3'], ['4', '5', '6']]
```


<details>
<summary>参考代码</summary>

```js
function invokeMap(arr, fn, ...args) {
  return arr.map(item => {
// 面对这种传入函数手动调用的，都记得call/apply一下
    return (typeof fn === 'function' ? fn : arr[fn]).apply(item, args)
  })
}
```

</details>


> lodash的数组和collection的方法就此告一段落了，其他方法基本都是不需要1分钟就可以写出来或者没有什么坑点的。后面是function系列，to be continue



> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)