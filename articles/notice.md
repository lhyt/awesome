> 对于一种事情，经常重复的话，很容易就会厌烦、觉得无趣、失去了当初的热情。加入了一些前端技术群，发现很多人总是吐槽，大概分几种：做不完的业务需求，日复一日，就觉得工作乏味、都是体力活；c端做多了，就觉得业务逻辑没有挑战性，没意思，设计要求苛刻，特别烦；b端做多了，就觉得天天写平台，天天对着无味的数据，没机会玩一下炫酷的特效；技术建设做多了，又感觉来公司一直没有业务贡献，天天划水，看着自己做的东西都腻了；自己去研究一些花哨的东西，又对工作内容没有什么意义；想用一下最新技术，然而项目历史原因又望洋兴叹......自然而然，就失去了当初的热情，找不到成就感，甚至还怀疑，自己是不是不适合做前端，是不是应该换一份工作？

# 不要用同样的方法重复做同样的事情
如果一直以同样的姿态做一样的事情，就很容易觉得无聊，没有成就感。所以需要提升效率做同样的事情，后面越来越快完成，每天都看见自己的进步，自然就有了热情

## 精简代码，提高代码质量
> 当你要copy的时候，就要想一下哪里可以封装、哪里要抽离逻辑、要复用哪里的代码了

### 不要让一块基本差不多的代码重复存在
大家入门的时候，可能写过这样的代码：
```html
<a>首页</a>
<a>关于我们</a>
<a>合作</a>
<a>加入我们</a>
```
后来发现，vue可以v-for，react可以map，原生可以循环插入fragment里面最后一次性append。

比较明显的大家可以发现，如果不太明显又能复用的我怎么发现呢？还是那句话，当你copy的时候，代码就能复用。举个antd Form常见的一个应用场景：
```jsx
<Form>
  <Item label="名称">
  {getFieldDecorator('name', {
    rules: [{
      required: true,
      message: '请输入名称',
    }],
  })(<Input />)}
  </Item>
  <Item label="描述">
  {getFieldDecorator('desc', {
    rules: [{
      required: true,
      message: '请输入描述',
    }],
  })(<Input />)}
  </Item>
  <Item label="类型">
  {getFieldDecorator('type', {
    rules: [{
      required: true,
      message: '请选择类型',
    }],
  })(<Checkbox />)}
  </Item>
</Form>
```
套路都是一样的，结构也是一样，那我们就维护一个配置对象来维护这个form：
```jsx
const items = [
  {
    label: '名称',
    key: 'name',
    decorator: {
      rules: [{
      required: true,
      message: '请输入名称',
    }],
    },
    component: <Input />
  },
  // ...
]
```

再比如一个很长的if，后台错误码在前端处理，很常见的一段代码：
```js
// before
if (type === 1) {
  console.log('add')
} else if (type === 2) {
  console.log('delete')
} else if (type === 3) {
  console.log('edit')
} else {
  console.log('get')
}

// after
const MAP = {
  1: 'add',
  2: 'delete',
  3: 'edit',
  4: 'get',
}
console.log(MAP[type])
```

> 通过配置对象、循环渲染来减少重复代码

### 要有一种“懒得写代码”的心态
比如redux的action type
```js
const FETCH_LIST = 'FETCH_LIST'
const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
const FETCH_LIST_FAILED = 'FETCH_LIST_FAILED'
const FETCH_USERINFO = 'FETCH_USERINFO'
const FETCH_USERINFO_SUCCESS = 'FETCH_USERINFO_SUCCESS'
const FETCH_USERINFO_ERROR = 'FETCH_USERINFO_ERROR'
```
很整齐又看起来很舒服的代码，但是它们都有共性，异步请求，请求中、请求成功、请求失败的type。每次新增，我们先来这里复制三行，再改改。既然都差不多，我们可以写个type生成器：
```js
function actionGenerator(k = '') {
  const key = k.toUpperCase()
  return {
    ...(k
      ? {
        [`FETCH_${key}`]: `FETCH_${key}`,
        [`FETCH_${key}_SUCCESS`]: `FETCH_${key}_SUCCESS`,
        [`FETCH_${key}_ERROR`]: `FETCH_${key}_ERROR`,
      }
      : {}),
  };
}
// 从此以后，action_type代码行数大大减少
```

再比如一个函数里面对一个对象反复赋值操作：
```js
// before
obj.a = 1
obj.b = 2
obj.c = 5
// after
const newVals = {
  a: 1,
  b: 2,
  c: 5
}
// 如果业务里面的obj很依赖原本引用，不能改变原对象
Object.keys(newVals).forEach(key => {
  obj[key] = newVals[key]
})
// 如果业务里面的obj不依赖原本引用，可以改变原对象
obj = { ...obj, ...newVals}
// 以后要改什么，我只要去改一行newVals就可以
```

