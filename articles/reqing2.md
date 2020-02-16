> 对于一种事情，经常重复的话，很容易就会厌烦、觉得无趣、失去了当初的热情。
- 做不完的业务需求，日复一日，就觉得工作乏味、都是体力活；
- c端做多了，就觉得业务逻辑没有挑战性，没意思，设计要求苛刻，特别烦；
- b端做多了，就觉得天天写平台，天天对着无味的数据，没机会玩一下炫酷的特效；
- 技术建设做多了，看着自己做的东西都腻了；
- 研究一些花哨的东西，又对工作内容没有什么意义；
- 想用一下最新技术，然而项目历史原因又望洋兴叹......

自然而然，就失去了当初的热情，找不到成就感，甚至还怀疑，自己是不是不适合做前端，是不是应该换一份工作，是不是要转行了？
[前端工程师如何持续保持热情(一)](https://juejin.im/post/5d6419dee51d4561eb0b26af)

[前端工程师如何持续保持热情(二)](https://juejin.im/post/5d6a54f46fb9a06afa329f1e)

# 不要留在舒适区太久
一个比较常见的问题：每一次都是做差不多的活，又不是很难的那种（舒适区）=>这种事情越来越多=>力不从心、压力山大=>开始厌烦、失去热情

解决方案： 做完可能需要复盘=> 寻求更好的方案=>下次尝试=>效率提升、保持热情
> 上一次这种case是按时完成，这次一定要提前；上次用的是常规方法，这次要争取优化一下；之前试了几次是差不多的套路，这次看看能不能封装一个公共的工具
## 基础铺垫——同样都是搬砖，但要优雅地搬砖
人家还在用手用肩膀搬砖，我们就开直升机来搬砖、用一个自动化机器搬砖、甚至使用magic让砖直接飘到终点。对比之下，我们的搬砖很好玩，甚至还有点上瘾。就像两个人，一个最多只能考100分，另一个是一定能考100分而且还有机会提前交卷、不虚任何难度。他们的热情、成就感、兴趣完全不是一个数量级的。超出预期与赶上预期，它们的区别无异于降维打击了，工作效率差别其中一个小方面，就是从这里开始的

下面我们也是从例子出发：
### eg1：navHeader的菜单
基于antd，我们如果想做一个下拉菜单，用的是menu组件，效果是这样的：
![image](https://user-gold-cdn.xitu.io/2019/8/31/16ce75bddea438a1?w=332&h=332&f=png&s=17718)

那么代码大概就是
```jsx
  <Menu>
    <Menu.Item>
        个人中心
    </Menu.Item>
    <Menu.Item>
        用户管理
    </Menu.Item>
    <Menu.Item>
        退出登录
    </Menu.Item>
  </Menu>
```
对于后续，一般的思路就是，以后产品叫加一个什么item，那就在代码里面加一行就好。但是，**需求总是善变的**，用户管理具有权限，只能由管理员打开怎么办？如果正在操作，退出登录按钮disabled怎么实现？

所以，最开始我们应该直接面向配置编程，通过一个配置对象生成：
```jsx
class Cpn extends Component {
  // ...
  config = [
    {
      display: true,
      render() {
        return (
          <a href="/user">个人中心</a>
        )
      }
    },
    {
      display: this.props.isAdmin,
      render() {
        return (
          <a href="/admin">用户管理</a>
        )
      }
    },
    {
      display: true,
      render: () => {
        return (
          <Button disabled={this.props.isOperating} href="/admin">退出</Button>
        )
      }
    },
  ]

  renderMenu = () => {
    return this.config.filter(x => x.display)
      .map(({ render }, index) => (
        <Menu.Item key={index}>
          {render(index)}
        </Menu.Item>
      ))
  }
  // ...
  render() {
    return (
      <Menu>
        {this.renderMenu()}
      </Menu>
    )
  }
}
// 如果是vue，这样写更爽
```
本来10行代码，被改成了几十行，兜了一个弯回来，刚刚开始可能会觉得麻烦。也许就是因为觉得直接加3行代码一个item很方便很舒服，然后就一直这样下去了。直到后来，这个菜单变得非常复杂，多了很多逻辑和权限控制，那时候的render的代码就是上百甚至几百行的条件渲染了。甚至新来的实习生可能都会吐槽“我们这里有一个几百行的render函数，全是if”。其实，一切的原因，就是因为祖传下来的。再追溯回去，就是最开始的时候想方便，直接写3行代码一个item，后面的人有样学样......这套代码，最后是“也就只能通过这样的方法实现这点效果了”

如果一开始就按照配置来写，以后每次增加一个item，配置数组很稳定地只是多了几行、多了一个元素，如果有更多其他逻辑，可以对renderMenu进行改造，一般也不会超过3行就可以实现。接着这种navheader的菜单式组件，一般是全局存在的组件，所以会连接redux，读props来条件渲染。这样子下去，后面的人也是学着来写，就是一套稳定的可扩展代码了，也不怕需求怎么变更

可能第一次并没有想到要这么写，但是写了一两次需求，复盘一下，会发现这个组件以后有复杂化的趋势，而且都是做了同样的事情。那么这时候，应该要有写配置的想法了

> 温馨提示：慎重考虑，别过度设计，不是所有的组件都是很复杂的

### eg2: “无聊”的后台管理系统？
> 一个ui组件库一把梭，全是各种表单增删改查，表格渲染。这就是后台系统类的需求，也许多数人的实习都有一段做管理后台的经历。大家的看法，大概就是：简单但做得很烦、没意思、无聊、想吐

在代码层面上，如何精简代码，上一次已经讲到，这是减少重复工作的一方面。从业务和架构层面上来说，管理后台类需求也是差不多的：
1. 可能有权限系统
2. 大部分页面逻辑可能是一样的，以表格展示，弹窗增加和修改，勾选删除（或者多选删除）
3. 都是curd，甚至连curd的接口都差不多、页面差不多完全就是数据库每一条数据的直接体现
4. 页面路由可以做成差不多，用id也好，用文字也好，前端会选择xx-router作为解决方案

接下来我们逐个击破（react为例，思路也可以作为其他框架的参考）：
> 可能有权限系统

对于权限，比如会有一个role_id表示当前用户身份，前端读取这个id做判断来展示组件或者能不能做某种操作
```jsx
// 组件层面上的权限
if (role_id === 1) {
  return <Detail />
}
// 逻辑层面上的权限
if (role_id === 1) {
  doSth()
}
// 角色很多，不同角色不同ui，有不同的权限，难道还是要继续加if-else吗？
```
这样子我们就有很多重复操作，逐渐进入了安稳的舒适区。而且做起来的时候这些又不是什么难的事情，但是事情又特别多。于是很快就觉得没意思了，所以我们必须改变现状。

首先，我们要维护一份配置表，上面写着用户能有什么权限
```js
const USER = 1;
const operationsMap = {
  [USER]: [
    'display-detail',
    'dosth',
  ],
};
```
前面的操作，经过我们权限配置表来解决：
```jsx
// 组件层面上，我们可以用高阶组件
const WithPermission = (props) => {
  // 传入角色和权限名，权限表里面在该角色的权限下找，有没有这个操作权限
  return operationsMap[props.roleId].includes(props.action) ? props.children : null;
}
// 组件展示。再也不怕很多个角色了，只需要写一份配置可以解决
<WithPermission action="display-detail" roleId={1}>
  <Detail />
</WithPermission>
// 逻辑层面上，不重复讲了，包一个函数就可以了
```
这里就提供一个参考的路线，更复杂的就是从这条路线发散出去的。**权限这块做起来，方案很多，也要看业务来决定架构**

> 逻辑可能是全部页面一样的

来到页面 =》 请求接口 =》 渲染数据、绑定事件。后面如果有操作： 操作 =》 触发事件 =》 逻辑执行 =》 请求接口/改变ui =》 接口返回重新渲染

全部页面都是这样的，但是又重复写各种组件生命周期里面做该做的事情，<ruby>就命名、变量、少数逻辑不一样<rt>基本一模一样的代码</rt></ruby>。很快，又开始觉得无聊了，而且又浪费时间。此时，不我们在业务页面上写重复逻辑的方法，就是我们需要自己创造一些业务生命周期：
- 来到页面: 在页面render函数return之前加一些处理，如权限拦截、表格框架
- 请求接口：请求之前增加一个prefix，适配数据和个性化逻辑
- 渲染数据：请求完成后，在渲染之前增加一个生命周期处理，如适配逻辑、预处理逻辑

首次逻辑上面多加几个业务生命周期，后面的交互也是差不多的，我们可以复用。只需要知道哪种type和需要的id即可：config[type](id1, id2)。 type为'fetch', 'update', 'delete', 'add'其中之一。对于一般的增删改查，假设我们有一个表格id为tid，表格每一项的id为iid，那么增和查只需要tid，删和改需要tid和iid，固定的套路。

有需要的话，可能会写一个触发事件后的预处理函数prefix，插入个性化逻辑来控制后面的运行。业务生命周期一般和常见的的curd操作是捆绑一起的。

> 都是curd

对于curd的逻辑基本是一模一样，但是这些和生命周期不一样，一些业务生命周期分界线就是curd请求操作，请求接口前、请求接口后、修改前、修改后等等。首先各种重复的curd，可以用配置解决：
```js
// 当前页面配置
// 页面配置到后面应该由一个页面来配置，做到简单需求0开发
const config = {
  fetch: '/api/getInfo',
  update: '/api/updateInfo',
  delete: '/api/deleteInfo',
  add: '/api/addInfo',
}

// 伪代码
// 在框架代码上，先读取当前页面配置：
const currentConfig = allConfigs.find(conf => conf.id === id)

// 业务生命周期和根组件的组件生命周期结合，拉取数据
componentDidMount() {
  // 业务生命周期beforeFetchData，传入配置参数
  const prefixParams = lifecircle.beforeFetchData(currentConfig.params);
  fetchData({
    url: currentConfig.fetch,
    params: prefixParams,
  }).then(res => {
    // 业务生命周期afterFetchData，传入请求的响应
    lifecircle.afterFetchData(res)
    // 错误处理生命周期，不一定触发
  }).catch(e => lifecircle.handleErrorAfterFetch(e))
}
```
这里暂时提供一种思路，如果考虑无差别体验、扩展性、侵入性，实现起来应该使用继承（带业务生命周期的基类）+高阶组件（无差别体验）+依赖注入（对组件加入新逻辑或者改写）来实现，比较麻烦。

> 页面路由可以做成差不多

和前面说的权限差不多的处理方法，一个映射配置表解决，或者可以直接写在权限表里面。当判断到有权限，router切换页面，否则进入兜底页面

管理后台系统类需求，我们并不是单纯为了完成任务把一个个需求做完，而是要把它规划好、做好，做到扩展度和自由度很强、基本无需开发的程度。到那个时候，无形之间已经变成一个小架构师了


## 想尽办法搞一点事情
为了脱离舒适区，我们应该做出改变，和现有的方法不一样。因此，除了优雅地解决日常问题外，还要多一点思考和尝试。也就是每一次复盘后或者知道了常规方案后，脑暴出来的一些想法。如果想法是正确的，那么就会带来更好的收益。其实各种轮子，就是因为这样而产生，为了解决现有的问题

通过几个例子，说明做完项目的思考、搞点事情是有必要的，是改进现状的希望
### 简化git常用4步曲
每一次提交，大家都会用的4步：
```bash
$ git pull
$ git add .
$ git commit -m "feat: 😊今天又一个新特性"
$ git push
```
- 😢：“天天搬砖，天天输这重复的代码，闭着眼、用脚都可以打出来了，有时候还打错字，真烦。不想干了，我想静静，别问我静静是谁”
- 👧：“你的成就感呢？这就没意思了？同是一个办公室，为什么我没有感觉到没意思啊，反而越来越有趣”
- 😢：“怎么做到的，究竟是什么，男人见了沉默，女人见了流泪”
- 👧：“近来研究了npm script，发现我们平时天天做的同样的事情，都可以整合起来一个命令解决，比如你说的git”

```json
{
  "script": {
    "git": "git pull && git add . && git commit -m ",
    "postgit": "git push"
  }
}
```
使用的时候，我们只要`npm run git -- "feat: 😊今天又一个新特性"`。这里涉及两个点，一个是postxxx是指npm run执行某个script之后所做的命令（某个script之前的是prexxx，遵守这种命名协议即可），一个是`--`会给npm命令参数列表加上参数，可以在process.argv里面拿到。*别忘记先设置upstream哦*

- 😢：“啊，你为什么如此优秀”
- 👧：“不说了，我要继续把git hook集成到里面，然后直接远程部署，执行dist命令......做到一个npm run git实现一条龙服务。还有很多事情要做，每天进步一点点，我爱工作。今天又是元气满满的一天哦”

### 代码片段
> 基于vscode

写html的，输入一个html选择再回车就可以出来一片基本结构；写react、vue的，输入几个字母就可以出来常用的模版；写普通的js的，输入常用的api部分字母马上出来一坨......这都是大部分人都在用的xx snippet插件，要哪个下载哪个。

但是，事情总是<ruby>不尽完美<rt>不合预期</rt></ruby>的，一个snippet不是适合所有人的，所以就有了各种各样的其他snippet插件。程序员的心态：用得不爽，马上造一个去。这里不详细展开如何写插件，[详见地址](https://yq.aliyun.com/articles/654707?spm=a2c4e.11155435.0.0.31323a156gAvHw)。

> 实际上，snippet是vscode自有的特性，你会发现每一种snippet插件都有一个snippet文件或者文件夹，这些代码片段都会被vscode读取

平时我们总是用各种xx snippets，随着项目增加、种类繁多，我们的插件也不知不觉开了一堆。同时跑一堆项目、开个移动端调试、开个代理、加上打开一大堆浏览器页面，此时如果电脑开始卡了那就要按需开启插件。而且插件多了，snippet也比较乱了，打几个字母出现的选项很多了，影响效率。最终我选择了简约，各种其他snippet插件都去掉，留下自己要的以及加上自己常用的

按下shift+command+p，选择configure user snippets，配置全局代码片段文件：
```json
{
  	"const": {
		"scope": "javascript,typescript",
		"prefix": "cs",
		"body": [
			"const $1 = $2;"
		]
	}
}
```
当插件启用，我们想输出`const a = 1;`，只需要输入c、s、回车、a、tab、1就可以完成。scope是指什么语言下这段snippet生效，另外提一下，**vscode的概念里面jsx叫javascriptreact，tsx叫typescriptreact**

个人平时喜欢写的那些代码片段，都准备齐全了，让自己的环境简易且纯粹一些。把自己常用的代码片段都收集起来，用一套适合自己的代码片段吧。其实可以直接去.extension里面改插件...

> first of all，写css想打width，但打出了wid的时候第一个提示却是widows，是不是很不爽？所以，修改snippet解决它吧！

### 已知问题深挖
lodash是一个很值得学习的库，建议对着文档的使用方法，手写每一个函数的实现，打好基础，教科书一般。别看表面那些简单的case，以为很简单，写完再去看源码对一下答案，总会有你疏漏的地方。lodash总会给你带来遗漏的js基础知识，还会让你看见一些坑和黑科技。

这里讲一下老生长谈的深拷贝吧。简单的情况下，`JSON.parse(JSON.stringify(target))`可以解决。但是这个方法的缺陷有：
1. JSON.stringify中undefined、函数、以及其他大部分复杂的对象的值为的key会被去掉
2. JSON.parse中遇到undefined会报错
3. 环引用报错
4. 失去继承关系
5. symbol做key被跳过

lodash则考虑很周全，基本所有的原生类都有一套拷贝方法，如果感兴趣可以看看一些其他的类是如何拷贝的。

所以深拷贝说到最后，如果考虑所有的类，并没有绝对意义上的深拷贝。如果从标准的json来说，只有除了function、symbol、undefined的基本数据类型可以拷贝，对象只有普通对象和数组。但是对于前端，业务中可能会拷贝undefined、一些其他的类。对于function，lodash都不拷贝的了，想想也知道，不就是同样的功能吗，为什么要大费周章拷贝而且还是不稳定的？所以lodash里面可以看见一段这样的代码：
```js
if (isFunc || !cloneableTags[tag]) {
    return object ? value : {}
}
```

最后，一种简单的具有普适的深拷贝方案要满足：
- [x] 兼容环引用
- [x] 兼容symbol作为key

```js
function deepCopy(target, cache = new Set()) {
  // 解决环引用
  if (typeof target !== 'object' || cache.has(target)) {
    return target
  }
  if (Array.isArray(target)) {
    return target.map(t => {
      cache.add(t)
      return t
    })
  } else {
    // 考虑symbol key
    return [...Object.keys(target), ...Object.getOwnPropertySymbols(target)].reduce((res, key) => {
      cache.add(target[key])
      res[key] = deepCopy(target[key], cache)
      return res
    }, target.constructor !== Object ? Object.create(target.constructor.prototype) : {}) // 保留继承关系
  }
}
```
深拷贝、数组去重、对象比较这些老生常谈的话题，其实深挖一下，因为涉及到很多数据类型和类，可以挖出很多基础知识，或许里面刚好就找到自己的知识漏洞了

> 把常用的那些方法都看过一次并实现一遍，积累一些经验。这样子，平时开发中一些常用工具函数也大概都了解了，下一次再做同样的事情，就会瞬间完成甚至不用花时间。也可以考虑一下给公司项目造轮子、写公共模块了。

### 高级特性玩起来吧
<b style="color: #f00">前提：确认是内部平台、或者用户使用的浏览器无需考虑兼容性。</b>这将是一个好机会，是时候表演真正的技术了！

> 使用Proxy减少代码

大家都知道它是一个代理，而且做的事情比defineproperty多很多
<details>

<summary>它们的set、get对比</summary>

```javascript
// proxy可以随心所欲命名key
const o = new Proxy({}, {
  get(target, name) {
    return name;
  }
})
// defineproperty只能在知道key的情况下使用。想达到proxy的效果需要函数封装
const _o = Object.defineProperty({}, 'key', {
  get(){
    return 'key'
  }
})
// 封装过的
function _proxy(key){
  return Object.defineProperty({}, key, {
      get(){ return key; }
  })
}
// defineProperty使用上多了一层函数调用：
_proxy('你还是得先知道我是谁').你还是得先知道我是谁;
// proxy 版本
o.你不用先知道我是谁;
```
如果对一个对象属性进行劫持，又想返回本身的该属性的值，proxy可以直接做到：
```javascript
var o = { a: 1 };
var proxy = new Proxy(o, {
  get(target, key) { return target[key] }
})
proxy.a; // 1
```
但是definedproperty就不能靠自己做到，需要借助外部的力量：
```javascript
var o = { a: 1 };
Object.defineProperty(o, 'a', { get(){ return o.a } });
o.a; // 啊，炸了
var temp = 1;
Object.defineProperty(o, 'a', { get(){ return temp } });
o.a; // 1
```

</details>


更多proxy的使用[可见这里](https://juejin.im/post/5beaf118f265da61620cf1df)

> 使用symbol

常见的场景，比如渲染表格需要给每一个item加一些新的字段，作为辅助字段。以antd的table为例，表格通常最后一列都是操作，增删改什么的，我们可以插入一个函数实现:
```js
const ADD = Symbol();
data = data.map(x => ({  ...x, [ADD]: (test, record, index) => { console.log(`update the ${index}`) } }))
<Table dataSource={data} />
```
这只是一种新的实现方法，但是平时比较常见的可能是增加中间辅助字段，到最后发请求的时候可能会把属性过滤掉或者删除掉。而symbol作为key可以直接stringify就发到后台去了。

ps：想做唯一key的话，redux的action type不要用symbol了，因为redux的chrome插件有用了stringify，导致记录下的所有的action都是未知名字。如果不使用redux的chrome插件就随意

更多symbol的使用可见[这里](https://juejin.im/post/5c94477c5188252d735a878a)

> 使用装饰器(需要babel)

实际上就是o = decorator(o)的存在。用angular的人可能感受到它的强大，可以实现依赖注入、面向切面编程。mobx里面也有大量使用了装饰器
```jsx
@safeunmount // 一个改造生命周期和setstate，使得组件被卸载时不会setstate的方法
@inject('user')// mobx把store的user数据传进来，类似connect
@aftermount(fn) // 组件挂载完做某事
@report(id) // 注入上报逻辑
class C extends Component {}
```
直接结果就是，功能都是已经写好的，想做什么就加一行装饰器功能代码。实际上装饰器我们需要按照一套规则来写，不能完全修改一个类的原有属性，只是在上面包一层。
```js
// report上报，使用装饰器和传统方法对比
// 传统方法
import reportReq ...;
class C extends Component {
  componentDidmount(){
    reportReq(id, 'mount')
  }
  componentDidupdate(){
    reportReq(id, 'update')
  }
}


// 装饰器
import report ...;
@report(id)
class C extends Component {}
// 装饰器文件
import reportReq ...;
function report(id) {
  return function(target) {
    const { componentDidmount, componentDidupdate } = target.prototype;
    target.prototype.componentDidmount = function(...a) {
      reportReq(id, 'mount');
      componentDidmount.call(this, ...a);
    };
    target.prototype.componentDidupdate = function(...a) {
      reportReq(id, 'update');
      componentDidupdate.call(this, ...a);
    };
  }
}
```
其他组件需要上报，传统方法只能使用高阶组件。如果还想加入aftermount，那又要再包一个高阶组件。不这样做，那就单独到组件里面写逻辑。你，想写一个单词呢还是想多写若干行代码呢？
# 最后
相信大部分人都是工作占据了大多数时间，所以让这段漫长的时间过得愉快一点，保持热情是一种方法。但是，一般的情况是：事情太多=>做不完=> 进入死循环 => 逃不掉的压力 =>失去热情、度日如年。归根到底，舒适区呆的太长，逆水行舟中不进则退，直到最后力不从心。因此，打破这个循环的方法就是：
- 基本：要有懒惰的思维、尽量逃离舒适区的想法，打好基本功
- 方法：复盘=>寻求更好的方案=>下次使用、提升效率

<b style="color: #f00">保持coding的热情，增加工作效率，并不是为了写更多代码以及加更多的班。目的是让现有工作时间充实起来，避免度日如年，保持一个良好的心态和适当的生活节奏。省下的时间，则可以去做爱做的事情了。生活不能被代码充满了。</b>

> <b style="color: #00f">人的最终目标，总归于星辰大海。</b>to be continue...

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)