# 前言
一开始react团队对外宣布hook 的时候，一眼看上去，觉得肯定proxy或者getter实现的，然后在函数组件外面包一层class extend React.Component。读setState钩子的第一个return结果就返回state，第二个结果就是封装了setState。后来发布了，看了一下代码，原来是维护一个队列（可以说很像数组，也可以说维护一个链表）。

# renderWithHooks的整个过程
在源码里面，renderWithHooks函数是渲染一个组件会调用的，跟hook相关的操作都在这里之后。
比如这段代码：
```javascript
export default () => {
    const [n, setn] = useState(1);
    const [age, setAge] = useState(10);
    const [man, setSex] = useState(true);
    return (
        <div>
            这是n:{n}<button onClick={() => setn(n + 1)}>n++</button>
            年龄：{age}<button onClick={() => setAge(age + 2)}>age+2</button>
            变性：{man ? 'man' : 'gay'}<button onClick={() => setSex(!man)}>change</button>
        </div>
    )
}
```

第一次挂载组件的时候，会给对应的state留下一个dispatch接口，这个接口是操作对应的state的，也就是setn、setAge、setSex，以`return [initState, dispatch]`这种形式返回。后面的更新，每次点击都会让整个组件函数重新执行，3次useState，源码内部的实现是维护一个队列，setter和对应的state是一一对应的：

| 编号 | state | dispatch函数 |
-|-|-
| 1 | _n | setn_function |
| 2 | _age | setAge_function |
| 3 | _sex | setSex_function |

下划线开头表示react hook内部维持的状态， _function表示react hook内部暴露出来的改变该状态的函数，这两个只要**第一次mount之后就会固定**。以后每次更新，也是根据hook从头到尾执行，并根据第几个hook来拿到表里面的第几个state和它的dispatch函数

# 为什么要顺序调用hook
> 官方有句话，必须顺序调用hook。衍生的其他规则：不要在if条件判断中使用hook、必须在函数组件内使用hook、不要在循环中使用hook（其实只要保证循环每次都完全一样还是可以的）

如果我们就是这样不按照套路使用的话，比如代码里面由于某种条件判断，使得我们第二次调用组件函数的时候usestate的顺序不一样，伪代码：
```javascript
// 第一次
    const [n, setn] = useState(1);
    const [age, setAge] = useState(10);
    const [man, setSex] = useState(true);

// 第二次
    const [age, setAge] = useState(10);
    const [n, setn] = useState(1);
    const [man, setSex] = useState(true);
```

第一次：

| 编号 | state | dispatch函数 | hook调用 |
-|-|-|-
| 1 | _n | setn_function | const [n, setn] = useState(1); |
| 2 | _age | setAge_function | const [age, setAge] = useState(10); |
| 3 | _sex | setSex_function | const [man, setSex] = useState(true); |

此时每一个hook的第二个参数都对应自己的set__function。

第二次：

| 编号 | state | dispatch函数 | hook调用 |
-|-|-|-
| 1 | _n | setn_function | const [age, setAge] = useState(10); |
| 2 | _age | setAge_function | const [n, setn] = useState(1); |
| 3 | _sex | setSex_function | const [man, setSex] = useState(true); |

这下问题来了：
```jsx
    return (
        <div>
            {/* setn指的是setAge_function，点了会改变_age。这里的n展示的是_age */}
            这是n:{n}<button onClick={() => setn(n + 1)}>n++</button>
            {/* setAge指的是setn_function，点了会改变_n。这里的age展示的是_n  */}
            年龄：{age}<button onClick={() => setAge(age + 2)}>age+2</button>
            变性：{man ? 'man' : 'gay'}<button onClick={() => setSex(!man)}>change</button>
        </div>
    )
```
点了一次后，n展示了age，age展示了n，但是他们逻辑就正常，该+1就+1，该+2就+2。其实，可以通过代码让这种情况不出现bug，只是，为了让一个不合法操作正常，加上hack代码，同事两行泪啊。

再来一个反例，如果第二次调用组件函数的时候，前面少调用一个hook。第一次还是一样，第二次：

| 编号 | state | dispatch函数 | hook调用 |
-|-|-|-
| 1 | _n | setn_function | const [age, setAge] = useState(10);|
| 2 | _age | setAge_function | const [man, setSex] = useState(true); |

这时候，一眼看上去，setAge实际上就是改变n，setSex改变的是age。但是事实上，后面如果少了hook会**报错**