再比如页面文案，我们可以单独拎出去到一个文件里面统一配置，以后修改很方便
```jsx
<header>练习不足两年半的练习生</header>
<section>我只是一个练习生</section>
<ul>
  <li>唱</li>
  <li>跳</li>
  <li>rap</li>
</ul>
<footer>联系方式：000</footer>
```

```jsx
const CONSTANT = {
  title: '练习不足两年半的练习生',
  desc: '我只是一个练习生',
  hobbies: ['唱', '跳', 'rap'],
  tel: '000'
}

<header>{CONSTANT.title}</header>
<section>{CONSTANT.desc}</section>
<ul>
  {
    CONSTANT.hobbies.map((hobby, i) => <li key={i}>{hobby}</li>)
  }
</ul>
<footer>联系方式：{CONSTANT.tel}</footer>
```
这是一个看起来好像写了更多代码，变复杂了。一般情况下，是不需要这样的。对于运营需求，这种方案应付随时可以变、说改就要改的文案是轻轻松松，而且还不需要关心页面结构、不用去html里面找文案在哪里。而且这个对象还可以复用，就不会有那种“改个文案改了几十个页面”的情况出现。

还有一个场景，我们平时可能写过很多这样的代码：
```js
function sayHi(name, word) {
  console.log(`${name}: ${word}`)
}
const aSayHi = () => sayHi('a', 'hi')
const aSayGoodbye = () => sayHi('a', 'goodbye')
const aSayFuck = () => sayHi('a', 'fuck')
```
当然这是很简单的场景，如果sayHi函数传入的参数有很多个，而且也有很多个是重复的话，代码就存在冗余。这时候，需要用偏函数优化一下：
```js
const aSay = (name) => sayHi('a', name)
const aSayHi = () => aSay('hi')
const aSayGoodbye = () => aSay('goodbye')
const aSayFuck = () => aSay('fuck')
```


最后一个例子，比如一个重复的key赋值过程，可以用变量key简化
```js
switch(key) {
  case 'a':
  return { a: newVal }
  case 'b':
  return { b: newVal }
  case 'c':
  return { c: newVal }
}
// after
return { [key]: newVal }
```

> 通过循环、配置对象来减少代码与增强维护性。想想怎么简化代码，抽离公共逻辑封装，总比copy过来改改有意思多了

### 三元、短路用起来
不多说，看几个例子
```js
// before
if (type === true) {
  value = 1
} else {
  value = 2
}
//after
value = type ? 1 : 2

// before
if (type === DEL) {
  this.delateData(id)
} else {
  this.addData(id)
}
// after
this[type === DEL ? 'delateData' : 'addData'](id)
// or
;(type === DEL ? this.delateData : this.addData)(id)

// before
if (!arr) {
  arr = []
}
arr.push(item)
// after 这个属于eslint不建议的一种
;(arr || (arr = [])).push(item)

// before
if (a) {
  return C
}
// after
return a && C
```

> 小结：代码简短，没有重复，自己看了也不会腻；抽离逻辑，封装公共函数，无形提高代码质量，提升开发体验与成就感

## 如何让运营需求不枯燥无味
大部分公司都是以业务需求为主，除了自己家的主打产品迭代需求外，另外的通常是运营需求作为辅助。运营类需求，通常具有短时效性、频率高、有deadline的特点。

一个运营活动，可能有多种模式、多种展示布局、多种逻辑，产品运营会随机组合，根据数据来调整寻求最佳方案，这就是场景的运营打法——ab test。有的人面对这种情况，总是会感叹：又改需求了、天天改又没什么用、怎么又改回来了、你开心就好。其实这种情况，我们只要给自己规划好未来的路，后面真的随意改，甚至基本不需要开发

我们从一个简单的用户信息页面的例子入手：
```jsx
render() {
  const { name, score } = this.state.info
  return (
    <main>
      <header>{name}</header>
      分数：<section>{score}</section>
    </main>
  )
}
```

### 增加适配层
我们不要动核心逻辑代码，不要说"只是加个if而已"。引入新的代码，可能会引入其他bug（常见错觉之一： 我加一两行，一定不会造成bug），有一定的风险。如果突然要说这个活动要拉取另一次游戏的分数，直接去把请求改了，然后再把组件所有的字段改了，当然是一个方法。如果改完不久，又要说改回去，那是不是吐血了。显然我们需要一个适配层：
```js
function adapter(response, info) {
  return Object.keys(newConf).reduce((res, key) => {
    res[key] = response[newConf[key]]
    return res
  }, {})
}
// before
function fetchA() {
  return request('/a')
}
fetchA.then(res => {
  this.setState({
    info: { name: res.nickname, score: res.counts }
  })
})

// after 直接修改原请求函数
function fetchA() {
  return request('/a').then(res => {
    // 把适配后的结果返回，对外使用的时候不变
    return adapter(res, {
      name: 'nickname',
      score: 'counts'
    })
  })
}
```
每次要改，只要改适配层、改请求接口即可。当然，后台如果全部统一的话是最好，只是有历史原因不是说改就改的。

