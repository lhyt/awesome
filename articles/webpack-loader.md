![](https://user-gold-cdn.xitu.io/2020/1/31/16ff94ff5dda508a?w=2144&h=964&f=png&s=150260)
> 对于webpack，一切皆模块。因此，无论什么文件，都需要转换成js可识别模块。你可以理解为，无论什么后缀的文件，都当作js来使用(即使是img、ppt、txt文件等等)。但是直接当作js使用肯定是不行的，需转换为一种能被js理解的方式才能当作js模块来使用——这个转换的过程由webpack的loader来处理。一个webpack loader 是一个导出为函数的 js 模块。webpack内部的`loader runner`会调用这个函数，然后把上一个 loader 产生的结果或者资源文件传入进去，然后返回处理后的结果

下面会从基本使用开始出发，探究一个loader怎么写，并实现`raw-loader`、`json-loader`、`url-loader`、`bundle-loader`

**准备工作: 先安装`webpack`、`webpack-cli`、`webpack-dev-server`，后面的实践用到什么再装什么**

# loader使用
1. 常规方法：webpack.config里面配置rules
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配规则
        use: ['babel-loader'] // require的loader路径数组
      }
    ]
  }
}
```
写了这个规则，只要匹配的文件名以`.js`为结尾的，那就会经过use里面所有的loader处理

2. loadername! 前缀方式
比如有一个txt文件，我们想通过`raw-loader`来获取整个txt文件里面的字符串内容。除了使用统一webpack config配置的方式之外，我们还可以在引入的时候，用这样的语法来引入：
```js
import txt from "raw-loader!./1.txt";
// txt就是这个文件里面所有的内容
```
其实使用webpack.config文件统一配置loader后，最终也是会转成这种方式使用loader再引入的。支持多个loader，语法: `loader1!loader2!yourfilename`

> query替代options

使用loadername! 前缀语法：`raw-loader?a=1&b=2!./1.txt`，等价于webpack配置：
```js
      {
        test: /^1\.txt$/,
        exclude: /node_modules/,
        use: [
          { loader: "raw-loader", options: { a: '1', b: '2' } },
        ]
      },
```

在写自己的loader的时候，经常会使用`loader-utils`(不需要特地安装，装了webpack一套就自带)来获取传入参数
```js
const { getOptions } = require("loader-utils");
module.exports = function(content) {
  const options = getOptions(this) || {};
  // 如果是配置，返回的是options；如果是loadername!语法，返回根据query字符串生成的对象
 // ...
};
```
<b style="color: #f00">下文为了方便演示，会多次使用此方法配置loader。如果没用过这种方法的，就当作入门学习吧😊。搞起～</b>

# 一个loader一般是怎样的
一个loader是一个导出为函数的 js 模块，这个函数有三个参数：content, map, meta
- content: 表示源文件字符串或者buffer
- map: 表示sourcemap对象
- meta: 表示元数据，辅助对象

我们实现一个最最最简单的，给代码加上一句console的loader：
```js
// console.js
module.exports = function(content, map, meta) {
  return `${content}; console.log('loader exec')`;
};
```

webpack配置
```js
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: "./loaders/console" }, // 加上自己写的loader
        ]
      }
    ]
  },
```

![](https://user-gold-cdn.xitu.io/2020/1/31/16ff95878a98a630?w=224&h=222&f=png&s=55889)
我们发现，重新跑构建后，每一个js都打印一下`'loader exec'`

# 最简单的loader——raw-loader和json-loader
这两个loader就是读取文件内容，然后可以使用import或者require导入原始文件所有的内容。很明显，原文件被当作js使用的时候，缺少了一个导出语句，loader做的事情就是加上导出语句。

比如有一个这样的txt
```txt
this is a txt file
```
假如你把它当作js来用，import或者require进来的时候，执行`this is a txt file`这句js，肯定会报错。如果想正常使用，那么这个txt文件需要改成:
```txt
export default 'this is a txt file'
```

最终的效果就是，无论是什么文件，txt、md、json等等，都当作一个js文件来用，原文件内容相当于一个字符串，被导出了：
```js
// 自己写的raw-loader
const { getOptions } = require("loader-utils");
// 获取webpack配置的options，写loader的固定套路第一步

