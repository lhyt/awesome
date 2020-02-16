# 前言
react hook是继16.6的Suspense、lazy、memo后的又一巨大的令人兴奋的特性。然后有各种文章说了hook的优缺点，其中缺点包括：没有直接替代getSnapshotBeforeUpdate、componentDidUpdate生命周期的hook、不能像class组件那样写this、函数太大。这只是表面的现象，只要稍微思考一下，hook其实是无所不能的，我甚至相信未来挑不出hook的毛病来。今天手把手带大家过一遍如何实现class组件特性。

基本用法可见官网，阅读本文需要先了解`useState`、`useEffect`、`useRef`、`useLayoutEffect`的使用方法。本文核心hook——`useRef`，本文也算是一篇`useRef`的应用文章。当你知道核心是基于`useRef`的时候，或许已经想到实现办法了，很好，我们心有灵犀 「握个手」

# useRef
`useRef`传入一个参数initValue，并创建一个对象`{ current: initValue }`给函数组件使用，在整个生命周期中该对象保持不变。所以，听到它名字叫做`useRef`的时候，很自然就想到它就是用来做元素的ref的：
```jsx
const divRef = useRef();
return  <div ref={divRef}>;
```
最基本的使用方法，接着想进行dom操作，那就这样玩：
```javascript
if (divRef.current) {
  divRef.current.addEventListener(...);
}
```
函数组件的执行，整个函数体所有的必然躲不掉重新执行，那么如果希望有一个不重新走一遍的变量，我们通常会把它放函数组件外面去：
```jsx
let isMount = false;
function C(){
  useEffect(() => { isMount= true; return () => { isMount= false; } }, []);
  return <div />
} 
```
这就是一个判断组件有没有挂载到页面的实现方法，如果我们用`useRef`，显然优雅很多了，而且是不是有点this的感觉
```jsx
function C(){
  const mount = useRef({}).current;
  useEffect(() => { mount.isMount= true; return () => { mount.isMount= false; } }, []);
  return <div />
} 
```

ok，现在假的this要原形毕露了:
```jsx
export default () => {
  const _this = useRef({
    state: { a: 1, b: 0 },
  }).current;
	return (
		<div>
                    a: {_this.state.a} / b : {_this.state.b}
		</div>
	)
}
```

# state更新相关的逻辑实现
`useState`就相当于hook版本的`setState`，`const [state, setState] = useState(initState);`，state利用了函数组件重新执行，从闭包读取函数记忆的结果。调用hook的`setState`，则会更新state的值然后重新执行一遍整个函数组件。此处再次感叹一下，hook真的没什么黑魔法，少一点套路多一点真诚。

比如有一个这样子的组件：
```jsx
function T(){
  const [count, setCount] = useState(0);
  return <span onClick={() => setCount(count + 1)}>{count}</span>
}
```
第一次执行函数组件，最后渲染就相当于：
```jsx
function T(){
  const count = 0
  return <span>{count}</span>
}
```
点击一下，count+1，也就是相当于执行了一个这样子的函数组件:
```jsx
function T(){
  const count = 1
  return <span>{count}</span>
}
```

所以，真没有什么黑魔法，就是读前一个值然后+1展示而已。好了，回到正题，函数组件的更新就是`useState`，那强制更新呢？如何实现一个`forceUpdate`？其实也很简单，dispatcher（`useState`返回值第二个元素）传入一个函数，类似于class组件的`setState`传入一个函数一样，可以拿到当前的state值：
```jsx
const useForceUpdate = () => {
  const forceUpdate = useState(0)[1];
  return () => forceUpdate(x => x + 1);
}

export default () => {
  const forceUpdate = useForceUpdate(); // 先定义好，后面想用就用
  // ...
	return (
		<div />
	)
}
```

我们已经知道了如何模拟this和state初始化了，那我们可以实现一个类似class组件的setState了：给ref里面的属性赋值，再forceUpdate。

> 本文只是希望全部收拢在useRef，然后修改状态的方法纯粹一点，当然可以用useState对着一个个state值进行修改

```jsx
export default () => {
  const forceUpdate = useForceUpdate();
  const _this = useRef({
    state: { a: 1, b: 0 },
    setState(f) {
      console.log(this.state)
      this.state = {
        ...this.state,
        ...(typeof f === 'function' ? f(this.state) : f) // 两种方法都考虑一下
      };
      forceUpdate();
    },
    forceUpdate,
  }).current;
  return (
    <div>
      a: {_this.state.a} / b : {_this.state.b}
      <button onClick={() => { _this.setState({ a: _this.state.a + 1 }) }}>a传state</button>
      <button onClick={() => { _this.setState(({ b }) => ({ b: b + 2 })) }}>b传函数</button>
    </div>
  );
}
```

到此，我们已经实现了class组件的`this`，`setState`，`forceUpdate`了

