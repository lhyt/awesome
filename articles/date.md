> “活动已经上线了，按照预期，早上8点开始。然而，苹果手机活动居然还没开始，而安卓手机已经开始了！” 🙀

# 活动怎么还没开始？！
假设有一个活动，原计划定的是12月25日早上8点开始，结果苹果用户到了早上8点却看见活动按钮还是灰色的，而且PC、安卓都是正常。这种情况如果发生，首先往哪个方向考虑呢？

第一个想到的应该就是`new Date`传入UTC字符串的坑了：

```js
new Date('2019-12-25T08:00')
// pc chrome: Wed Dec 25 2019 08:00:00 GMT+0800 (中国标准时间)
// 苹果手机: Wed Dec 25 2019 16:00:00 GMT+0800 (CST)
// mac safari: Wed Dec 25 2019 16:00:00 GMT+0800 (CST)
new Date('2019/12/25 08:00')
// pc chrome: Wed Dec 25 2019 08:00:00 GMT+0800 (中国标准时间)
// 苹果手机: Wed Dec 25 2019 08:00:00 GMT+0800 (CST)
// mac safari: Wed Dec 25 2019 08:00:00 GMT+0800 (CST)

// 加一个T，safari下就可以算是UTC字符串了
```

> 地理常识复习: 格林尼治时间(GMT)的正午是指当太阳横穿本初子午线的时候（格林尼治此时为当地中午12点），有了这个参考点，那么其他任意时刻任意时区的时间都可以推导出来。但是，众所周知，地球不是完美的球体，地球每天的自转也不是完全按照一样的规律的。现在的标准时间一般使用的是由原子钟报时的协调世界时（UTC），UTC时间以原子时秒长为基础。不过GMT、UTC差别不影响生活。

我们也可以看见`new Date`打印有`GMT+0800 (中国标准时间)`。因为中国处于东八区，与UTC时间相差8个小时，所以有`GMT+0800`标记。也就是说UTC时间00:00:00的时候，我们的时间是08:00:00。我们可以把`GMT+0800`改成`GMT+0900`，new Date后发现就少了一个小时了。另外，移动端打印的CST表示的就是北京时间了

好了，上面的问题怎么解决。已经知道了传UTC时间出问题了，那么我们就不传UTC时间咯。

<span style="color: #f00">时间戳大法好，不过因为难以改变的历史原因，就是给你UTC字符串你怎么办？</span>

首先，中间加一个T就是分割日期和时间，而ios上这就算是UTC字符串了。如果要解决上面的问题，那么我们把它换成空格就好了。但是，又有另外一个坑，IOS上执行`new Date('2019-12-25 08:00')`会得到`invilaid date`。处理方法是把`2019-12-25`转换成`2019/12/25`的格式:
```js
'2019-12-25T08:00'.replace(/-/g, '/').replace('T', ' ')
new Date('2019/12/25 08:00')
```
如果最后一位加一个Z，则表示的一定是UTC时间，除了ios，pc上也是会加多8小时
```js
new Date('2019-12-25T08:00Z')
// pc: Wed Dec 25 2019 16:00:00 GMT+0800 (中国标准时间)
```
另外，`Date.prototype`还有一个`getTimezoneOffset`，顾名思义应该和时差有关。该方法返回与UTC的时差，单位是分。我们处于GMT+8，返回-480 (0 - 8) * 60 = -480
```js
new Date().getTimezoneOffset()
```
所以，上面的问题我们还可以在UTC时间下，使用`getTimezoneOffset`作为另一个解决方案:
```js
// 当判断为苹果设备的时候，使用该方法
if (/iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)) {
    const date = new Date(Date.parse(UTCString) + new Date().getTimezoneOffset() * 60 * 1000)
}
```
# 继续研究
看了一下Date对象的prototype的方法，看起来很多，实际上就是get和set了UTC、GMT的年月日时分秒。基本的set、get方法，大家写日期组件应该写过不少了，市面上也有成熟的解决方案如moment。

对于时差问题，我们平时产品如果没有对外的话，一般没什么问题，如果是UTC时间记得转回来就是了。如果涉及到海外，我们尽量还是使用UTC好一些。对于前后端，也是应该传UTC时间的，而且应该传时间戳。UTC时间戳生成方法：
```js
// 表示的是UTC时间2019/12/11 11:11:11:011的UTC时间戳
Date.UTC(2019, 11, 11, 11, 11, 11 ,11)
```
下面，我们看看两地时间如何转换
> 本地时间 <=> UTC <=> 异地时间

```js
// 本地异地以UTC为沟通桥梁
// 本地/异地生成UTC
const UTCString = new Date().toISOString()
// 异地/本地解析UTC
const dateString = new Date(UTCString) 
dateString.toLocaleString() // 格式化为当地时间，toLocaleString有很多配置项
```

> UTC => 本地/异地时间

```js
// 某个活动以UTC时间为中心
const UTCTimestamp = Date.UTC(2019, 11, 11, 11, 11, 11 ,11)
// 解析为本地时间
const localTime = new Date(new Date(UTCTimestamp).toISOString())
// 等价于
new Date('2019-12-11T11:11:11Z') // 注意 -
// 格式化时间
localTime.toLocaleString()
```

