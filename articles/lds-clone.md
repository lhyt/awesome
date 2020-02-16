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

> 还是老生常谈的深浅拷贝，但是我们这次彻底探究一遍各种对象的拷贝以及补回一些js冷门知识

# clone & cloneDeep（不考虑不常用对象）
lodash除了常用的数据类型拷贝外，还会对各种奇怪对象进行拷贝。在实现lodash的之前，我们先实现一个正常的满足大部分场景的拷贝：

## 浅拷贝
- 难度系数： ★
- 建议最长用时：2min

```js
function shallowClone(v) {
const isArr = Array.isArray(v);
  if (typeof v === 'object' && v !== null && !isArr) {
    return { ...v } // ...包括symbol key
  }
  return isArr ? [ ...v ] : v
}
```

## 深拷贝
- 难度系数： ★★★
- 建议最长用时：9min

```js
function deepCopy(target, cache = new Set()) {
const isArr = Array.isArray(target);
// 注意环引用
  if (
    (typeof target !== 'object' && target !== null && !isArr) ||
      cache.has(target)
    ) {
    return target
  }
  if (isArr) {
    return target.map(t => {
      cache.add(t)
      return t
    })
  } else {
// 注意symbol key
    return [...Object.keys(target), ...Object.getOwnPropertySymbols(target)].reduce((res, key) => {
      cache.add(target[key])
      res[key] = deepCopy(target[key], cache)
      return res
    }, target.constructor !== Object ? Object.create(target.constructor.prototype) : {}) // 继承
  }
}
```

# clone & cloneDeep（考虑各种对象）
- `_.clone(value)`创建一个 value 的浅拷贝。`_.cloneDeep(value)`创建一个 value 的深拷贝。
- 注意: 这个方法参考自 structured clone algorithm 以及支持 arrays、array buffers、 booleans、 date objects、maps、 numbers， Object objects, regexes, sets, strings, symbols, 以及 typed arrays。 参数对象的可枚举属性会拷贝为普通对象。 一些不可拷贝的对象，例如error objects、functions, DOM nodes, 以及 WeakMaps 会返回空对象。
- 源码中，clone是`baseClone(value, CLONE_SYMBOLS_FLAG)`，cloneDeep是`baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG)`，此外，`cloneDeepWith`函数也是`baseClone`实现，此时`baseClone`基于还多了第三个参数`customizer`，是一个函数(`customizer(value, key)`)，对深拷贝前的值做预处理。下面我们要实现`baseClone`方法
- 难度系数： ★★★★★★★★
- 建议最长用时：25min

> 前置准备：CLONE_DEEP_FLAG， CLONE_SYMBOLS_FLAG这些是标记使用，或运算表示这次操作包含了哪些，传到函数里面会进行一次与操作，即可得出要做什么

```js
var CLONE_DEEP_FLAG = 1,  // 001
    CLONE_FLAT_FLAG = 2, // 010
    CLONE_SYMBOLS_FLAG = 4; // 100

// 如果bitmask包含了那位的1，那么与操作后，那一位就是1，也就是true
var isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;
```

## 各种对象及类型
### Buffer
为了使 Buffer 实例的创建更可靠且更不容易出错，各种形式的 new Buffer() 构造函数都已被弃用，且改为单独的 Buffer.from()，Buffer.alloc() 和 Buffer.allocUnsafe() 方法。
Buffer的实例方法`slice`: `buffer.slice([start[, end]])`，返回一个新的 Buffer，它引用与原始的 Buffer 相同的内存，但是由 start 和 end 索引进行偏移和裁剪。

克隆buffer的方法：
```js
const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice(); // 深拷贝
  }
  const length = buffer.length;
  const result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

// 为什么这就是浅拷贝呢？
// 其实和const o = { b: 1 }的浅拷贝是const a = new Object(); a.b = o.b同样的道理
  buffer.copy(result);
  return result;
}
```

### ArrayBuffer
`ArrayBuffer` 对象用来表示通用的、固定长度的原始二进制数据缓冲区。ArrayBuffer 不能直接操作，而是要通过类型数组对象或 DataView 对象来操作
```js
function cloneArrayBuffer(arrayBuffer) {
// 先new一个一样长度的
  const result = new arrayBuffer.constructor(arrayBuffer.byteLength);
// 使用Uint8Array操作ArrayBuffer，重新set一次
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
// 或者使用DataView
// new DataView(result).setUint8(new Uint8Array(arrayBuffer));
  return result;
}
```

