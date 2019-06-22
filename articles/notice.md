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
  })(
    <WrapInput realval={props.dataSource.name} />,
  )}
  </Item>
  <Item label="描述">
  {getFieldDecorator('desc', {
    rules: [{
      required: true,
      message: '请输入描述',
    }],
  })(
    <WrapInput realval={props.dataSource.desc} />,
  )}
  </Item>
  <Item label="类型">
  {getFieldDecorator('type', {
    rules: [{
      required: true,
      message: '请选择类型',
    }],
  })(
    <WrapCheckbox realval={props.dataSource.type} />,
  )}
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
    component: <WrapInput realval={props.dataSource.desc} />
  },
  // ...
]
```

再比如一个很长的if，后台错误码前端处理很常见的一段代码：
```js
if (type === 1) {
  console.log('add')
} else if (type === 2) {
  console.log('delete')
} else if (type === 3) {
  console.log('edit')
} else {
  console.log('get')
}
```
改进：
```js
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
// 如果obj很依赖原本引用，不能改变原对象
Object.keys(newVals).forEach(key => {
  obj[key] = newVals[key]
})
// 如果obj不依赖原本引用，可以改变原对象
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
这是一个看起来好像写了更多代码，变复杂了。一般情况下，是不需要这样的。对于运营需求，这种方案应付随时可以变、说改就要改的文案是轻轻松松，而且还不需要关心页面结构、不用去html里面找文案在哪里。而且这个对象还可以复用，就不会有那种“改个文案改了几十个页面”的情况出现

比如一个重复的key赋值过程
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

> 通过循环、配置对象来减少代码与增强维护性

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

> 代码简短，没有重复，自己看了也不会腻

## 如何让运营需求不枯燥无味
大部分公司都是以业务需求为主，除了自己家的主打产品迭代需求外，另外的通常是运营需求或者管理平台类需求作为辅助。运营类需求，通常具有短时效性、频率高、有deadline的特点。管理平台类的需求，通常是一个ui库一把刷，主要是数据和业务逻辑比较复杂，整个平台开发体验取决于架构。

### 简单的运营需求
这种需求，通常是做了很多期，发现基本都是差不多的套路，基本差不多的页面布局。代表例子：一些网游的xxx节活动，套路都很像：充值、新的兑换币、抽奖或者打折或者兑换（此时是某个绝版装备或者某个贵重装备打折）

前期（指产品刚刚开始搞运营需求或者新入职的人首次做运营需求）的时候，积累公共逻辑、常用套路。我相信前期刚刚做运营需求的时候，大家都会有新鲜感。而且是比较简单的页面居多，加上大家有一点热情，不考虑其他直接干，需求很快会被解决，甚至提前。加上随着在公司呆的时间长，越来越多的需求会安排到自己手上，很快就感觉做不完的需求，加不完的班，没有机会学习。如果每一次都是这样子，很快就失去了热情、失去成就感、感觉没意思。

一个产品的运营需求，业务逻辑大部分都是一样，产品定位就是那样，所以打法也是来来回回那几个套路（人的脑洞也有限的，不会每次都是全新的套路，有这么牛逼的人当然也不会来公司打工了）。对于这种需求，我们在代码里面应该对这种公用逻辑单独抽离出来作为公共模块。可能是组件、公共工具函数

视觉可能很多时候避免不了，也逃不了

# 不要留在舒适区
> 上一次这种case是按时完成，这次一定要提前
## 如何应付运营ab test打法
一个活动，可能有多种模式、多种展示布局、多种逻辑，产品运营会随机组合，根据数据来调整寻求最佳方案，这就是ab test。有的人面对这种情况，总是会感叹：又改需求了、天天改又没什么用、怎么又改回来了、你开心就好。其实这种情况，我们只要给自己规划好未来的路，后面真的随意改，甚至基本不需要开发

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
    return adapter(res, {
      name: 'nickname',
      score: 'counts'
    })
  })
}
```
每次要改，只要改适配层、改请求接口即可。当然，后台如果全部统一的话是最好，只是有历史原因不是说改就改的。

> 拓展： 如果改来改去的接口很多呢？
此时，我们需要维护一个配置表，保存某个请求与适配对象
```js
const cgiMAp = {
  '/a': {
    name: 'nickname',
    score: 'counts'
  },
  // ...
}
```
后面如果换了一种数据来源渠道，那也光速解决需求

### 依赖注入
> 如果用户信息页面需要填更多的内容呢，如果不想展示分数呢？
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
当然，事情肯定不会这么简单，现在和你说标题永远不变，转身就变给你看：如果用户没参加过，那就展示另一个灰色提示、如果用户分数很高，给他标题加一个角标、如果充钱，标题换个皮肤

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

### 运营配置接口

# 想办法搞点事情