# 0.前言
后端有后端路由，根据路由返回特定的网页，代表者是传统的mvc模式，模板引擎+node。前端也有前端的路由，我们用三大框架做spa的时候，总是和路由离不开关系。主要有两种方法：基于哈希路由、基于history

# 1.哈希路由

#后面的内容是网页位置标识符，一般是锚点`<a name='xx'>`或id属性`<div id='xx'>`。通过location.hash可以取到该值，常见的返回顶部也可以利用`href=‘#’`。改变#后面的内容不会引起页面重新刷新，但是会有历史记录，所以可以后退。这对于ajax应用程序特别有用，可以用不同的#值，表示不同的访问状态，然后向用户给出可以访问某个状态的链接。但是IE 6和IE 7不会有历史记录。#后面的内容不会提交到服务器。

对于a标签，平时有一个常规的操作：
想要在某个点击按钮变成a标签的那个`cursor:pointer`（手指），一般就用a标签包住文字，
`<a href="#">按钮</a>`但是这样子是会有历史记录，所以我们应该改成
`<a href="javascript:void 0">按钮</a>`


我们在用vue路由的时候，其实可以发现，`router-link`到最后就是一个a标签。而我们也知道a标签有一个href属性，如果是哈希路由就不会引发页面的刷新。所以平时也有一种常规操作，返回顶部，就是a标签的`href=“#”`，就是直接跳转到页面顶部。如果我们给dom一个id，`#<id>`就跳转到那个dom的位置。


对于前端路由，我们有一个事件可以利用的，onhashchange，监听哈希的变化然后执行相应的回调函数。于是我们可以写下路由类的代码：
html:
```html
        <a href="#1">1</a>
        <a href="#2">2</a>
        <a href="#3">3</a>
	<button onclick="r.back()">后退</button>
	<button onclick="r.forward()">前进</button>
```

js:
```javascript
const addEvent = (function () {//事件
    if (window.addEventListener) {
        return function (ele, event, handle, isBunble) {
            isBunble = isBunble || false
            ele.addEventListener(event, handle, isBunble)
        }
    } else if (window.attachEvent) {
        return function (ele, event, handle) {
            ele.attachEvent('on' + event, handle)
        }
    } else {
        return function (ele, event, handle) {
            ele['on' + event] = handle
        }
    }
})()

class Router {
    constructor () {
        this.routes = {}
        this.currentUrl = '/'
        this.pre = this.pre || null
        this.next = this.next || null
        addEvent(window, 'load', () => {
            this.updateUrl()
        })
        addEvent(window, 'hashchange', () => {
            this.pre = this.currentUrl
            this.updateUrl()
        })  
    }

    route (path, cb) {
        this.routes[path] = cb || function () {}
    }

    updateUrl () {//路由更新的回调
        this.currentUrl = window.location.hash.slice(1) || '/'
        console.log(this.currentUrl)
    }

    back () {//后退
        if( !this.currentUrl ) return;
        this.next = this.currentUrl
        window.location.hash = '#' + this.pre
    }

    forward () {//前进
        if( !this.next ) return ;
        window.location.hash = '#' + this.next
    }
}
const r = new Router()
```

我们尝试点击一下a标签，发现url上面的#后面 内容改变，而且控制台打印了相应的数字

## 在VUE中使用路由
html:
```html
<div id="app">
        <a href="#1">1</a>
        <a href="#2">2</a>
        <a href="#3">3</a>
        <component :is="page"></component>
</div>
    <template id="page1">
        <div>
            <h1>这是第一页</h1>
        </div>
    </template>
    <template id="page2">
        <div>
            <h1>这是第二页</h1>
            <p>通过监听路由改变来改变视图</p>
        </div>
    </template>
    <template id="page3">
        <div>
            <h1>这是第三页</h1>
            <p>动态改变组件，模拟类似于前端路由的效果</p>
        </div>
    </template>
```