# 从renderWithHooks开始
来到react-dom源码里面，crtl+f找到renderWithHooks：
```javascript
function renderWithHooks(current, workInProgress, Component, props, refOrContext) {
  currentlyRenderingFiber$1 = workInProgress;
  // 第一次的状态
  firstCurrentHook = nextCurrentHook = current !== null ? current.memoizedState : null;

  // 一些变量初始值：
  // currentHook = null;
  // workInProgressHook = null;

  // didScheduleRenderPhaseUpdate = false; 是否正在update中
  // numberOfReRenders = 0; 重新渲染的时候fiber节点数

  {
  // 第一次HooksDispatcherOnMountInDEV，第二次以后都是HooksDispatcherOnUpdateInDEV
  // firstCurrentHook就在前面被赋值一次，而nextCurrentHook会被赋值为当前存放hook的对象里面
    ReactCurrentDispatcher$1.current = nextCurrentHook === null ? HooksDispatcherOnMountInDEV : HooksDispatcherOnUpdateInDEV;
  }

  var children = Component(props, refOrContext);

  // 重新渲染的时候
  if (didScheduleRenderPhaseUpdate) {
    do {
      didScheduleRenderPhaseUpdate = false;
      numberOfReRenders += 1;

      // 重新渲染就是HooksDispatcherOnUpdateInDEV了
      ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdateInDEV;

      children = Component(props, refOrContext);
    } while (didScheduleRenderPhaseUpdate);
    numberOfReRenders = 0;
  }
  return children;
}
```
可以看见，renderWithHooks对于首次挂载组件走的是HooksDispatcherOnMountInDEV相关的逻辑，以后的更新重新渲染走的是HooksDispatcherOnUpdateInDEV里面的逻辑

# current
ReactCurrentDispatcher$1.current会是HooksDispatcherOnMountInDEV和HooksDispatcherOnUpdateInDEV其中一个，它们都是一个存放所有的hook函数的对象。首先，我们看一下第一次挂载的时候使用的HooksDispatcherOnMountInDEV里面的useState:
```javascript
HooksDispatcherOnMountInDEV = {
    // ....
    useState: function (initialState) {
      // ...已省略了容错代码
      currentHookNameInDev = 'useState';
      return mountState(initialState);
    },
}

// mountState函数
function mountState(initialState) {
  // 获取当前的hook对象
  var hook = mountWorkInProgressHook();
  // 初始化的state以及状态记忆
  hook.memoizedState = hook.baseState = initialState;
  // 以后用的dispatch函数就在hook.queue里面
  var queue = hook.queue = {
    last: null,
    dispatch: null,
    eagerReducer: basicStateReducer,
    eagerState: initialState
  };
  // 暴露出来修改state的dispatch，也是更新状态的核心，具体原理这里不探究
  var dispatch = queue.dispatch = dispatchAction.bind(null,
  currentlyRenderingFiber$1, queue);
  return [hook.memoizedState, dispatch];
}
```

这就是第一步了，把初始状态和dispatch存进去。后面的更新，当前的dispatcher用的是HooksDispatcherOnUpdateInDEV里面的hook：
```javascript
HooksDispatcherOnMountInDEV = {
    // ....
    useState: function (initialState) {
      // ...
      currentHookNameInDev = 'useState';
      return updateState(initialState);
      },
}

function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function updateReducer(reducer, initialArg, init) {
  // 获取当前hook
  var hook = updateWorkInProgressHook();
  var queue = hook.queue;

  // 如果是重新渲染的过程，返回被dispatchAction函数修改过的新state和dispatch函数
  if (numberOfReRenders > 0) {
    var _dispatch = queue.dispatch;
    return [hook.memoizedState, _dispatch];
  }
```

# updateWorkInProgressHook如何进行
一个hook对象是这样的：