> 拓展： 如果改来改去的接口很多呢？
此时，我们需要维护一个配置表，保存某个请求与适配对象，而不是直接去把之前的代码改掉
```js
const cgiMAp = {
  '/a': {
    name: 'nickname',
    score: 'counts'
  },
  // ...
}
```
通过读取这个配置，在请求函数里面封装一个读取逻辑，即可适配所有的相关接口。后面如果换了一种数据来源渠道，那也光速解决需求

```js
function reqGenerator(cfg) {
  return Object.keys(cfg).reduce((res, key) => {
    res[key.slice(1)] = () => request(key).then(r => adapter(r, cfg[key]))
    return res
  }, {})
}
const reqs = reqGenerator(cgiMAp)
reqs.a()
```

### 依赖注入
<details>
  <summary>点击展开</summary>
  <section>
  对于依赖注入的概念，举个例子。比如要造一辆汽车，a擅长制造负责车头车尾车轮，b擅长组装负责车身和其他部分连接，模块化分工，没毛病。突然有一天要做个会飞的车，而会飞要先有一个翅膀、或者螺旋桨，而且要装到车身处。此时让负责车身的b来做，无疑是很困难，a才是更适合人选。所以，a就友情帮忙b解决问题。后来，老板说要做一个会说话的车，还要有嘴巴，嘴巴要装到车头一个很合适的位置。此时，a压力又大了，b也友情帮忙设计嘴巴合适的位置。如此重复，随着需求增加，他们两个说好的模块化分工已经乱成一团。

如果一开始他们的定位就换一种，a负责组装，b负责制造。无论a造了个<ruby>什么东西<rp>(</rp><rt>依赖</rt><rp>)</rp></ruby>，<ruby>随意丢给b<rp>(</rp><rt>注入</rt><rp>)</rp></ruby>就好了，让b组装，后来他们就愉快合作，也无惧任何需求了。这就是依赖注入带来的显著效果。我们平时可以在一些地方看见它的影子：amd模块化方案、react用props展示组件、angular1、react hook等
  </section>
</details>


> 对于前面的那个用户信息页面的例子，如果用户信息页面需要填更多的内容呢，如果不想展示分数呢？

这种情况，先要和产品侧确认，哪些内容是以后必须在的，哪些是会变的。会多变的部分，我们直接使用content读进来：
```jsx
class App extends Component {
  // ...
  render() {
    const { name, score } = this.state.info
    return (
      <main>
        <header>{name}</header>
        <section>{this.props.children}</section>
        分数：<section>{score}</section>
      </main>
    )
  }
}
```
这样子，组件上层只要包住个性化组件内容就ok
```jsx
<App>
  <section>我只是一个练习生</section>
  <ul>
    <li>唱</li>
    <li>跳</li>
    <li>rap</li>
  </ul>
</App>
```
当然，<ruby>事情肯定不会这么简单<rt>人都是善变的</rt></ruby>，现在和你说标题永远不变，转身就变给你看：如果用户没参加过，那就展示另一个灰色提示、如果用户分数很高，给他标题加一个角标、如果充钱，标题换个皮肤

我们还是保持尽量少改核心逻辑原则，先把header改成大写开头，抽出一个组件：
```jsx
const [IS_NO_JOIN, IS_PAY, IS_SCORE_HIGH] = [1, 2, 3]
const MAP = {
  [IS_NO_JOIN]: 'no-join',
  [IS_PAY]: 'has-pay',
  [IS_SCORE_HIGH]: 'high-score',
}
function Header(props) {
  const [type, setType] = useState('normal')
  useEffect(() => {
    // 用名字获取用户身份
    requestTypeByName(props.children).then(res => {
      setType(res.type)
    })
  }, [])
  return (
    <header
      className={classnames(MAP[type])}
    >
      {props.children}
    </header>
  )
}
```

核心逻辑还是不动，渲染的结构和顺序也不动。更多定制化的功能，我们从上层控制，控制渲染逻辑、展示组件、显示的文案等等，上层拼装好，就传入核心组件。这个过程就比如a同事之前写了核心渲染逻辑，b同事不负责这块，但b是这次需求的开发者，所以应该把渲染的姿势调整好、适配，注入到a同事写的核心逻辑组件中去。这就是控制反转的一种实现——依赖注入，利用依赖注入的模式把控制权交给了b，让b来改，这样子也是侵入性小、风险小、扩展性强的一种方案。