module.exports = function(content, map, meta) {
  const opts = getOptions(this) || {};

  const code = JSON.stringify(content);
  const isESM = typeof opts.esModule !== "undefined" ? options.esModule : true;
// 直接返回原文件内容
  return `${isESM ? "export default" : "module.exports ="} ${code}`;
};
```
`raw-loader`和`json-loader`几乎都是一样的，他们的目的就是把原文件所有的内容作为一个字符串导出，而json-loader多了一个json.parse的过程

> 注意：看了一下官方的loader源码，发现它们还会多一个步骤

```js
JSON.stringify(content)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
```
`\u2028`和`\u2029`是特殊字符，和`\n`、`\b`之类的类似，但它们特殊之处在于——转义后直观上看还是一个空字符串。可以看见它特殊之处：

![](https://user-gold-cdn.xitu.io/2020/1/29/16ff15e177096a16?w=1056&h=180&f=png&s=55008)

即使你看得见中间有一个奇怪的字符，但是你再按下enter，还是`'ab'`，`\u2028`字符串在直观上来看相当于空字符串(实际上字符是存在的，却没有它的带来的效果)。而对于除了2028和2029，比如`\u000A`的`\n`，是有换行的效果的(字符存在，也有它带来的效果)。因此，对于低概率出现的字符值为2028和2029的转义是有必要的

Unicode 字符值 | 转义序列 | 含义 | 类别
-- | -- | -- | --
\u0008 | \b | Backspace |  
\u0009 | \t | Tab | 空白
\u000A | \n | 换行符（换行） | 行结束符
\u000B | \v | 垂直制表符 | 空白
\u000C | \f | 换页 | 空白
\u000D | \r | 回车 | 行结束符
\u0022 | \" | 双引号 (") |  
\u0027 | \‘ | 单引号 (‘) |  
\u005C | \\ | 反斜杠 (\) |  
\u00A0 |   | 不间断空格 | 空白
\u2028 |   | 行分隔符 | 行结束符
\u2029 |   | 段落分隔符 | 行结束符
\uFEFF |   | 字节顺序标记 | 空白


![](https://user-gold-cdn.xitu.io/2020/1/31/16ff9609075c1293?w=234&h=188&f=png&s=65761)

# raw模式与url-loader
我们前面已经实现了`raw-loader`，这个loader是把原文件里面的内容以字符串形式返回。但是问题来了，有的文件并不是一个字符串就可以解决的了的，比如图片、视频、音频。此时，我们需要直接利用原文件的`buffer`。恰好，loader函数的第一个参数content，支持`string/buffer`

> 如何开启buffer类型的content？

```js
// 只需要导出raw为true
module.exports.raw = true
```

`url-loader`的流程就是，读取配置，是否可以转、怎么转=>读取原文件buffer=>buffer转base64输出 => 无法转换的走fallback流程。我们下面实现一个简易版本的`url-loader`，仅仅实现核心功能
```js
const { getOptions } = require("loader-utils");

module.exports = function(content) {
  const options = getOptions(this) || {};
  const mimetype = options.mimetype;

  const esModule =
    typeof options.esModule !== "undefined" ? options.esModule : true;

// base编码组成：data:[mime类型];base64,[文件编码后内容]
  return `${esModule ? "export default" : "module.exports ="} ${JSON.stringify(
    `data:${mimetype || ""};base64,${content.toString("base64")}`
  )}`;
};

