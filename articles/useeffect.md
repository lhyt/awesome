> 据说，这个hook可以模拟class组件的三个生命周期

# 前言
 官网已经介绍过，这里再啰嗦一次。`useEffect`是一个用来执行副作用hook，第一个参数传入一个函数，每一次render之后执行副作用和清除上一次副作用，该函数的返回值就是清除函数。第二个参数是一个数组，传入内部的执行副作用函数需要的依赖，当这几个依赖有一个要更新，effect里面也会重新生成一个新的副作用并执行副作用。如果没有更新，则不会执行。如果第二个参数不传，那么就是没有说明自己有没有依赖，那就是每次render该函数组件都执行。

很明显，`useEffect`第一个参数可以模仿`didmount`、`didupdate`，它的返回值可以模仿`willunmount`

# class组件生命周期模拟
> "模仿生命周期，useEffect第二个参数传个空数组，无依赖，只执行一次，相当于didmount。如果要区分生命周期，不传第二个参数，每次都会跑，相当于didupdate。加个mount标记一下，里面用if判断一下，即可以达到模拟生命周期的效果"

很多人都会想到这个办法模拟，于是我们试一下看看：
```jsx
let mount;
function useForceUpdate() {
  const [_, forceUpdate] = useState(0);
  return () => forceUpdate(x => x + 1);
}

function UnmountTest() {
  useEffect(() => {
    if (!mount) {
      mount = true;
      console.log('did mount')
    } else {
      console.log('did update')
    }
    return () => {
      mount = false;
      console.log('unmount') 
    }
  })
  const forceUpdate = useForceUpdate();
  return (<div>
    我是随时被抛弃的
    <button onClick={forceUpdate}>强制更新</button>
  </div>);
}

function State() {
  const [count, setCount] = useState(20);

  const handleCount = useCallback(() => {
    setCount(count => count + 1)
  }, [])
  return (
    <div>
      {count}
      <button onClick={handleCount}>count+1</button>
      {(count % 2) && <UnmountTest />}
    </div>
  )
}
```
当count是奇数，那就展示`UnmountTest`，组件里面也有一个更新组件的方法。按照逻辑，`useEffect`不传第二个参数，保证每次渲染都执行。然后加一个标记，标记第一次是挂载。于是运行一波看看

- 点一下count+1，展示组件，打印didmount
- 再点一下count，删掉组件，打印unmount

符合预期，😊

- 点一下count+1，展示组件，打印didmount
- 点一下强制更新，打印unmount、didmount，再点，还是一样

🤔️，什么鬼，居然不符合预期

> useEffect是用来执行副作用，每一次render，将会清除上一次副作用、执行本次副作用（如果有依赖或者不传入依赖数组）这个hook是以一个副作用为单位，当然也可以多次使用

这样子说，每一次都是unmount、didmount，的确是符合这个逻辑，和"想当然"的那种模拟生命周期是有点不一样的。这样子，我们拆成两个useEffect调用，就可以解决问题：
```jsx
function UnmountTest() {
  useEffect(() => {
      if (mount) {
          console.log('did update')
      }
  });
  useEffect(() => {
      if (!mount) {
          console.log('did mount')
          mount = true;
      }
      return () => {
          console.log('unmount')
          mount = false;
      }
  }, []);
  const forceUpdate = useForceUpdate();
  return (<div>
    我是随时被抛弃的
    <button onClick={forceUpdate}>强制更新</button>
  </div>);
}
```

这次，全都符合预期了，简直ojbk😊

# useEffect & useLayoutEffect区别
> useEffect是异步的，useLayoutEffect是同步的

我们看一下，一次组件从挂载到重新渲染，两者的发生的时机:

![](https://user-gold-cdn.xitu.io/2019/5/12/16aaca141c8b7546?w=1952&h=468&f=png&s=969064)

从左到右表示时间线，红色的是异步的，红色框内是同步的，从上到下执行。`useEffect`是异步的，所谓的异步就是利用`requestIdleCallback`，在浏览器空闲时间执行传入的callback。大部分情况下，用哪一个都是一样的，如果副作用执行比较长，比如大量计算，如果是`useLayoutEffect`就会造成渲染阻塞。这只是一个case，我们可以看一下这个神奇的定时器：


点击开始，开始计时，点击暂停就暂停。点击清0，暂停并且数字清零
```jsx
function LYE() {
  const [lapse, setLapse] = React.useState(0)
  const [running, setRunning] = React.useState(false)

  useEffect(
    () => {
      if (running) {
        const startTime = Date.now() - lapse
        const intervalId = setInterval(() => {
          setLapse(Date.now() - startTime)
        }, 2)
        console.log(intervalId)
        return () => clearInterval(intervalId)
      }
    },
    [running],
  )

  function handleRunClick() {
    setRunning(r => !r)
  }

  function handleClearClick() {
    setRunning(false)
    setLapse(0)
  }

  return (
    <div>
      <label>{lapse}ms</label>
      <button onClick={handleRunClick}>
        {running ? '暂停' : '开始'}
      </button>
      <button onClick={handleClearClick}>
        暂停并清0
      </button>
    </div>
  )
}
```

于是，点击清零居然不清0，只是停下来了，而且点开始也是继续开始。这里只要把它改成`useLayoutEffect`就可以了，点清0马上变成0并停止。另外，在使用`useEffect`下，把interval的时间改成大于16，有概率成功清0，如果更大一点是绝对清零。都说`useEffect`是异步，那么问题很有可能出现在异步这里。

`useLayoutEffect`是同步的，所以整个流程完全符合我们的预期，一切在掌控之中。基于两点： `useEffect`里面的interval延迟太小并没有清除计时结果、`useEffect`把interval延迟调到大于16后有概率解决。我们从这两点出发，梳理一下`useEffect`执行时机：

![](https://user-gold-cdn.xitu.io/2019/5/12/16aacba0a3cd5d3d?w=970&h=189&f=png&s=72725)

这种情况是没有清除定时器结果的，注意中间那块：interval1 =》 render =》 clean useEffect1。 clean useEffect1之前又跑了一次interval1，interval1触发render，展示的是当前计时结果。前面的stop操作，    `setRunning(false)`和`setLapse(0)`的确是跑了，但是interval1又设置了当前计时结果，所以`setLapse(0)`就是白搞了。

> 把interval延迟调大

![](https://user-gold-cdn.xitu.io/2019/5/12/16aacbe084570c6a?w=946&h=227&f=png&s=60300)

这种情况是正常的，显然全部都在我们预期之内。经过多次测试，延迟临界点是16ms。

> 为什么就是16ms？

有问题，很自然想到异步，说到异步又想到了`requestIdleCallback`，这个函数就是浏览器空闲的时候执行callback。类似于`requestAnimationFrame`，只是`requestIdleCallback`把优先级放低了。说到`requestAnimationFrame`就想到了平均60fps，接着1000/60 就是16.66666，所以每一帧的间隔大约是16ms左右。最后，问题来源就这样暴露出来了，当interval间隔大于屏幕一帧时间，用`useEffect`此定时器不会有问题，反之则是interval会在useEffect之前多执行一次造成问题的出现。

> 如果文章对你有帮助，[github](https://github.com/lhyt/issue/issues/37) , [掘金](https://juejin.im/user/5acc4ab4f265da239148703d)  可以关注一波哦