![](https://user-gold-cdn.xitu.io/2019/3/4/169494358bcdb611?w=1226&h=554&f=png&s=122946)


每一次hook都是用updateWorkInProgressHook获取的。也是这个函数的实现，让我们看起来react内部是用一个数组维护了hook
```javascript
function updateWorkInProgressHook() {
    // nextCurrentHook是前面的renderWithHooks赋值的
    currentHook = nextCurrentHook;

    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      queue: currentHook.queue,
      baseUpdate: currentHook.baseUpdate,
      next: null
    };

   // 取下一个，就像遍历一样
    if (workInProgressHook === null) {
      // 第一次执行组件函数，最开始没有in progress的hook
      workInProgressHook = firstWorkInProgressHook = newHook;
    } else {
      // 更新的时候
      workInProgressHook = workInProgressHook.next = newHook;
    }
    nextCurrentHook = currentHook.next;
    return workInProgressHook;
}
```

# 手动模拟更新还原过程
我们还是继续在我们的例子上面改。首先，先用最简单的方法实现一个low一点的hook：
```javascript
let state = []; // 存放useState的第一个返回值，状态
let dispatchers = [];  // 存放useState的第二个返回值，dispatch函数
let cursor = 0;  // 遍历用的游标，替代next方便理解

function _useState(initState) {
// 第一次来就是赋值，后面来就是靠游标读取
  const dispatcher = dispatchers[cursor] ||
    (
      dispatchers[cursor] = (_cursor => newVal => { // 你们熟悉的闭包
        state[_cursor] = newVal;
        console.log('修改的新state>>', state);
      })(cursor),
      dispatchers[cursor]
    );

// 第一次来还是赋值，后面来就是靠游标直接读取
  const value = (state[cursor]) || (state[cursor] = initState, state[cursor]);

  cursor++;
  return [value, dispatcher];
}
```
就这么简单，极其简单版本hook。但是我们要模拟react里面的重新渲染更新，需要动一点手脚：
```jsx
根组件就是HookIsHere组件
export default () => {
  return <HookIsHere />;
}
```

脱离了react环境的简易hook，如果用在HookIsHere组件中，需要手动模拟更新过程：
```jsx
function HookIsHere() {
  updateHooks(); // react每次更新，都会跑完全部hook，我们用这个函数模拟
  return (
    <div>
      修改n:<button onClick={() => {
        re_render(); // 表示重新渲染
        const [n, setn] = updateHooks()[0];
        setn(n + 1);
      }}>n++</button>
      修改年龄：<button onClick={() => {
        re_render();
        const [age, setAge] = updateHooks()[1];
        setAge(age + 2);
      }}>age+2</button>
      变性：<button onClick={() => {
        re_render();
        const [man, setSex] = updateHooks()[2];
        setSex(!man);
      }}>change</button>
    </div>
  );
}

// 首次挂载组件
function mountComponent() {
  console.log('模拟首次mount')
  return <HookIsHere />; // 会被render返回的，这里只是模拟并没有什么卵用
}

// 封装一下，能让我们每次更新ui可以重新把函数组件所有的useState运行一次
// 脱离react自身环境实现的简易版本，只能通过这种方法模拟更新
function updateHooks() {
  return [
    _useState(1),
    _useState(10),
    _useState(true)
  ]
}

// 每次重新渲染，游标当然是清零的
function re_render() {
  cursor = 0;
}

console.log(state); // mount前
mountComponent(); // mount了
setTimeout(() => {
  console.log(state); // react有异步渲染的，现在可以看见初始状态
});
```
打开控制台，可以看见我们的自己造的hook跑起来了的console

全部代码：
```jsx
import React from 'react';

let state = [];
let dispatchers = [];
let cursor = 0;

function _useState(initState) {
  const dispatcher = dispatchers[cursor] ||
    (
      dispatchers[cursor] = (_cursor => newVal => {
        state[_cursor] = newVal;
        console.log('修改的新state>>', state, dispatchers);
      })(cursor),
      dispatchers[cursor]
    );
  const value = (state[cursor]) || (state[cursor] = initState, state[cursor]);

  cursor++;
  return [value, dispatcher];
}

function updateHooks() {
  return [
    _useState(1),
    _useState(10),
    _useState(true)
  ]
}

function HookIsHere() {
  updateHooks();
  return (
    <div>
      修改n:<button onClick={() => {
        re_render();
        const [n, setn] = updateHooks()[0];
        setn(n + 1);
      }}>n++</button>
      修改年龄：<button onClick={() => {
        re_render();
        const [age, setAge] = updateHooks()[1];
        setAge(age + 2);
      }}>age+2</button>
      变性：<button onClick={() => {
        re_render();
        const [man, setSex] = updateHooks()[2];
        setSex(!man);
      }}>change</button>
    </div>
  );
}

function re_render() {
  cursor = 0;
}

function mountComponent() {
  console.log('模拟首次mount')
  cursor = 0;
  return <HookIsHere />; 
}

console.log(state);
mountComponent();
setTimeout(() => {
  console.log(state);
});

export default () => {
  return <HookIsHere />;
}
```