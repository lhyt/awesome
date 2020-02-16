> 平时前端都是和后台联调，或者在内嵌webview的客户端上和客户端联调，前端和前端联调是什么鬼？其实也是存在的，比如另一个前端写了一个庞大的模块（如游戏、在线ide、可视化编辑页面等需要沙盒环境的情况），此时引进来需要使用iframe来使用。在一个大需求里面，按照模块化分工的话，显然iframe里面的功能由一个人负责，主页面由另一个人负责。不同的人负责的东西同时展示在页面上交互，那么两个前端开发的过程中必然有联调的过程

<span style="color: #f00">背景：父页面index.html里面有一个iframe，iframe的src为子页面(另一个html的链接)，下文都是基于此情况下进行</span>



# 传统方式——iframe的postmessage通信
```js
// 父页面的js
    document.querySelector("iframe").onload = () => {
      window.frames[0].postMessage("data from parent", "*");
    };

// 子页面的js
    window.addEventListener(
      "message",
      e => {
        console.log(e); // e是事件对象，e.data即是父页面发送的message
      },
      false
    );
```
这个是比较传统的方法了。注意的是，`addEventListener`接收消息的时候，必须首先使用事件对象的origin和source属性来校验消息的发送者的身份，如果这里有差错，可能会导致跨站点脚本攻击。**而且需要iframe的onload触发后才能使用postmessage**

# iframe的哈希变化通信
> 低门槛的一种手段，可以跨域

父页面
```js
    const iframe = document.querySelector("iframe");
    const { src } = iframe;
// 把数据转字符串，再通过哈希传递到子页面
    function postMessageToIframe(data) {
      iframe.src = `${src}#${encodeURIComponent(JSON.stringify(data))}`;
    }
```

子iframe页面
```js
    window.onhashchange = e => {
// 监听到哈希变化，序列化json
      const data = JSON.parse(decodeURIComponent(location.hash.slice(1)));
      console.log(data, "data >>>>");
    };
```
打开父页面，执行`postMessageToIframe({ txt: 'i am lhyt' })`，即可看见控制台有子页面的反馈：

![](https://user-gold-cdn.xitu.io/2019/12/16/16f0a4ea5d0d902f?w=1340&h=336&f=png&s=83122)


反过来，子页面给父页面通信，使用的是parent：
```js 
// 子页面
parent.postMessageToIframe({ name: "from child" })

// 父页面, 代码是和子页面一样的
    window.onhashchange = () => {
      const data = JSON.parse(decodeURIComponent(location.hash.slice(1)));
      console.log(data, "data from child >>>>");
    };
```

注意:
- 父传子hash通信，是没有任何门槛，可以跨域、可以直接双击打开html
- 子页面使用parent的时候，跨域会报错`Uncaught DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame.`

# onstorage事件
## 父子iframe页面通信
`localstorage`是浏览器同域标签共用的存储空间。html5支持一个`onstorage`事件，我们在window对象上添加监听就可以监听到变化：
window.addEventListener('storage', (e) => console.log(e))
> 需要注意
此事件是非当前页面对localStorage进行修改时才会触发，当前页面修改localStorage不会触发监听函数!!!

```js
// 父页面
    setTimeout(() => {
      localStorage.setItem("a", localStorage.getItem("a") + 1);
    }, 2000);
    window.addEventListener("storage", e => console.log(e, "parent"));

// 子页面
window.addEventListener("storage", e => console.log(e, "child"));
```
打印出来的storageEvent是这样的：

![](https://user-gold-cdn.xitu.io/2019/12/16/16f0a4e44b279362?w=1274&h=1116&f=png&s=390080)

## 更骚的操作，自己和自己通信
> 都是两个页面，要写两分html，有没有办法不用写两个html呢，只需要一个html呢？其实是可以的！

给url加上`query`参数或者哈希，表示该页面是子页面。如果是父页面，那么创建一个iframe，src是本页面href加上`query`参数。**父页面html不需要有什么其他标签，只需要一个script即可**
```js
    const isIframe = location.search;
    if (isIframe) {
// 子页面
      window.addEventListener("storage", e => console.log(e, "child"));
    } else {
// 父页面，创建一个iframe
      const iframe = document.createElement("iframe");
      iframe.src = location.href + "?a=1";
      document.body.appendChild(iframe);
      setTimeout(() => {
        localStorage.setItem("a", localStorage.getItem("a") + 1);
      }, 2000);
      window.addEventListener("storage", e => console.log(e, "parent"));
    }
```

# MessageChannel
`MessageChannel`创建一个新的消息通道，并通过它的两个MessagePort 属性发送数据，而且在 Web Worker 中可用。`MessageChannel`的实例有两个属性，`portl1`和`port2`。给port1发送消息，那么port2就会收到。

```js
// 父页面
    const channel = new MessageChannel();
// 给子页面的window注入port2
    iframe.contentWindow.port2 = channel.port2;
    iframeonload = () => {
      // 父页面使用port1发消息，port2会收到
      channel.port1.postMessage({ a: 1 });
    };