js:
```javascript
        const vm = new Vue({
            el: "#app",
            data () {
                return {
                    page: "page1"
                }
            },
            components:{
                "page1":{
                    template:'#page1'
                },
                "page2":{
                    template:'#page2'
                },     
                "page3":{
                    template:'#page3'
                }                             
            }
        });


const addEvent = (function () {
    if (window.addEventListener) {
        return function (ele, event, handle, isBunble) {
            isBunble = isBunble || false
            ele.addEventListener(event, handle, isBunble)
        }
    } else if (window.attachEvent) {
        return function (ele, event, handle) {
            ele.attachEvent('on' + event, handle)
        }
    } else {
        return function (ele, event, handle) {
            ele['on' + event] = handle
        }
    }
})()

class Router {
    constructor () {
        this.routes = {}
        this.currentUrl = '/'
        this.pre = this.pre || null
        this.next = this.next || null
        addEvent(window, 'hashchange', () => {
            this.pre = this.currentUrl
            this.updateUrl()
        })  
    }

    route (path, cb) {
        this.routes[path] = cb || function () {}
    }

    updateUrl () {
        this.currentUrl = window.location.hash.slice(1) || '/'
        console.log(this.currentUrl)
        vm.$data.page = "page" + this.currentUrl
    }

    back () {
        if( !this.currentUrl ) return;
        this.next = this.currentUrl
        window.location.hash = '#' + this.pre
    }

    forward () {
        if( !this.next ) return ;
        window.location.hash = '#' + this.next
    }
}

const r = new Router()
```

# 2.history路由
如果不了解的，[点击这里了解history路由](http://javascript.ruanyifeng.com/bom/history.html)

html:
```html
    <div id="app">
        <component :is="page"></component>
        <button @click="to1">page1</button>
        <button @click="to2">page2</button>
        <button @click="to3">page3</button>
    </div>

    <template id="page1">
        <div>
            <h1>这是第一页</h1>
        </div>
    </template>
    <template id="page2">
        <div>
            <h1>这是第二页</h1>
            <p>通过监听路由改变来改变视图</p>
        </div>
    </template>
    <template id="page3">
        <div>
            <h1>这是第三页</h1>
            <p>动态改变组件，模拟类似于前端路由的效果</p>
        </div>
    </template>
```

js:
```javascript
        const vm = new Vue({
            el: "#app",
            data () {
                return {
                    page: "page1"
                }
            },
            components:{
                "page1":{
                    template:'#page1'
                },
                "page2":{
                    template:'#page2'
                },     
                "page3":{
                    template:'#page3'
                }                             
            },
            methods: {
                to1(){
                    r.go('1')
                },
                to2(){
                    r.go('2')
                },
                to3(){
                    r.go('3')
                }                                
            }
        });


const addEvent = (function () {
    if (window.addEventListener) {
        return function (ele, event, handle, isBunble) {
            isBunble = isBunble || false
            ele.addEventListener(event, handle, isBunble)
        }
    } else if (window.attachEvent) {
        return function (ele, event, handle) {
            ele.attachEvent('on' + event, handle)
        }
    } else {
        return function (ele, event, handle) {
            ele['on' + event] = handle
        }
    }
})()

class Router  {
    constructor (from, history) {
        this.from = from//保存起点
        this.history = history
        this.list = {} //缓存k-v对
    }

    go (pagename) {
        if(!this.list[pagename]){
            this.list[pagename] = ++this.from
            window.history.pushState({page:pagename},pagename,pagename)
        }else{
            window.history.go(this.list[pagename])
        }
        vm.$data.page = "page" + pagename
    }
}

const r = new Router(window.history.length, window.history)
```

引用vue官网一句话：如果你嫌哈希路由难看可以用history路由。不过history路由有一个问题，我们知道pushState和replaceState只是对url栏进行改变，不会触发页面刷新，只是导致history对象发生变化，另外也不能跨域。所以这个例子你不能直接双击打开了，因为file没有域名好讲，你只能通过后台打开这个页面。既然不会触发页面更新，那么也不会发送http请求，就有了一个问题：如果直接输入url，后端又没有对应的url处理的话，那肯定是404，而哈希路由则可以直接输入 url直接定位到某个视图。