Date的prototype上有各种toxxstring，着重看一下toLocaleString、toLocaleTime，它们参数配置项很多，下面总结了一波文档的介绍，快速熟悉这个方法的使用技巧。我们先看几个例子：
```js
// 首先，我们先定一个上帝时间UTC
const UTCTimestamp = Date.UTC(2019, 11, 11, 11, 11, 11 ,11)
// 无参数默认当前时区的时间格式化方案
// 🇨🇳"2019/12/11 下午7:11:11"
new Date(UTCTimestamp).toLocaleString()
new Date(UTCTimestamp).toLocaleString('zh-CN')

// 🇬🇧12/11/2019, 7:11:11 PM
new Date(UTCTimestamp).toLocaleString('en-US')

// 🇫🇷 11/12/2019 à 19:11:11
new Date(UTCTimestamp).toLocaleString('fr')

// 🇰🇷 2019. 12. 11. 오후 7:11:11
new Date(UTCTimestamp).toLocaleString('ko')
```
这种表示方法传入的参数叫**locales参数，指定了当地语言，告诉toLocaleString以哪种语言、如何格式化日期**。toLocaleTimeString也是一样，只是它只返回时间部分。

toLocaleString还可以传第二个参数，是一个配置对象，该对象的属性都可以随意组合：
```ts
{
    ['weekday'(星期)|'era'(纪元)]:'narrow'(紧凑、最短)|'short'(短)|'long'(长),
    ['year'|'month'|'day'|'hour'|'minute'|'second']:'numeric'(展示完整)| '2-digit'(2位)
}
// 其中month还支持"narrow", "short", "long"
```
使用的时候，有什么key以及对应的值，就以什么状态展示在最终返回的日期字符串中。<span style="color: red">如果使用的时候，key的值并不是规定的那些，那么js将会报错</span>

```js
// 🌰
const date = new Date('2019-12-11T11:11:11Z')
date.toLocaleString("ch", {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  hour12: false, // 不开启12小时模式
  hour: '2-digit', minute: '2-digit', era: 'narrow'
})
// 公元2019年12月11日星期三 19:11, 对于中文era用什么都一样

// 其他条件不变，语言从ch换成en
// options.era='narrow':  Wednesday, December 11, 2019 A, 19:11
// options.era='short':  Wednesday, December 11, 2019 AD, 19:11
// options.era='long':  Wednesday, December 11, 2019 Anno Domini, 19:11
// 同上,options.hour12=true: Wednesday, December 11, 2019 Anno Domini, 07:11 PM
```
好了，还有一个很重要的属性——`timeZone`，它确定了时区。所以，给你一个Date，你不规定时区的话，那么它是多少就多少，不会转时区，平时使用的new Date时候就是这样。我们前面所做的都是控制它的最终展示而已。**它的值必须是timeZone数据库里面的**，timeZone数据库可以[**<span style="color: red">点击这里</span>**](https://www.iana.org/time-zones)下载。

下载了时区数据文件，看见一个叫asia的文件，果断打开，然后找到了中国相关的时区：
![](https://user-gold-cdn.xitu.io/2019/9/7/16d07de18cc5de47?w=890&h=532&f=png&s=283636)

```js
date.toLocaleString("en", {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  hour12: true, hour: '2-digit', minute: '2-digit', era: 'long',
  timeZone: 'Asia/Urumqi'
})
// Wednesday, December 11, 2019 Anno Domini, 05:11 PM 乌鲁木齐少两个时区
// timeZone='Asia/Shanghai': Wednesday, December 11, 2019 Anno Domini, 07:11 PM  本来就是和上海时区一样
// timeZone='Europe/Vienna': Wednesday, December 11, 2019 Anno Domini, 12:11 PM
```

其实就是各种属性自由组合，随意发挥了。所以，是不是觉得日期格式化白写了？这并不是的，如果不兼容呢，不还是要写？不过，检测toLocaleString不兼容传入各种配置也很简单：
```js
try {
    date.toLocaleString('are u ok?')
    // 不兼容，自己实现一波
} catch {
    // 兼容，愉快玩耍
}

```


> [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)是另一种方案，mdn上说: 当格式化大量日期时，最好创建一个 Intl.DateTimeFormat 对象，然后使用该对象 format 属性提供的方法。使用起来其实也还是差不多的


# Date的隐式转换
之前有[另一篇文章](https://juejin.im/post/5ae829eb6fb9a07aa6318efc)讲了隐式转换。Date对象在隐式转换的时候，和其他类型不一样。Date对象先隐式调用toString，而其他类型则会先尝试调用valueOf，如果valueOf后返回的还是原先那个类型的话，会执行toString。
```js
new Date - 1 // 时间戳 - 1。先toString，发现有数字类型，再valueOf。而Date的valueOf返回的是时间戳
new Date + '1' // 一串文字1。先toString，字符串+字符串不需要再转了

// 一个神奇的结果，猜想：JSON.stringify会寻找date的toJSON来使用
new Date().toJSON() // "yyyy-mm-ddThh:mm:ss.mmmZ"
JSON.stringify(new Date) // ""yyyy-mm-ddThh:mm:ss.mmmZ""
// 相当于JSON.stringify("yyyy-mm-ddThh:mm:ss.mmmZ")
```
我们大胆地把date的toJSON干掉：
```js
const date = new Date
date.toJSON = null
JSON.stringify(date)
// "{"toJSON":null}"
```
还可以改成其他值，最后的结果就是该是什么就是什么了

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)