module.exports.raw = true;
```
然后，我们随便弄一张图片，import进来试一下：
```js
// loader路径自行修改
// img就是一个base64的图片路径，可以直接放img标签使用
import img from "../../loaders/my-url-loader?mimetype=image!./1.png";
```

至于`file-loader`，相信大家也有思路了吧，流程就是：读取配置里面的publicpath=>确定最终输出路径=>文件名称加上MD5 哈希值=>搬运一份文件，文件名改新的名=>新文件名拼接前面的path=>输出最终文件路径

# pitch与bundle-loader
[官网对pitching loader介绍](https://www.webpackjs.com/api/loaders/#%E8%B6%8A%E8%BF%87-loader-pitching-loader-)是: loader 总是从右到左地被调用。有些情况下，loader 只关心 request 后面的元数据(metadata)，并且忽略前一个 loader 的结果。在实际（从右到左）执行 loader 之前，会先从左到右调用 loader 上的 pitch 方法。<strong style="color: #f00">其次，如果某个 loader 在 pitch 方法中返回一个结果，那么这个过程会跳过剩下的 loader</strong>

pitch方法的三个参数:
- remainingRequest: 后面的loader+资源路径，loadername!的语法
- precedingRequest: 资源路径
- metadata: 和普通的loader函数的第三个参数一样，辅助对象，而且loader执行的全程用的是同一个对象哦

loader从后往前执行这个过程，你可以视为顺序入栈倒序出栈。比如命中某种规则A的文件，会经历3个loader: `['a-loader', 'b-loader', 'c-loader']`

会经历这样的过程: 
- 执行a-loader的`pitch`方法
- 执行b-loader `pitch`方法
- 执行c-loader `pitch`方法
- 根据import/require路径获取资源内容
- c-loader 执行
- b-loader 执行
- a-loader 执行

如果`b-loader`里面有一个pitch方法，而且这个pitch方法有返回结果，那么上面这个过程自从经过了`b-loader`后，就不会再将`c-loader`入栈

```js
// b-loader
module.exports = function(content) {
  return content;
};

// 没做什么，就透传import进来再export出去
module.exports.pitch = function(remainingRequest) {
// remainingRequest路径要加-! 前缀
  return `import s from ${JSON.stringify(
    `-!${remainingRequest}`
  )}; export default s`;
};
```

b-loader的pitch方法有返回结果，会经历这样的过程: 
- 执行a-loader的`pitch`方法
- 执行b-loader `pitch`方法(有返回结果，跳过c-loader)
- 根据import/require路径获取资源内容
- b-loader 执行
- a-loader 执行

> 什么情况下需要跳过剩下的loader呢？最常见的，就是动态加载和缓存读取了，要跳过后面loader的计算。`bundle-loader`是一个典型的例子

`bundle-loader`实现的是动态按需加载，怎么使用呢？我们可以对react最终ReactDom.render那一步改造一下，换成动态加载`react-dom`，再体会一下区别

```diff
- import ReactDom from "react-dom";
+ import LazyReactDom from "bundle-loader?lazy&name=reactDom!react-dom";

+ LazyReactDom(ReactDom => {
+   console.log(ReactDom, "ReactDom");
ReactDom.render(<S />, document.getElementById("root"));
+});
```
可以看见reactdom被隔离开来，动态引入
![](https://user-gold-cdn.xitu.io/2020/1/30/16ff63a0929b334c?w=1060&h=54&f=png&s=12550)

点开`bundle-loader`源码，发现它利用的是`require.ensure`来动态引入，具体的实现也很简单，具体看[bundle-loader源码](https://github.com/webpack-contrib/bundle-loader/blob/master/index.js)。时代在变化，新时代的动态引入应该是`动态import`，下面我们自己基于动态import来实现一个新的`bundle-loader`。(仅实现lazy引入的核心功能)

```js
// 获取ChunkName
function getChunkNameFromRemainingRequest(r) {
  const paths = r.split("/");
  let cursor = paths.length - 1;
  if (/^index\./.test(paths[cursor])) {
    cursor--;
  }
  return paths[cursor];
}