// 子页面，使用父页面注入的port2
    window.port2.onmessage = e => {
      console.error(e);
    };
```
> MessageChannel优点： 可以传对象，不需要手动序列化和反序列化，而且另一个port收到的是对象深拷贝

# SharedWorker
是worker的一种，此worker可以被多个页面同时使用，可以从几个浏览上下文中访问，例如几个窗口、iframe、worker。它具有不同的全局作用域——只有一部分普通winodow下的方法。让多个页面共享一个worker，使用该worker作为媒介，即可实现通信

worker的代码
```js
// 存放所有的连接端口
const everyPorts = [];
onconnect = function({ ports }) {
// onconnect一触发，就存放到数组里面
  everyPorts.push(...ports);
// 每次连接所有的端口都加上监听message事件
  [...ports].forEach(port => {
    port.onmessage = function(event) {
// 每次收到message，对所有的连接的端口广播，除了发消息的那个端口
      everyPorts.forEach(singlePort => {
        if (port !== singlePort) {
          singlePort.postMessage(event.data.data);
        }
      });
    };
  });
};
```
父页面js代码
```js
    const worker = new SharedWorker("./worker.js");
    window.worker = worker;
    worker.port.addEventListener(
      "message",
      e => {
        console.log("parent：", e);
      },
      false
    );
    worker.port.start();
    setTimeout(() => {
      worker.port.postMessage({
        from: "parent",
        data: {
          a: 111,
          b: 26
        }
      });
    }, 2000);
```
iframe子页面的js代码：
```js
    const worker = new SharedWorker("./worker.js");
    worker.port.onmessage = function(e) {
      console.log("child", e);
    };
    worker.port.start();
    setTimeout(() => {
      worker.port.postMessage({ data: [1, 2, 3] });
    }, 1000);
```
正常情况下，postMessage发生的时机应该是全部内容onload后执行最好，不然对方还没load完，还没绑定事件，就没有收到onmessage了

> SharedWorker也是可以传对象的哦

# 直接注入对象和方法
上面很多例子，都用了contentWindow，既然contentWindow是iframe自己的window，那么我们就可以随意注入任何内容，供iframe调用了。前端和客户端联调，常用的方法之一就是注入函数。子页面调用父页面的方法，因为有parent这个全局属性，那么父页面的window也是可以拿到的了

```js
// 父页面
    document.querySelector("iframe").contentWindow.componentDidMount = () => {
      console.log("iframe did mount");
    };

// 子页面
    window.onload = () => {
      // 假设这里有react一系列流程运行...
      setTimeout(() => {
        // 假设现在是react组件didmount的时候
        window.componentDidMount && window.componentDidMount();
      }, 1000);
    };
```

下面，基于给iframe的window注入方法，来设计一个简单的通信模块
- 父页面主动调子页面， 子页面被父页面调
- 父页面被子页面调，子页面调父页面

父页面下，给window挂上parentPageApis对象，是子页面调用方法的集合。并给子页面注入一个callParentApi的方法来调父页面的方法。
```js
   const iframe = document.querySelector("iframe");

    window.parentPageApis = window.parentPageApis || {};
    // 父页面自己给自己注入子页面调用的方法
    Object.assign(window.parentPageApis, {
      childComponentDidMount() {
        console.log("子页面did mount");
      },
      changeTitle(title) {
        document.title = title;
      },
      showDialog() {
        // 弹窗
      }
    });

// 给子页面注入一个callParentApi的方法来调父页面
    iframe.contentWindow.callParentApi = function(name, ...args) {
      window.parentPageApis[name] && window.parentPageApis[name].apply(null, args);
    };

    iframe.contentWindow.childPageApis =
      iframe.contentWindow.childPageApis || {};
    Object.assign(iframe.contentWindow.childPageApis, {
      // 父页面也可以给子页面注入方法
    });
    setTimeout(() => {
// 调用子页面的方法
      callChildApi("log", "父页面调子页面的log方法打印");
    }, 2000);
```

子页面也给父页面注入callChildApi方法，并把自己的一些对外的方法集合写在childPageApis上
```js
    window.childPageApis = window.childPageApis || {};
    Object.assign(window.childPageApis, {
      // 子页面自己给自己注入方法
      log(...args) {
        console.log(...args);
      }
    });
    window.parent.window.callChildApi = function(name, ...args) {
      window.childPageApis[name] && window.childPageApis[name].apply(null, args);
    };
    window.onload = () => {
      // 假设这里有react一系列流程运行...
      setTimeout(() => {
        // 假设现在是react组件didmount的时候，告诉父页面
        window.callParentApi("childComponentDidMount");
      }, 1000);
    };
```

# 最后
**以上的storage、SharedWorker的方案，也适用于“不同tab通信”这个问题。总的来说，SharedWorker比较安全，注入全局方法比较灵活，哈希变换通信比较简单。postmessage、哈希变化、storage事件都是基于字符串，MessageChannel、SharedWorker可以传递任何“可拷贝的值”。全局注入就可以为所欲为了，但也是最危险的，需要做好防范**


> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)