# didmount、didupdate、willunmount的实现
其实我[上一篇文章](https://juejin.im/post/5cd839adf265da03587c1bf7)已经实现过，这里再糅合到ref里面重新实现一遍。还是一样的方法，基于两个`useEffect`实现三个生命周期：
```jsx
export default () => {
  const forceUpdate = useForceUpdate();
  const isMounted = useRef(); // 挂载标记
  const _this = useRef({
    state: { a: 1, b: 0 },
    setState(f) {
      console.log(this.state)
      this.state = {
        ...this.state,
        ...(typeof f === 'function' ? f(this.state) : f) // 两种方法都考虑一下
      };
      forceUpdate();
    },
    forceUpdate,
    componentDidMount() {
      console.log('didmount')
    },
    componentDidUpdate() {
      console.warn('didupdate');
    },
    componentWillUnMount() {
      console.log('unmount')
    },
  }).current;
  useEffect(() => {
    _this.componentDidMount();
    return _this.componentWillUnMount;
  }, [_this]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      _this.componentDidUpdate();
    }
  })
  return (
    <div>
      a: {_this.state.a} / b : {_this.state.b}
      <button onClick={() => { _this.setState({ a: _this.state.a + 1 }) }}>a传state</button>
      <button onClick={() => { _this.setState(({ b }) => ({ b: b + 2 })) }}>b传函数</button>
    </div>
  )
}
```

# 记录上一次状态
有人可能也注意到了，上面的componentDidUpdate是没有传入上一次props和state的。是的，getDerivedStateFromProps也要上一个state的。所以我们还需要一个ref存上一个状态：
```jsx
export default (props) => {
  const forceUpdate = useForceUpdate();
  const isMounted = useRef();
  const magic = useRef({ prevProps: props, prevState: {}, snapshot: null }).current;
  magic.currentProps = props; // 先把当前父组件传入的props记录一下
  const _this = useRef({
    state: { a: 1, b: 0 },
    setState(f) {
      console.log(this.state)
      this.state = {
        ...this.state,
        ...(typeof f === 'function' ? f(this.state) : f)
      };
      forceUpdate();
    },
    componentDidMount() {
      console.log('didmount')
    },
    getDerivedStateFromProps(newProps, currentState) {
        // 先放这里，反正等下要实现的
    },
    componentDidUpdate(prevProps, prevState, snapshot) {
      console.warn('didupdate');
      console.table([
        { k: '上一个props', v: JSON.stringify(prevProps) },
        { k: 'this.props', v: JSON.stringify(magic.currentProps) },
        { k: '上一个state', v: JSON.stringify(prevState) },
        { k: 'this.state', v: JSON.stringify(_this.state) },
      ])
    },
    componentWillUnMount() {
      console.log('unmount')
    }
  }).current;

  useEffect(() => {
    _this.componentDidMount();
    // 后面都是赋值操作，防止同一个引用对象，实际上应该深拷贝的。这里为了方便，但至少要浅拷
    magic.prevProps = { ...props };  // 记录当前的，作为上一个props给下一次用
    magic.prevState = { ..._this.state }; // 同理
    return _this.componentWillUnMount;
  }, [_this, magic]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
    //  这里就拿到了上一个props、state了，snapshot也先留个空位给他吧
      _this.componentDidUpdate(magic.prevProps, magic.prevState, magic.snapshot || null);
    // 拿完就继续重复操作，给下一次用
      magic.prevProps = { ...props };
      magic.prevState = { ..._this.state };
    }
  })
    return (
      <div>
        props: {props.p}/
        a: {_this.state.a} / b : {_this.state.b}
        <button onClick={() => { _this.setState({ a: _this.state.a + 1 }) }}>a传state</button>
        <button onClick={() => { _this.setState(({ b }) => ({ b: b + 2 })) }}>b传函数</button>
      </div>
    );
}
```
这下，可以去控制台做一些操作state和改变props的操作了，并看下打印的结果

# getDerivedStateFromProps
这个函数的原意就是希望props可以作为初始化state或者在渲染之前修改state，那么根据它的意图，很容易就可以实现这个生命周期，我这里`getDerivedStateFromProps`还可以用假this哦。其实这个生命周期应该是最容易实现和想出来的了：
```jsx
// 基于前面的组件直接加上这段代码
  const newState = _this.getDerivedStateFromProps(props, magic.prevState);
  if (newState) {
    _this.state = { ..._this.state, ...newState }; // 这里不要再更新组件了，直接改state就收了
  }
```

# getSnapshotBeforeUpdate
到了一个hook不能直接替代的生命周期了。这里再看一下useLayoutEffect和useEffect执行的时机对比：

![](https://user-gold-cdn.xitu.io/2019/5/28/16afa5f8df2427d8?w=2026&h=530&f=png&s=1104785)

> 注意到，下一个useLayoutEffect执行之前，先执行上一个useLayoutEffect的clean up函数，而且都是同步，可以做到近似模拟willupdate或者getSnapshotBeforeUpdate了

```jsx
// 再增加一段代码
  useLayoutEffect(() => {
    return () => {
      // 上一个props、state也传进来，然后magic.snapshot 前面已经传入了componentDidUpdate
      magic.snapshot = _this.getSnapshotBeforeUpdate(magic.prevProps, magic.prevState);
    }
  })
```

# componentDidCatch
另一个不能用hook直接替代的生命周期，说到错误，这个生命周期也是捕捉函数render执行的时候的错误。那些编译不过的，非函数渲染时候报的错，它无法捕获的哦。基于这个前提，我们还是基于try-catch大法实现一波：
```jsx
// 对最后的return 修改，这里还可以个性化一下fallback ui呢
  try {
    return (
      <div>
        props: {props.p}/
        a: {_this.state.a} / b : {_this.state.b}
        <button onClick={() => { _this.setState({ a: _this.state.a + 1 }) }}>a传state</button>
        <button onClick={() => { _this.setState(({ b }) => ({ b: b + 2 })) }}>b传函数</button>
      </div>
    )
  } catch (e) {
    _this.componentDidCatch(e)
    return <div>some err accured</div>;
  }
```

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)