// 原loader不需要做什么了
module.exports = function() {};

module.exports.pitch = function(remainingRequest, r) {
  // 带loadername!前缀的依赖路径
  const s = JSON.stringify(`-!${remainingRequest}`);
  // 使用注释webpackChunkName来定义chunkname的语法
  return `export default function(cb) {
  return cb(import(/* webpackChunkName: "my-lazy-${getChunkNameFromRemainingRequest(
    this.resource
  )}" */${s}));
}`;
};

```
用法和官方的`bundle-loader`基本差不多，只是动态import返回一个promise，需要改一下使用方法:
```js
import LazyReactDom from "../loaders/my-bundle!react-dom";

setTimeout(() => {
  LazyReactDom(r => {
    r.then(({ default: ReactDom }) => {
      ReactDom.render(<S />, document.getElementById("root"));
    });
  });
}, 1000);
```

![](https://user-gold-cdn.xitu.io/2020/1/30/16ff688184bf7602?w=1256&h=44&f=png&s=13756)

# loader上下文
上文我们看见有在写loader的时候使用this，这个this就是loader的上下文。具体可见[官网](https://www.webpackjs.com/api/loaders/#loader-%E4%B8%8A%E4%B8%8B%E6%96%87)

一堆上下文的属性中，我们拿其中一个来实践一下: `this.loadModule`

> loadModule(request: string, callback: function(err, source, sourceMap, module))

`loadModule`方法作用是，解析给定的 request 到一个模块，应用所有配置的 loader ，并且在回调函数中传入生成的 source 、sourceMap和webpack内部的`NormalModule`实例。如果你需要获取其他模块的源代码来生成结果的话，你可以使用这个函数。

很明显，这个方法其中一个应用场景就是，在已有代码上注入其他依赖

> let's coding

![](https://user-gold-cdn.xitu.io/2020/1/31/16ff97062cd80b2e?w=486&h=378&f=png&s=184738)

背景：已有一个api文件api.js
```js
const api0 = {
  log(...args) {
    console.log("api log>>>", ...args);
  }
};
module.exports = api0;
```
希望效果：我们使用下面这个`a.js`js文件的时候，可以直接使用api，且不报错
```js
// a.js
export default function a() {
  return 1;
}
// 其他代码
// ...

api.log("a", "b");
```

因此，我们需要构建的时候loader把api打进去我们的代码里面：
```js
// addapi的loader
module.exports = function(content, map, meta) {
// 涉及到加载模块，异步loader
  const callback = this.async();
  this.loadModule("../src/api.js", (err, source, sourceMap, module) => {
// source是一个module.exports = require(xxx)的字符串，我们需要require那部分
    callback(
      null,
      `const api = ${source.split("=")[1]};
${content};`,
      sourceMap,
      meta
    );
  });
  return;
};
```
loader写好了，记得去webpack配置里面加上，或者使用loadername!的语法引入a.js(`./loaders/addapi!./a.js`)

最后我们可以看见成功运行了api.js的log
![](https://user-gold-cdn.xitu.io/2020/1/31/16ff7386b3498a24?w=278&h=42&f=png&s=2935)

平时也有一些熟悉的场景，某某某api、某某某sdk、公共utils方法、每一个index页面的pvuv上报等等，需要先把这些js加载执行完或者导入。如果我们懒得一个个文件加`import/require`语句，就可以用这种方式瞬间完成。**这种骚操作的前提是，保证后续同事接手项目难度低、代码无坑。注释、文档、优雅命名都搞起来**
# 最后
loader的作用就是，让一切文件，转化为自己所需要、能使用的js模块运行起来。babel和loader双剑合璧更加强大，可以为所欲为的修改代码、偷懒等等。后续还会出webpack插件、babel相关的文章，大家一起来学习交流～


> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)