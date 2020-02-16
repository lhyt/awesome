# 0. 前言
preact作为备胎，但是具有体积小，diff算法优化过的特点，简单活动页用上它是不错的选择。但是考虑到react令人兴奋的新特性，preact并没有按时更新去完全支持它，更严重的是一些babel插件、一些库配合preact会有问题。所以，还是不得不迁移了。

如何迁移？package.json直接修改版本，删掉preact，重装，完事！
> too young

# 1. 从alias改起
首先，一般是[这样子](https://preactjs.com/guide/switching-to-preact)接入preact的，使得我们代码里面毫无感觉我们用的是preact。在webpack的alias里面配置：

```javascript
  alias: {
    react: 'preact-compat',
    'react-dom': 'preact-compat'
  },
```
所以，第一步先把这个去掉

# 2. 语法上
1. preact的元素数组可以不写key，切换回来必然警告很多，需要把key补上
```javascript
render() {
    return (
      [
        <div key="container">2</div>,
        <div key="more">1</div>,
      ]
    );
  }
```
2. 元素的style可以写字符串，转回react是报错，导致页面白屏
```jsx
<div style={`background: url(${this.props.h5img});`} />
```
3. will这些不安全的生命周期，需要手动修改
4. state必须初始化，不能直接想有this.state.xx就有。必须保证后面用到this.state之前，对state有初始化，否则是null

# 3. preact相关的router迁移回react生态
首先，import的preact-router得换成react-router。然后，将对应的语法和生态迁移到react相关的。

preact-router:
```jsx
          <Router history={history}>
              <Main path="/" history={history} />
              <GetGiftForm path="/get_gift_form" history={history} />
              <Join path="/join" history={history} />
              <NewUser path="/new_user" history={history} />
          </Router>
```

react-router:
```jsx
          <Router history={history}>
            <div>
              <Route exact path="/" history={history} component={Main} />
              <Route path="/get_gift_form" history={history} component={GetGiftForm} />
              <Route path="/join" history={history} component={Join} />
              <Route path="/new_user" history={history} component={NewUser} />
            </div>
          </Router>
```
preact-router有一个route方法，就是直接将路由push或者replace的，而react-router是没有这个方法的。实际上底层就是封装history路由加上内部的setstate：
```javascript
import { route } from 'preact-router';
route('/a');
```

问题来了，如果没有这个方法，想用脚本跳转路由怎么办？直接history上改，只能改地址栏的url显示但不能更新组件以及内部状态。所以我们只能找和react-router配合起来用的相关的库。

观察一下，都用到了history属性，传入一个history，这个是用了一个history的库创建的，所以我们尽可能的让它接入两种路由得到一样的效果：
```javascript
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
```

打印了history，发现它有push、replace属性，大概也猜到应该就是像route的效果的，一验证发现可行：
```javascript
history.push('/a');
```


另外，还有preact-router的路由更新监听是这样的:
```jsx
        <Router history={history} onChange={this.handleRoute}>
             ......
        </Router>
```

切换到react的话，没有这个方法。于是我们继续找history，发现有一个listen属性，看名字是一个监听函数，也就是可以实现路由更新监听的：
```javascript
    history.listen((location) => {
      ...
    });
```

# 4. 异步路由
用preact-router的时候，有些组件是异步的：
```jsx
        <Router history={history}>
            { trackRoute() }
        </Router>
```

trackRoute函数组件：
```javascript
import React from 'react';
import AsyncRoute from 'preact-async-route';
export default () => {
  return (
    <AsyncRoute
      path="/track"
      getComponent={async () => {
        return import('./comp' /* webpackChunkName: 'async_track' */);
      }}
    />
  );
};
```

效果就是，动态import，代码分割。react也有一个类似的，[react-async-router](https://www.npmjs.com/package/react-async-router)，但是用法和我们的之前的[preact-async-route](https://www.npmjs.com/package/preact-async-route)差得远而且不能优雅接入。既然是16.6.7了，我们可以试一下新特性：lazy+suspence

```jsx
import React, { lazy, Suspense } from 'react';
const Comp = lazy(() => import('./comp' /* webpackChunkName: 'async_track' */));
function TrackRoute() {
  return (
    <Suspense fallback={<div />}>
      <Comp />
    </Suspense>
  );
}
export default TrackRoute;
```

# 5. 内部实现原理不一样的兼容
有一个页面是这样的：
```javascript
// Main.jsx
render() {
    return (
      <div>
        <Page1 />
        <Page2 />
        <Page3 />
         ...
      </div>
    );
  }
```

除了page1是原来就在的，其他每一个Pagex组件，返回Page组件，在Page内部，当页码是当前页返回对应的元素，否则返回空：
```javascript
// Pagex
render() {
    return (
        <Page />
    );
  }

// Page
render() {
    return currentPage === page ? <somedom> : null
  }
```
这里，我们可以猜一下，Main是最大的组件，内部状态页码在切换，所有的Pagex组件跟着更新，做出对应的变化。Pagex的更新，走的是didupdate。

实际上，preact的是第一个内部是Page实现的Pagex组件会unmount然后重新didmount。这里是Page2先卸载再挂载，交换位置page1直接到page3的话也是page3先卸载再挂载。一些动画操作就放在了didmount，之前都是这样做的，但大家没有发现是什么问题，因为看见是这样，开发起来没毛病，又没有bug，就不太在意。切换回react，发现动画不生效，才发现因为内部渲染机制不一样导致的。所以我们把函数的调用放在didupdate里面，并且加上执行过一次的标记判断。

# 6. 减少无必要的函数执行

## getSnapshotBeforeUpdate
做一个像qq聊天起跑那样的东西，头和脚固定，中间无限长。这里要求视觉给3个图，头、脚、中间1px高的图。如果内容不满屏，不显示脚不能滚动，如果大于1屏显示脚。
![image](https://user-gold-cdn.xitu.io/2019/2/2/168ac4ce9954e63b?w=790&h=546&f=png&s=44556)

这里当然少不了原生dom操作了，需要判断高度，有没有大于1屏，要不要overflow：hidden：

```javascript
  componentDidUpdate() {
    if (this.state.hasFooter) {
      return;
    }
     const last = document.querySelector('.act-card:last-of-type');
    if (last) {
      const { top } = last.getBoundingClientRect();
      if (SCREEN_HEIGHT - top < MAX_BOTTOM_DISTANCE) {
        setTimeout(() => {
          this.setState({ hasFooter: true }); // eslint：不能在didupdate里面setstate
        });
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
  }
```
这里需要执行两次下面一大块逻辑，第二次是无必要的，我们可以利用getSnapshotBeforeUpdate生命周期配合didupdate使用：
```javascript
  getSnapshotBeforeUpdate(_, prevstate) {
    if (!prevstate.hasFooter && prevstate.actCards.length) {
      return true;
    }
    return null;
  }

  componentDidUpdate(_, __, snapshot) {
    if (!snapshot) {
      return;
    }
    ......
  }
```

## memo
可以说函数式组件的purecomponent，而且第二个参数能传入第二个类似shouldComponentUpdate的函数进行比较。既然能自定义化，那么对比于purecomponent的自带对象浅比较就是更加的灵活了，比如：
```javascript
import React, { memo } from 'react';
export default memo((props) => {
  const isNoAct = !props.actCards.length || props.loading;
  return (
    <section className="body-container">
      <div>
        {
          !isNoAct ? props.actCards.map((actCard, index) => (
            <div
              key={index}
            >
              ......          
            </div>
          ))
            : (
              <div className="no">
              暂无
              </div>
            )
        }
      </div>
      {props.hasFooter && <div className="body-footer" src={footer} alt="err" />}
    </section>
  );
}, (prevprops, nextprops) => {
  // 少渲染一次，一开始actcards什么都没有，我们不比较actcards数组
  if (prevprops.hasFooter !== nextprops.hasFooter
    || prevprops.loading !== nextprops.loading) {
    return false;
  }
  return true;
});
```
这里我们就少了一次从actcards数组的`undefined`到`[]`的过程的比较，而这时候一直是loading状态，没有更新的意义。如果这里return之前又是有像前面那个聊天气泡那种效果需要dom操作的，那就伤性能了。这里我列举出来的只是把代码删减过的简单结果，实际上开发的时候逻辑是远远比这demo复杂的