### DataView
上面提了一下dataview
```js
function cloneDataView(dataView, isDeep) {
// 先把buffer拷贝
  const buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
// 再new 的时候，传入拷贝过的buffer
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
```
其实dataview一些api和类型化数组(Float32Array, Float64Array, Int8Array, Int16Array, Int32Array, Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array)很像，套路都是一样的，所以拷贝类型化数组直接改一下函数就ok
```js
function cloneTypedArray(typedArray, isDeep) {
  const buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
```
### RegExp
拷贝正则的时候，只需要读取他的source以及其他各种模式即可
```js
/\w*$/.exec( /a/gim); // gim
```
因此克隆正则代码也很简单，但是要特别注意`lastIndex`在加了`g`的匹配模式下的坑:
![image](https://user-gold-cdn.xitu.io/2019/11/18/16e7f0dc91a3e50a?w=378&h=442&f=png&s=35577)

```js
function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, /\w*$/.exec(regexp));
  result.lastIndex = regexp.lastIndex; // 有g的时候的坑
  return result;
}
```

### Symbol
symbol类型的值，通过`Symbol(value)`产生，而且Symbol不能new。因此，克隆对象型的Symbol怎么办呢（如new Boolean、new Number这种手段产生的对象），其实只需要Object包一下即可，它的valueOf转换还是转换为正常的`symbol`类型的值

```js
function cloneSymbol(symbol) {
  return Symbol.prototype.valueOf ? Object(symbol.valueOf()) : {};
}
```

### 其他类型
如new出来的基本数据类型：Number、Boolean、String，也是直接重新new一下即可。Boolean需要注意：`!!new Boolean(false) === true`，但是`+new Boolean(false) === 0`，所以new时转数字即可：
`new Boolean(+boolObj)`

Date对象，也是直接new即可。不过为了安全起见可以先转成数字时间戳再new

至于Set、Map，重新new一个空的，然后一个个加进去。需要把递归后的结果加进去，因为加进去的元素也可能是复杂数据类型哦

## 数组克隆
### 数组初始化
初始化一般就定义一个空数组就行了。没错，的确是的。但是，还有一种特殊的数组，就是正则match返回的数组，具有index、input属性:
```js
function initCloneArray(array) {
  const length = array.length;
  const result = new array.constructor(length);
 
  // 正则match返回
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
```
接下来就是克隆一个数组了，浅拷贝就直接返回`[...array]`，深拷贝数组的方法和普通对象一样的

## 普通对象克隆
### 初始化对象initCloneObject
创建对象，我们都知道一个花括号字面量即可：`const o = {};`。但是，我们拷贝的时候，要考虑到继承的情况以及是不是原型对象
```js
// 是否是原型对象
function isPrototype(value) {
  return value === (value.constructor.prototype || Object.prototype);
}

function initCloneObject(object) {
// 不是原型对象，那就Object.create保持继承关系
// 是原型对象，那就直接返回一个空对象
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? Object.create(Object.getPrototypeOf(object))
    : {};
}
```

### 获取所有的key
有了新对象，那么下一步就是从旧对象里面一个个key拷贝过来。对于key应该怎么拿，有几种case：
- 拷贝symbol key和拷贝原型链
- 不拷贝symbol key和拷贝原型链
- 不拷贝symbol key和不拷贝原型链
- 拷贝symbol key和不拷贝原型链

lodash里面，isFlat表示是否拷贝原型链，isFull表示是否拷贝symbol key，keysFunc返回一个数组，给后面遍历使用
```js
  const keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);
```
根据我们的目的，我们要把4个获取key的方法实现出来。但是，在实现之前，先铺垫一下一些坑：
```js
const o = { b: 1 }
Object.defineProperty(o, 'a', { value: 666, enumerable: false })
for(x in o) { console.log(x) } // 只有b
Object.keys(o) // 只有b

const sb = Symbol() // symbol 做key
Object.defineProperty(o, sb, { value: 666, enumerable: false })
Object.getOwnPropertySymbols(o) // Symbol
for(x in o) { console.log(x) } // 只有b
```
因此，实现代码如下：
```js
// 普通获取key
function keys(object) {
  return Object.keys(object)
}
// 普通获取key，包含symbol key
function getAllKeys(object) {
// getOwnPropertySymbols会把不能枚举的都拿到
  return [
    ...Object.getOwnPropertySymbols(object).filter(key => object.propertyIsEnumerable(key)),
    ...Object.keys(object)
  ]
}

// 获取原型链上的key
function keysIn(object) {
  const res = [];
  for (const key in object) {
    // 拷贝所有的属性（除了最大的原型对象）
    if (key !== 'constructor' || (!isPrototype(object) && object.hasOwnProperty(key))) {
      result.push(key);
    }
  }
  return res;
}

function getAllKeysIn(object) {
  const res = [];
  // in拿不到symbol key
  for (const key in object) {
    // 拷贝所有的属性（除了最大的原型对象）
    if (key !== 'constructor' || (!isPrototype(object) && object.hasOwnProperty(key))) {
      result.push(key);
    }
  }
  let temp = object;
  // 逐层获取symbol key
  while(temp) {
    res.push(...Object.getOwnPropertySymbols(object).filter(key => object.propertyIsEnumerable(key)))
    temp = Object.getPrototypeOf(object)
  }
  return res;
}
```
### 递归赋值
一切准备就绪，就到了赋值阶段：
```js
// 伪代码
function deepCopy(o, ...rest) {
  const result = {};
  if (isPlainObject) {
  keysFunc(o).forEach((key) => {
    result[key] = deepCopy(o[key], ...rest)
  });
  }
}
```
对于Map、Set都是差不多的，先new一个空的Set、Map，然后遍历赋值，Set就使用`add`方法，Map使用`set`方法

## 全部代码
<details>
<summary>铺垫代码</summary>

```js
/* 常量定义 */
const CLONE_DEEP_FLAG = 1;
const CLONE_FLAT_FLAG = 2;
const CLONE_SYMBOLS_FLAG = 4;

globalThis.Buffer = globalThis.Buffer || undefined;

const argsTag = "[object Arguments]",
  arrayTag = "[object Array]",
  boolTag = "[object Boolean]",
  dateTag = "[object Date]",
  errorTag = "[object Error]",
  funcTag = "[object Function]",
  genTag = "[object GeneratorFunction]",
  mapTag = "[object Map]",
  numberTag = "[object Number]",
  objectTag = "[object Object]",
  regexpTag = "[object RegExp]",
  setTag = "[object Set]",
  stringTag = "[object String]",
  symbolTag = "[object Symbol]",
  weakMapTag = "[object WeakMap]";

const arrayBufferTag = "[object ArrayBuffer]",
  dataViewTag = "[object DataView]",
  float32Tag = "[object Float32Array]",
  float64Tag = "[object Float64Array]",
  int8Tag = "[object Int8Array]",
  int16Tag = "[object Int16Array]",
  int32Tag = "[object Int32Array]",
  uint8Tag = "[object Uint8Array]",
  uint8ClampedTag = "[object Uint8ClampedArray]",
  uint16Tag = "[object Uint16Array]",
  uint32Tag = "[object Uint32Array]";

/* 初始化系列 */
// 初始化数组
function initCloneArray(array) {
  const length = array.length;
  const result = new array.constructor(length);
  // 正则match返回
  if (
    length &&
    typeof array[0] == "string" &&
    hasOwnProperty.call(array, "index")
  ) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

// 初始化普通对象
// 是否是原型对象
function isPrototype(value) {
  return value === (value.constructor.prototype || Object.prototype);
}

function initCloneObject(object) {
  // 不是原型对象，那就Object.create保持继承关系
  // 是原型对象，那就直接返回一个空对象
  return typeof object.constructor == "function" && !isPrototype(object)
    ? Object.create(Object.getPrototypeOf(object))
    : {};
}

// 获取[Object xxx]
function getTag(v) {
  return Object.prototype.toString.call(v);
}
// 普通获取key
function keys(object) {
  return Object.keys(object);
}
// 普通获取key，包含symbol key
function getAllKeys(object) {
  // getOwnPropertySymbols会把不能枚举的都拿到
  return [
    ...Object.getOwnPropertySymbols(object).filter(key =>
      object.propertyIsEnumerable(key)
    ),
    ...Object.keys(object)
  ];
}

// 获取原型链上的key
function keysIn(object) {
  const res = [];
  for (const key in object) {
    // 拷贝所有的属性（除了最大的原型对象）
    if (
      key !== "constructor" ||
      (!isPrototype(object) && object.hasOwnProperty(key))
    ) {
      result.push(key);
    }
  }
  return res;
}

function getAllKeysIn(object) {
  const res = [];
  // in拿不到symbol key
  for (const key in object) {
    // 拷贝所有的属性（除了最大的原型对象）
    if (
      key !== "constructor" ||
      (!isPrototype(object) && object.hasOwnProperty(key))
    ) {
      result.push(key);
    }
  }
  let temp = object;
  // 逐层获取symbol key
  while (temp) {
    res.push(
      ...Object.getOwnPropertySymbols(object).filter(key =>
        object.propertyIsEnumerable(key)
      )
    );
    temp = Object.getPrototypeOf(object);
  }
  return res;
}

/* 克隆系列 */
// 克隆Buffer
const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice(); // 深拷贝
  }
  const length = buffer.length;
  const result = allocUnsafe
    ? allocUnsafe(length)
    : new buffer.constructor(length);

  // 为什么这就是浅拷贝呢？
  // 其实和const o = { b: 1 }的浅拷贝是const a = new Object(); a.b = o.b同样的道理
  buffer.copy(result);
  return result;
}

// 克隆ArrayBuffer
function cloneArrayBuffer(arrayBuffer) {
  // 先new一个一样长度的
  const result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  // 使用Uint8Array操作ArrayBuffer，重新set一次
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  // 或者使用DataView
  // new DataView(result).setUint8(new Uint8Array(arrayBuffer));
  return result;
}

// 克隆dataview
function cloneDataView(dataView, isDeep) {
  // 先把buffer拷贝
  const buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  // new的时候，传入拷贝过的buffer
  return new dataView.constructor(
    buffer,
    dataView.byteOffset,
    dataView.byteLength
  );
}

// 克隆类型化数组
function cloneTypedArray(typedArray, isDeep) {
  const buffer = isDeep
    ? cloneArrayBuffer(typedArray.buffer)
    : typedArray.buffer;
  return new typedArray.constructor(
    buffer,
    typedArray.byteOffset,
    typedArray.length
  );
}

// 克隆正则对象
function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, /\w*$/.exec(regexp));
  result.lastIndex = regexp.lastIndex; // 有g的时候的坑
  return result;
}

// 一些对象的初始化或者克隆
function initCloneByTag(object, tag, isDeep) {
  const Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor();

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor();

    case symbolTag:
      return Symbol.prototype.valueOf ? Object(object.valueOf()) : {};
  }
}
```

</details>


baseClone主逻辑：
```js
function baseClone(value, bitmask, customizer, key, object, cache = new Set()) {
  const isDeep = bitmask & CLONE_DEEP_FLAG; // 是否深拷贝
  const isFlat = bitmask & CLONE_FLAT_FLAG; // 是否拷贝原型链上的属性
  const isFull = bitmask & CLONE_SYMBOLS_FLAG; // 是否拷贝symbol key
  const type = typeof value;
  const isArr = Array.isArray(value);
  let result;

  // cloneWith会用到的customizer
  if (customizer) {
    // object是递归带过来的
    result = object ? customizer(value, key, object, cache) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  // 不是复杂类型直接返回
  if (!(value !== null && (type === "object" || type === "function"))) {
    return value;
  }

  if (isArr) {
    // 克隆数组
    result = initCloneArray(value);
    if (!isDeep) {
      // 浅拷贝，直接连上去
      return result.concat(value);
    }
  } else {
    // 克隆其他
    const tag = getTag(value);
    // 是不是函数，按照规范，函数不克隆
    const isFunc = tag == funcTag || tag == genTag;
    // 克隆Buffer
    if (Buffer && Buffer.isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    // 普通对象、argument、函数
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      // 初始化对象
      result = isFlat || isFunc ? {} : initCloneObject(value);
      // 浅拷贝
      if (!isDeep) {
        // 是否获取原型链上的symbol key和普通key
        const getKeysFunc = isFlat ? getAllKeysIn : getAllKeys;
        return getKeysFunc(value).reduce((acc, shallowCopyKey) => {
          // 一个个赋值
          acc[shallowCopyKey] = value[shallowCopyKey];
          return acc;
        }, {});
      }
    } else {
      // 不能拷贝的对象就放弃
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      // arrayBuffer、typedarray、dataView、regexp、Object{[基本数据类型]}的拷贝
      // set、map在这里只是初始化一个空的
      result = initCloneByTag(value, tag, isDeep);
    }
  }

  // 检查环引用
  const cacheed = cache.has(value);
  if (cacheed) {
    return cacheed;
  }
  cache.add(value, result);

  // set和map，一个个来
  if (isSet(value)) {
    value.forEach(subValue => {
      result.add(
        baseClone(subValue, bitmask, customizer, subValue, value, cache)
      );
    });
  } else if (isMap(value)) {
    value.forEach((subValue, key) => {
      result.set(
        key,
        baseClone(subValue, bitmask, customizer, key, value, cache)
      );
    });
  }

  // 获取key的函数
  const keysFunc = isFull
    ? isFlat
      ? getAllKeysIn
      : getAllKeys
    : isFlat
    ? keysIn
    : keys;

  // 对象的属性，只有普通对象有props
  const props = isArr ? undefined : keysFunc(value);
  (props || value).forEach((subValue, key) => {
    let newKey = key; // 数组的index或者对象的key
    let newValue = subValue; // subValue本来是所拷贝的对象里面的key或者数组的一个元素值
    // 是对象的时候
    if (props) {
      newKey = newValue; // 如果是对象，新的key即是forEach第一个参数
      newValue = value[newKey]; // 所拷贝的对象里面的key对应的value
    }
    // 赋值，递归还把当前的一些值带下去(value、cache、newKey)
    result[newKey] = baseClone(
      newValue,
      bitmask,
      customizer,
      newKey,
      value,
      cache
    );
  });
  return result;
}
```



> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)