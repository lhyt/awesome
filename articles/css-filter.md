# 前言
> **(12月13日)是国家公祭日🕯️🙏**

<span style="color: #f00">今天(12.13)打开b站，看见一片灰色。对于公祭日，我们每一个人都应该为此默哀、纪念历史，都要铭记历史、热爱祖国、砥砺前行</span>

![](https://user-gold-cdn.xitu.io/2019/12/13/16effabfab3e6ad5?w=2016&h=1254&f=png&s=1566217)

下面，**在技术的角度上**，研究一下这块全灰是怎么实现的

首先，职业下意识就打开了控制台。为什么呢？是想看看怎么实现的，是css自定义属性吗？是引入一份css吗？是预处理器修改全局变量吗？结果，打开控制台，浏览了一下，最后定位发现在于一行css代码，关掉就变成彩色了
```css
filter: grayscale(100%);
```

于是乎，我们马上来看看filter这个滤镜效果具体还有什么值可选。

# 效果预览
赶紧的，写个脚本遍历所有的属性，并都看看效果：
```js
    const url = "https://www.baidu.com/img/baidu_resultlogo@2.png";
    let html = "";
    [
      {
        name: "灰度100%",
        style: "grayscale(100%)"
      },
      {
        name: "模糊5px",
        style: "blur(5px)"
      },
      {
        name: "3倍亮度",
        style: "brightness(300%)"
      },
      {
        name: "200%对比度",
        style: "contrast(200%)"
      },
      {
        name: "200%饱和度",
        style: "saturate(200%)"
      },
      {
        name: "色相旋转180度",
        style: "hue-rotate(180deg)"
      },
      {
        name: "100%反色",
        style: "invert(100%)"
      },
      {
        name: "50%透明度",
        style: "opacity(50%)"
      },
      {
        name: "阴影",
        style: "drop-shadow(10px 5px 5px #f00)"
      },
      {
        name: "100%透明度",
        style: "opacity(100%)"
      },
      {
        name: "褐色程度70%",
        style: "sepia(70%)"
      }
    ].forEach(({ name, style }) => {
      html += `<div>${name}-${style}: <img src=${url} style="filter: ${style}" /></div><br />`;
    });
    document.body.innerHTML = html;
```

预览效果：
![](https://user-gold-cdn.xitu.io/2019/12/13/16effd1a47d526f7?w=1044&h=1510&f=png&s=327714)

> 可支持多个滤镜结合哦

# 开始发挥想象力
## 毛玻璃效果
看见模糊的效果，是不是马上就想到mac上炫酷的毛玻璃效果。于是，我们来复现一下：

![](https://user-gold-cdn.xitu.io/2019/12/13/16efffacd65640d7?w=2074&h=1272&f=png&s=3205918)

实现方法：先铺满全屏背景，然后承载主要内容的元素半透明，且有一个伪元素，此伪元素也是有一个`background-attachment: fixed`的背景，并且把它加上blur即可实现
```css
    .bg,
      .container::before {
        background-image: url("http://img2.imgtn.bdimg.com/it/u=1737072847,1699534261&fm=26&gp=0.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-attachment: fixed;
      }
      .bg {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        z-index: -1;
      }

      .container::before {
        content: "";
        filter: blur(20px);
        z-index: -1;
      }

      .container {
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 30px;
        /* 用transform会悲剧哦 */
        left: calc(50% - 250px);
        top: calc(50% - 200px);
      }

      .container,
      .container::before {
        width: 500px;
        height: 400px;
        position: absolute;
        border-radius: 8px;
      }

```
- background-attachment: fixed。这个可以使得背景相对于视窗是固定的，否则一般情况下，图片会从你的盒子左上角开始，而不是像图中的效果一样
- calc(50% - 250px)居中: 使用transform的话，偏移会导致伪元素的背景和内容不统一，调起来也麻烦，直接calc最快

剩下html代码就很简单了：
```html
    <main class="bg"></main>
    <section class="container">
      i am lhyt
    </section>
```

## 模糊阴影
平时可能多数是使用`box-shadow`实现一个简单的阴影，但是blur也可以哦。在一张图下面，还是放这张图，然后加上blur模糊，再偏移一点点，不就是一个阴影了(彩色阴影哦)

![](https://user-gold-cdn.xitu.io/2019/12/14/16f0007e34221e5f?w=1138&h=928&f=png&s=1474958)

```css
.shadow,
      .shadow::before {
        width: 500px;
        height: 400px;
        background: url("http://img2.imgtn.bdimg.com/it/u=1737072847,1699534261&fm=26&gp=0.jpg")
          no-repeat;
        background-size: cover;
      }
      .shadow {
        position: relative;
      }
      .shadow::before {
        content: "";
        display: block;
        position: absolute;
        filter: blur(20px);
        z-index: -1;
        top: 20px;
        left: 20px;
      }
```
如果fliter再加上`brightness(0.5)`，那就是一个黑色阴影了。html就只有一个元素，没什么好说的。

## 自动颜色逐渐变化
还记得windows的一些屏保吗，它们的颜色一直在改变。通过色相旋转`hue-rotate`，css滤镜也可以实现这个效果

![](https://user-gold-cdn.xitu.io/2019/12/14/16f003f2dc1d51c8?w=640&h=400&f=gif&s=3235330)
```css
      @keyframes auto_change_color {
        from {
          filter: hue-rotate(0);
        }

        to {
          filter: hue-rotate(360deg);
        }
      }
      .container {
        background-image: url("http://img2.imgtn.bdimg.com/it/u=1737072847,1699534261&fm=26&gp=0.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        animation: auto_change_color 5s linear infinite;
      }

```

## 从抽象到具象
通过修改前面的模糊度，加上一些偏移、对比度变化动画，可以实现一个图片拼接且逐渐从抽象到具象的效果：

![](https://user-gold-cdn.xitu.io/2019/12/14/16f00633a89f0415?w=640&h=400&f=gif&s=820776)

```css
      @keyframes shadow_move {
        from {
          top: 400px;
          left: 400px;
          filter: blur(20px);
        }

        to {
          top: 0;
          left: -250px;
          filter: blur(0);
        }
      }

      @keyframes container_move {
        from {
          top: 0;
          filter: blur(20px);
          left: 0;
        }

        to {
          top: 200px;
          left: 400px;
          filter: blur(0);
        }
      }

      @keyframes body_contrast {
        from {
          filter: contrast(20);
        }

        to {
          filter: contrast(1);
        }
      }

      .shadow,
      .shadow::before {
        width: 250px;
        height: 400px;
        background: url("http://img2.imgtn.bdimg.com/it/u=1737072847,1699534261&fm=26&gp=0.jpg")
          no-repeat;
        background-size: cover;
      }
      .shadow {
        position: relative;
        animation: container_move 20s infinite ease;
        background-position-x: -250px;
      }
      .shadow::before {
        content: "";
        display: block;
        position: absolute;
        z-index: -1;
        animation: shadow_move 20s infinite ease;
      }

      body {
        animation: body_contrast 20s infinite ease;
      }
```


## 闪电
平时生活中的闪电，一般是从一股很细的光到一股很粗的电光。这个过程，使用brightness可以模拟。下面我们做一个闪电劈下来的效果

![](https://user-gold-cdn.xitu.io/2019/12/14/16f007a2e6aa3d77?w=640&h=400&f=gif&s=371754)


```css

    @keyframes lighting {
        from {
          filter: brightness(0);
        }

        to {
          filter: brightness(100%);
        }
      }

      @keyframes light {
        from {
          filter: brightness(100%);
        }

        to {
          filter: brightness(300%);
        }
      }
      .light {
        background: url("https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3951629719,2497770173&fm=26&gp=0.jpg")
          no-repeat;
        width: 463px;
        height: 400px;
        animation: lighting 0.5s linear infinite;
      }
      .container {
        background-image: url("http://img0.imgtn.bdimg.com/it/u=2309502909,4210960075&fm=26&gp=0.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        width: 300px;
        height: 300px;
        animation: light 0.5s linear infinite;
        position: absolute;
        left: 250px;
      }
```

html:
```html
  <body>
    <section style="filter: contrast(20); background-color: #000">
      <div class="light"></div>
    </section>
    <section style="filter: contrast(20); background-color: #000">
      <div class="container"></div>
    </section>
  </body>
```



> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)