# 0.前言
我们都知道pwa是一个新技术.，依靠缓存，离线了还能正常跑，而且秒开。我把以前原生写的小游戏迁移到react，再迁移到webpack+react，最后再升级到pwa。具体介绍不多说，我们开始撸吧。

# 1.webpack
webpack攻略有很多，不啰嗦了，简单介绍一些重点。记住几个点：入口entry、出口output、插件plugins、模块加载器loader。接下来你一个完整的项目的相关操作至少要包含这些。

还有一个就是path模块，专门读取路径的，做一切的配置前，首先把路径搞好吧：
```javascript
//一般我们就是这样子做的
var path = require("path");
var ROOT_PATH = path.resolve(__dirname);//当前主入口目录
var SRC_PATH = path.resolve(ROOT_PATH,"src");//src，你写的代码在这里
var DIST_PATH = path.resolve(ROOT_PATH,"dist");//打包结果
var COMP_PATH = path.resolve(SRC_PATH,"component");//vue、react都有的component

//然后我们的配置里面
var config = {
    mode:'development',
    entry: path.resolve(__dirname, './src/index.js'),//webpack把主入口html变成js，然后注入html
    output:{
        path:DIST_PATH,
        filename:"bundle.js"
    },
}
```

模块加载器，一般我们不用预处理器的话，继续在config里面添加配置，这样子就基本满足需求
```javascript
    module:{
        rules:[
            {
                test:/\.(es6|js)$/,//考虑到es6
                use:[
                    {
                        loader:"babel-loader",
                    }
                ],
                exclude:/node_modules/   //不把nodemodules考虑进去
            },
            {
                test:/\.(css)$/,
                use:[
                    {
                        loader:"style-loader"
                    },
                    {
                        loader:"css-loader"
                    }
                ],
                exclude:/node_modules/
            },
            {
                test:/\.(png|jpeg|jpg|gif)$/,
                use:[
                    {
                        loader:"url-loader",
                    }
                ],
                exclude:/node_modules/
            }
        ]
    }
```

对于插件，我们一般就用htmlWebpackPlugin和热更新就差不多了
```javascript
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new htmlWebpackPlugin({
             title: 'game',
             template: path.resolve(__dirname, './index.html'),
             //bunld.js会注入里面
             inject: true
        }),
        new OfflinePlugin() //这是pwa用的，等下讲到
    ]
```

还有一个服务器：
```javascript
var server = new WebpackDevServer(webpack(config), {
    contentBase: path.resolve(__dirname, './dist'), //默认会以根文件夹提供本地服务器，这里指定文件夹
    historyApiFallback: true, //这是history路由，如果设置为true，所有的跳转将指向index.html
    port: 9090, //默认8080
    publicPath: "/", //本地服务器所加载的页面所在的目录
    hot: true, //热更新
    inline: true, //实时刷新
    historyApiFallback: true //不跳转
});
server.listen(9090, 'localhost', function (err) {
    if (err) throw err
})
```

哦，对了，列举一下require清单和package.json：
```javascript
var webpack = require("webpack");
var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
var webpackDelPlugin = require("webpack-del-plugin");
var WebpackDevServer = require('webpack-dev-server');
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH,"src");
var DIST_PATH = path.resolve(ROOT_PATH,"dist");
var TEM_PATH = path.resolve(SRC_PATH,"component");
var  OfflinePlugin = require('offline-plugin')


//package.json
{
  "name": "pwawebpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "jquery": "^3.3.1",
    "react-scripts": "1.1.1"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-plugin-react-transform": "^3.0.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-react-hmre": "^1.1.1",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "offline-plugin": "^5.0.3",
    "react": "^16.3.2",
    "react-dom": "^16.3.2",
    "react-transform-hmr": "^1.0.4",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "webpack": "^4.8.3",
    "webpack-cli": "^2.1.3",
    "webpack-del-plugin": "0.0.2",
    "webpack-dev-server": "^3.1.4",
    "webpack-notifier": "^1.6.0"
  },
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config webpack.config.js"
  }
}
```

为了快点看到pwa+webpack的效果，那我们eslint、test就不写了
# 2.pwa
我们就拿百度到的那些例子说吧，一个正常的pwa，由index.html、一个css、一个manifest.json、一个sw.js。我们要启动一个pwa，这是必备的。
其实，是不是看起来有点像谷歌浏览器的扩展？有没有试过自己写谷歌浏览器插件，比如屏蔽广告的、个人工具的、某些网站收藏夹等等插件。毕竟一家人，所以看起来也有点像。

html:
```html
<head>
  <title>PWA</title>
  <meta name="viewport" content="width=device-width, user-scalable=no" />
  <link rel="stylesheet" type="text/css" href="main.css">
</head>
<body>
  <h1>1</h1>
</body>
```

manifest.json：其实和自己写的浏览器扩展差不多，就是一些关于名字、样式、logo的配置
```json
{
  "name": "PWA",
  "short_name": "p",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#0000ff",
  "background_color": "#00ff00",
  "icons": [
    {
      "src": "logo.png",
      "sizes": "256x256",
      "type": "image/png"
    }
  ]
}
```

sw具体介绍 [点这里](https://blog.csdn.net/qq_19238139/article/details/77531191)
生命周期的话，也不多说了，几个阶段：解析Parsed、安装Installed、激活Activated，中间失败的话直接跳到废弃Redundant阶段，然后我们监听这些事件，我们直接看效果。
```javascript
var cacheStorageKey = 'v1'

var cacheList = [
  '/',
  "index.html",
  "main.css",
  "logo.png"
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        return response
      }
      return fetch(e.request.url)
    })
  )
})

self.addEventListener('activate', function(e) {
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(name => 
          name !== cacheStorageKey
        ).map(name=>caches.delete(name))
      })
    ).then(() => {
      return self.clients.claim()
    })
  )
})
```

注意了，pwa需要https或者localhost，因为这东西能把你本地的文件都拉取了，那也有可能干其他事情，所以必须是要在安全的情况下跑的。还有，是不是发现改了html、js文件，清空缓存都不更新呢？其实改一下sw就可以了，manifest做应用缓存也是，改个版本号，或者加个空格就行。

# 3.基于webpack的pwa
文档见[官网](https://github.com/NekR/offline-plugin)

我们不用配置就可以跑起来，但是配置里面有些地方需要注意的而且不能乱改，自行看文档。配置常用的是：caches（默认全部缓存，也可以自己设置），externals（数组形式，表示其他资源如cdn），excludes（数组形式，除了哪些不能被缓存），autoUpdate（多久后更新，默认一小时）

我们使用offline-plugin这个插件，只需要在插件里面直接引入即可：
```javascript
 plugins: [
    // ... 其他插件
    new OfflinePlugin()
  ]
```

接着在我们的入口文件index.js加入：
```javascript
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();
```

这样子直接跑webpack就ok了，试一下谷歌浏览器offline模式，你会发现还是能跑：
![1](https://user-gold-cdn.xitu.io/2018/5/21/1637e5c1db371c38?w=590&h=183&f=png&s=12620)
