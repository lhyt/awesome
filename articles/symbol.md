> 元编程的概念有很多文章，通过操作更加底层的api做更多个性化的功能。一句话概括，就是**用代码来写代码**

一些时候，写各种下划线、前后缀，为了实现一个唯一值或者秘密的特殊辅助值，用来辅助业务逻辑或者说作为一个私有的东西：
```javascript
const onlyone = 'im-only@@我就不信会重复';
const obj = {};
obj[onlyone] = 'xxx';

```
angular1暴露出来的对象里面，经常看见`$`开头或者`$$`开头的变量。`$`开头是比较底层的变量了，`$$`开头的是更加底层的，而且我们是基本不会用上的。还有redux源码，首次初始化的action.type是`var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');`

种种例子，都可以看见，搞个花哨的名字，作为内部运行的辅助变量或者唯一变量使用。花时间想key名字，而且名字越写越长，是不是总感觉是一种麻烦？

更重要的，对象如果暴露出去了，那人家就可以看见key值，也可以直接修改了

## symbol做唯一key
```javascript
const only = Symbol();
const obj = {};
obj[only] = 'xxx';
```
此时，只有定义了symbol的作用域之下才能用到它了，暴露对象出去，就算在console里面给人家看见一个symbol，想修改它或者读取它也无能为力。甚至还可以有`obj['Symbol()'] = 1`这种操作：

在react打印出来的组件对象里面，也可以看见一些symbol的属性。
![image](https://user-gold-cdn.xitu.io/2019/3/22/169a337351d30136?w=780&h=206&f=png&s=28959)

此外，symbol是不可枚举的：
```javascript
const only = Symbol();
const obj = { a: 1, b: 2 };
obj[only] = 'xxx';
Object.keys(obj);
```
同样，JSON.stringify、for in等等也是会把symbol跳过了。

> 但是，想像其他变量那样子用怎么办，也就是以不同姿势使用同样的方法，期望得到同样的值，期望近似与`symbol('a')`和`symbol('a')`是完全相等这种效果

这时候，`Symbol.for`刚刚好满足需求了:
```
const a = Symbol.for('im not alone')
const b = Symbol.for('im not alone')
a === b
```
这下symbol就是有点简单数据类型的感觉了吧

## Symbol.iterator
这个属性，是一个当前对象默认的遍历器生成函数，所以我们用`obj[Symbol.iterator]`可以访问到它。自定义`Symbol.iterator`会覆盖for of遍历、...操作符。实现一个伪数组，主要就是要把这个函数设置好就可以了：
```javascript
// 方法1
var fakeArr = {}
fakeArr[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...fakeArr] // [1,2,3]

// 方法2
var arr = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
[...arr] // [1,2,3]

// 方法3
var arr = {
  [Symbol.iterator]: (() => {
    var data = ['随', '机', '试', '一', '下'];
    return () => {
      var cursor = 0;
      return {
        next: () => {
          if (cursor ++ < 10) {
            return {
              value: data[~~(5 * Math.random())],
              done: false
            }
          }
          return {
            done: true 
          }
        } 
      }
    }
  })()
};
// 这下就不用自己搞一个随机数组生成器了
[...arr];


// 自定义的遍历对象
var o = {
  a: 1,
  b: 2,
  hidden: 'u cant find me',
  [Symbol.iterator]: () => {
    var cursor = 0;
    return {
      next() {
        if (cursor < Object.keys(o).length - 1) {
          return {
            value: Object.keys(o)[cursor ++],
            done: false,
          }
        }
        return { done: true };
      }
    }
  }
}
[...o]; // ['a', 'b']
```
为所欲为的遍历，可以在中间加上其他逻辑。在业务上，对于一系列规定的流程但不一定相同但结果这种逻辑，我们就可以用上它。什么上报、条件判断、校验都可以做

```
// 条件遍历
// 有一个按钮数组是这样的[{ renderer, style,label }...]，传入对象展示按钮
// 正常情况我们直接写在数组里面没问题
// 如果复杂一点，按照条件展示按钮，我们就要在外面再写其他逻辑
// 如果使用iterator，可以优雅简化这个过程
var type = 'btn1';
var Btns = {
  btn1: {
    renderer() {
      return 1
    },
    style: {
      height: '10px'
    }
  },
  btn2: {
    renderer() {
      return 2
    },
  },
  btn3: {
    renderer() {
      return 3
    },
    label: {
      name: 'hello'
    }
  },
  *[Symbol.iterator]() {
    switch (type) {
      case 'btn1':
        yield this.btn1
        break;
    
      default:
        yield this.btn2
        break;
    }
    yield this.btn3
  }
};
console.log([...Btns]);
type = 'other';
console.log([...Btns]);
```
可以试一下，结果是不一样的。这样子，我们就可以完全不用在外面关心条件遍历，也不用在多个地方遍历的时候写逻辑，这个已经在对象的内部实现

## Symbol.toPrimitive
[另外一篇文章](https://github.com/lhyt/issue/issues/5)已经讲过类型转换关系，复杂类型隐式转换会先toPrimitive转回基本类型。而Symbol也有这种操作到更底层的方法：`Symbol.toPrimitive`，可以自定义
```javascript
// 不玩包装类的string
var s = new String('');
s[Symbol.toPrimitive] = () => { return 'this is magic' };
`${s}这不是空字符串`; // "this is magic这不是空字符串"

// 不想再看见[object Object]了
var o = {
  msg: '你不可以正常看见我的'
};
var _o = {
  msg: '你可以正常看见我的',
  [Symbol.toPrimitive]: () => JSON.stringify(_o)
};
`奇迹不会发生: ${o}  奇迹将会发生: ${_o}`;
```
在隐式转换中，自定义的`Symbol.toPrimitive`优先级最高：
```javascript
var transform = {
  valueOf() {
    return 'valueOf'
  },
  toString() {
    return 'tostring'
  },
  [Symbol.toPrimitive]() {
    return 'symbol'
  }
};
1+transform; //"1symbol"

// 永远地告别[object Object]
Object.prototype[Symbol.toPrimitive] = function() {
  return JSON.stringify(this)
}
```

## 正则相关
对象的`Symbol.replace`方法被`String.prototype.replace`调用时，会返回`Symbol.replace`的返回值。同理，match、search也差不多
```javascript
// 一个具有merge功能的searchvalue
var str = new String('别看我好吗')
str[Symbol.replace] = (oldStr, newStr) => [...new Set([...oldStr, ...newStr])].join('');
'1234'.replace(str, '3456'); // 123456

// 一个神奇的split
var magic = {
  [Symbol.split]: (() => {
    var mana = ['*', '&', '$', '#', '@'];
    var ran = () => mana[~~(Math.random() * 5)];
    return (origin) => {
      var res = '';
      var cursor = 0;
      while(cursor < origin.length) {
        var r = ran();
        res +=  r + origin[cursor ++] + r
      }
      return res;
    }
  })()
};
'你渴望力量吗'.split(magic);
```
正则的比较少用，而且也可以用简单的封装替代。
