# 0. 前言
相信跨域有什么手段，大家都背得滚瓜烂熟了。现在我们来做一些不在同一个tab页面或者跨域的实践。

# 1. localstorage
## 1.1 onstorage事件
localstorage是浏览器同域标签共用的存储空间，所以可以用来实现多标签之间的通信。html5出现了一个事件： onstorage，我们在window对象上添加监听就可以监听到变化：
`window.addEventListener('storage', (e) => console.log(e))`

需要注意，此事件是非当前页面对localStorage进行修改时才会触发，当前页面修改localStorage不会触发监听函数。如果实在是要，自己重写一个方法吧，要不就在修改的时候把自己改的内容po上去。

示例：
js:
```javascript
if(!localStorage.getItem('a')){
	localStorage.setItem('a',1)
}else{
	var s = localStorage.getItem('a')
	localStorage.setItem('a',+s+1)
}
window.addEventListener('storage', (e) => console.log(e))
```
我们新建两个html分别叫1.html和2.html，并加上上面的js，于是我们每次打开或者刷新该页面就会给a加上1。需要注意的是，如果是双击打开，是在`file：//`协议下的，而且不会触发storage事件，但是会给a加上1，所以可以做一个功能，计算本地某个文件被打开了多少次。如果我们用服务器打开，我们的不同tab页面通信完成了，而且是实时的。

# 2. 玩转iframe
我们都知道frame可以跨域，那么我们来试一下。下面例子，都是一个html内嵌iframe，当然你直接打开iframe那个文件，没什么意义的
## 2.1 利用hash变化传递信息实现父子窗口通信（能跨域）
父窗口：1.html

html:
```javascript
<iframe name="myIframe" src="http://localhost:1000/2.html"></iframe>
```

js:
```javascript
var originURL = myIframe.location.href
var i = document.querySelector('iframe')
i.onload= function(){//这是异步加载的iframe
  i.src += '#aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
}
```

子窗口：2.html
```javascript
window.onhashchange = function() {
    console.log(window.location.hash)
}
```

我们打开父窗口，发现子窗口的js已经跑起来了。

既然能跨域，我们直接双击打开1.html，发现还是可以，这个例子双击打开和服务器打开都能达到目的

## 2.2 父调用子页面的js或者反过来调用
父调子：还是基于前面的条件
```javascript
var i = document.querySelector('iframe')
i.onload= function(){
myIframe.window.f();
}
```

子：2.html
```javascript
function f(){
	console.log('this is 2.html')
}
```
子调父：
子：2.html
```javascript
parent.fn1()
```

父：1.html
```javascript
function fn1(s){
	console.log('this is 1.html')
}
}
```

当然，你直接打开2.html是没意义的而且是报错：`Uncaught TypeError: parent.fn1 is not a function`

这个需要注意，不能跨域，所以双击打开以及不同域是报错的：`Uncaught DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame.`，只能服务器打开


## 2.3 window.name （能跨域）
类似于vue、react的prop父子传值，只要在父窗口设置iframe标签的name，在子窗口就可以读到。

父窗口：1.html
```javascript
<iframe  name="myIframe" src="http://localhost:1000/2.html"></iframe>
```

子窗口：2.html
```javascript
console.log(window.name)
```

少年，放心地双击打开吧，有效果的。

## 2.4 postmessage（能跨域）
H5之后为window新增了window.postMessage()方法，第一个参数是要发送的数据，第二个参数是域名。

父窗口：1.html
```javascript
<iframe id="test" name="myIframe" src="http://localhost:1000/2.html"></iframe>

//js
var frame = document.querySelector('iframe')
frame.onload = function(argument) {
	window.frames[0].postMessage('data from html1', '*');
}
```

子窗口：2.html
```javascript
window.onmessage = function (e) {
	console.log(e.data)
}
```

可以跨域，所以能直接双击打开可以看见效果。

上面的父子窗口，是指一个html里面的iframe标签引入另一个html。
# 3. 非同域的两个tab页面通信
也就是两个毫无关系的tab页面通信（比如我打开一个baidu和一个github），怎么通？

当然baidu和github能不能通信，我们不知道，得问他们家的开发。前面我们已经知道，iframe能跨域，localstorage能使得两个tab页面通信。那我们就来试一下，iframe桥接两个互不相干的tab页面。注意，bridge是一个html，其他两个tab是指浏览器打开的两个html文件。你可以另外建立两个不同的html，也可以建立两个一模一样的html，然后双击打开也好、服务器打开也好，有两个就可以了。

下面，我们把桥接的iframe叫做bridge.html吧。我们用node打开，监听本地的1000端口。
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <h1>hi</h1>
  </body>
  <script type="text/javascript">
window.addEventListener("storage", function(ev){
    if (ev.key == 'info') {
        window.parent.postMessage(ev.newValue,'*');
    }
});


window.addEventListener('message',function(e){
    // 接受到父文档的消息后，广播给其他的同源页面
    localStorage.setItem('info',e.data);
});
  </script>
</html>
```


我们再来两个页面，内容如下。接着我们可以以n种不同方式分别打开，反正是非同源就可以了
```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
    <input id="ipt" type="text" name="">
    <button onclick="sub()">sub</button>
    <p id="cont"></p>
    <iframe src="http://localhost:1000/" style="display: none"></iframe>
</body>
<script type="text/javascript">
    var ipt = document.querySelector('#ipt')
    function sub(){
      document.querySelector('iframe').contentWindow.postMessage(ipt.value,'*');
      cont.innerHTML +='我：'+ ipt.value + '<br>'
      ipt.value = ''
    }
    window.addEventListener('message',function(e){
      if(e.data) cont.innerHTML +='对方：'+ e.data + '<br>'
      
    });
</script>
</html>
```

然后一个简单的聊天就搞定了，试试看。加上websocket的话，还可以非同源聊天呢，其他的可以自己随意设置了。

![1](https://user-gold-cdn.xitu.io/2018/5/26/1639c9a7b189ccee?w=414&h=72&f=png&s=2121)

从1到2的信息实时传递更新就这样子成功了，反之亦然。

# 4.MessageChannel
顾名思义，信息通道。允许我们创建一个新的消息通道，并通过它的两个MessagePort 属性发送数据m，而且在 Web Worker 中可用。可以控制台打印，发现有两个属性，portl1和port2。一个页面内嵌与iframe最常用这种方法。

就像一条管道，一边出一边进，我们可以给postmessage方法加上第三个参数：
```javascript
var channel = new MessageChannel();
channel.port1.addEventListener("message", function(e){
    window.parent.postMessage(e,'*',[channel.port2]);
    channel = null;
});
```



## 深拷贝
n种不同的对象类型？环引用？怎么做到特别容易的深拷？

然而真的做到了：
```javascript
var obj ={a:1,b:2,c:{d:3,e:[{f:1,g:2}]},h:null}
obj.h = obj
var res 
new Promise(resolve => {
    var channel = new MessageChannel();
    channel.port2.onmessage = ev => resolve(ev.data);
    channel.port1.postMessage(obj);
  }).then(data=>{res = data})
```

传了数据给管道，管道传回来一个长得一模一样的数据回来，实现了深拷贝。我们叫他结构化克隆，能处理对象循环依赖和大部分的内置对象。比如postMessage发消息给子窗口或者WebWorker的时候就会经常用到，拿到数据进行处理，但不污染原数据。