> "成功甩了个锅，和b交代完逻辑后笑嘻嘻地下班了"——这是最优雅的方案，大家都理解的

反着来看，如果让a来改（假设核心模块是巨复杂而且无法快速入手的只能由a才能hold住的）：
```jsx
// 加样式
// 加处理state逻辑、加业务逻辑
// 改字段来适配
  render() {
    const { name, score } = this.state.info
    return (
      <main>
        <header className="xxx">{name}</header>
        <section>{this.props.children}</section>
        分数：<section>{score}</section>
      </main>
    )
  }
// after coding： mmp，b的需求为什么要我出来帮忙，还要我从头开始看需求并了解需求
```
> 改完了，上线了，突然后面运营那边又说，要不就xxx....此时求a心里阴影面积

### 运营配置接口
前面的例子，我们都是做很小改动就完成了。当然每一次改个数字改个词，前端就要发布，这也不是优雅的解决方案。所以最终解决方案应该是，把这部分配置抽离出来，做到一个运营配置平台上，前端通过接口读取该平台的配置回来渲染页面。运营需要更改，我们只需要去平台上把配置修改即可。

```js
// 让配置写在一个可视化配置平台上
// const cgiMAp = {
//   '/a': {
//     name: 'nickname',
//     score: 'counts'
//   },
//   // ...
// }
function reqGenerator(cfg) {
  return Object.keys(cfg).reduce((res, key) => {
    res[key.slice(1)] = () => request(key).then(r => adapter(r, cfg[key]))
    return res
  }, {})
}
request('/config').then(res => {
  const reqs = reqGenerator(res.cgiMAp)
  reqs.a()
})

```
> 但是也要考虑一下缓存、容灾，提高一下页面的可用性、可访问性。如果接口挂了，如何提升用户体验

# 不要留在舒适区
> 上一次这种case是按时完成，这次一定要提前；上次用的是常规方法，这次要争取优化一下；之前试了几次是差不多的套路，这次看看能不能封装一个公共的工具

## 同样都是搬砖，但要优雅地搬砖
人家还在用手用肩膀搬砖，我们就开直升机来搬砖、用一个自动化机器搬砖、甚至召唤灭霸让一半砖消失然后出现到终点。对比之下，我们的搬砖很好玩，甚至还有点上瘾。写前端也是一样，优雅地超出预期完成需求和普普通通只求达到目的，差别很大，而且对人的热情影响也很大。相当于两个人，一个最多只能考100分，另一个是一定能考100分而且还有机会提前交卷、不虚任何难度。他们的热情、成就感、兴趣完全不是一个数量级的。

我们也是再从几个例子出发
### 简化git常用4步曲
每一次提交，大家都会用的4步：
```bash
$ git pull
$ git add .
$ git commit -m "feat: 😊今天又一个新特性"
$ git push
```
- 😢：“天天搬砖，天天输这重复的代码，闭着眼、用脚都可以打出来了，真烦。不想干了，我想静静，别问我静静是谁”
- 👧：“你的成就感呢？这就没意思了？同是一个办公室，为什么我没有感觉到没意思啊，反而越来越有趣”
- 😢：“怎么做到的，究竟是什么，男人见了沉默，女人见了流泪”
- 👧：“近来研究了npm script，发现可以把这套整合起来一个命令解决”

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

但是，事情总是<ruby>不尽完美<rt>不合预期</rt></ruby>的，一个snippet不是适合所有人的，所以就有了各种各样的插件。程序员的心态：用得不爽，马上造一个去。这里不详细展开如何写插件，[详见地址]()。

> 主要推荐一个很好用却没有多少下载量的插件： snippets

就叫snippets，没有任何前缀。平时我们总是用各种xx snippets，随着项目增加、种类繁多，我们的插件也不知不觉开了一堆。同时跑一堆项目、开个移动端调试、开个代理、加上打开一大堆浏览器页面，此时如果电脑开始卡了那就要按需开启插件。而且插件多了，snippet也比较乱了，打几个字母出现的选项很多了，影响效率。最终我选择了简约的snippets，其他各种插件都去掉，因为snippets可以自定义自己的代码片段

按下shift+command+p，选择configure user snippets，配置全局代码片段文件：
```json
{
  	"const": {
		"prefix": "cs",
		"body": [
			"const $1 = $2;"
		]
	}
}
```
当插件启用，我们想输出`const a = 1;`，只需要输入c、s、回车、a、tab、1就可以完成。

个人平时喜欢写Object.keys().forEach()、reduce、三元、async-await，都准备了一套了，并关掉其他snippet插件（主要是写复杂核心逻辑的时候）。把自己常用的代码片段都收集起来，用一套适合自己的代码片段吧。

### 发散思维，举一反三


# 想办法搞点事情
> “天天都搞这个，天天都是同一个姿势，都腻了，能不能换一下？”