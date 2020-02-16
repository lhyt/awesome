# 0.前言
CSS属性非常多，如果说死记的话，是不容易的，我们了解他的原理，其他不常见的属性都是手到擒来 
# 1.包含块（CB）
首先说一下ICB（初始包含块）。简单来说，根元素的ICB就是首屏。
连续媒体：页面内容范围超出视窗大小，需要我们拉动滚动条才能看，他的ICB是视窗（viewport）
分页媒体：页面内容是一页一页的，比如我们在手机上看见的一些h5，他的ICB是页面范围

这很明显，position为fixed的时候就是ICB

CB是做什么的呢？
比如我们的top、left、bottom、right，他们定位就相对于CB。百分比，也是相对于CB。所有的元素，在CB里面参与高度计算。对于脱离文档流的float、absolute、fixed，父元素无法识别他们，也不参加高度的计算，所以float的时候会导致父元素高度坍塌。

- position为relative或者static的元素，它的包含块由最近的块级（display为block,list-item, table）祖先元素的内容框组成
- 如果元素position为absolute，它的包含块是祖先元素中最近一个非static
- 其他情况下包含块由祖先节点的padding edge组成


![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c22534276?w=430&h=130&f=png&s=1711)

对于margin需要注意了：margin-top和margin-bottom的百分比也是相对于父元素width，不是height。这个理由很简单，我们可以想象一下：设置了上下方向的margin->父元素的高增加->上下margin又增加->父元素高又增加......，如此循环。

其实这个是流传的说法，其实真正的原因是在于我们的书写习惯。我们写字是从左到右，从上到下，在排版上，水平方向可能就有具体的需求比如分栏。但是垂直方向上，我们要写多少字是一个未知数，而且要是的确需要知道垂直方向尺寸有多大，也是我们人为地给他一个高度（height默认是0，我们要是想用百分比的高只能给父级元素人为地赋值）。也可以想一下，如果是我们书写习惯是竖着写，那么就是height默认是视窗高度了，而width默认是0.

我们是不是会发现一个问题，都说absolute相对于最近的非static元素，但是我们做遮罩层的时候，是不是直接写宽高100%，而且还能有效。
因为，最近都没有一个非static的父元素，absolute会相对于ICB

# 2.宽和高
无论什么时候，要记得水平方向，宽默认取全部；垂直方向，高默认取0。所以，我们平时width100%就是占满全部，auto就是占满剩下的内容，而height100%有时候设置了也没有用。
height没用的时候，因为他的父元素是0或者被默认是0。比如一个div，直接设置高100%，他是0，但是你用一个已知高度的div包住他，这时候他的百分比就有用了。
*auto、百分比，都由CB（包含块）决定*

![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c226fa926?w=486&h=223&f=png&s=5840)

这样子，我们也可以知道为什么margin auto能居中了：
首先，先要知道宽高，既然已经知道了宽高，那margin就可以被反推出来值是多少，auto会平分剩下的（两边margin=行宽-width）。


先说一个概念：outerHeigth，也就是margin-box。顾名思义就是普通盒子模型加上margin。所以我们可以得出一个条件：居中的时候，outerHeigth=父（CB或者ICB）的高。如何居中呢，显然是top或者bottom为0，这样子margin盒子边界和父元素（CB或者ICB）重叠

# 3.BFC
块级盒子形成BFC的条件：
1.浮动元素
2.绝对定位元素
3.非块级盒子的块级容器（inline-block，table-cells，and table-captions）
4.overflow不是“ visible”
5.根元素

BFC的特点：
1.一个独立的容器。
2.盒子从顶端开始垂直地一个接一个地排列，盒子之间垂直的间距是由 margin 决定的。
3.在同一个 BFC 中，两个相邻的块级盒子的垂直外边距会发生重叠。
4.BFC 区域不会和 float box 发生重叠。
5.BFC 能够识别并包含浮动元素，参与高度计算。

因此我们可以想起一些场见的问题，用bfc解决
1.父子盒子margin越界问题

![1](https://user-gold-cdn.xitu.io/2018/5/9/1634542c22b7b5a4?w=362&h=228&f=png&s=2709)

而BFC可以解决这个问题，由bfc的特点：一个独立容器（甚至可以说是一个独立的margin-box），当然不会无缘无故地穿透父盒子

![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c22d8fa87?w=232&h=222&f=png&s=3242)

2.float时父元素高度坍塌、兄弟元素重叠
前面我们已经看见，父元素高度为0。因此，我们把父元素变成BFC，那就可以实现我们想要的结果——父元素包含一堆子元素
![](https://user-gold-cdn.xitu.io/2018/4/27/163065df73ef05af)

还有一种方法，在父元素后面（：：after）加上一个尺寸为0的伪元素，clear：both，使得父元素换行显示，识别前一行的高度（即是0）

3.兄弟元素，一个float
如果是一个float另一个不是，则正常情况下，没有float的那个直接无视float的那个，因为用了float脱离文档流。如果无float为bfc，则会像加了float一样紧跟后面

一个float，一个正常，正常的元素无视float的元素：
![](https://user-gold-cdn.xitu.io/2018/4/27/163065d00fa12bdd?w=253&h=167&f=png&s=1737)

另一个是bfc：
![](https://user-gold-cdn.xitu.io/2018/4/27/163065f34a8f6fe0?w=244&h=179&f=png&s=672)

# 4.行内元素
## 4.1可置换行内元素
展示内容不属于css范畴的，比如src、value，可被替换的（img、object、video、textarea、input等标签），伪元素通过content插入的对象是匿名可置换元素。

反之，其他的就是不可置换行内元素了，a、span标签

对比：
<table>
<th>
<td>可置换</td><td>不可置换</td>
</th>
<tr>
<td>宽高margin可设？</td><td>不能</td><td>能</td>
</tr>
<tr>
<td>水平对齐方式</td><td>父元素的text-align影响</td><td>默认左对齐</td>
</tr>
<tr>
<td>垂直对齐方式</td><td>自己的或者父为table-cell时的vertical-align</td><td>默认baseline</td>
</tr>
</table>

## 4.2IFC
不同于BFC，IFC是默认地、隐式的创建，当一个区域内仅仅包含水平排列的元素才生成（文本、行级元素、行级块元素），可以通过vertical-align来设置垂直方向上的对齐。

### 4.2.1 inline-box（行级盒子）
有点像我们以前的英语作业本一样，只是多了几条线
![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c23150796?w=813&h=296&f=png&s=18221)

baseline就是基线，英语本上写字的那一行，middle是中间（整个7线谱的最中间，也是英语本三行的最中间的1.5行） ，vertical-align就是设置对齐哪一条线的。

面试官：你见过这种情况吗
![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c37e04ffa?w=382&h=205&f=png&s=26396)
当img的vertical-align为baseline，img的高又小于行高就会发生这样子的情况。我们只要让他的对齐线是bottom或者top（是top的时候，他用上边线和top对齐的）就行

### 4.2.2 行高inline-height
非置换元素可以设置，也可以被span、a、label影响，可置换元素或者行级块、行级表格子元素的margin盒子和vartical-align决定。

对于不可置换元素的行高，高为最上面的text-top到最下面的text-bottom（无论是单行还是多行），如果父级块元素不设置高，行内子元素line-height影响父元素的行高。

父为table-cell的时候，可以利用vertical-align控制内部子元素垂直居中（无论行级元素还是块级元素）

对于块级包含文本的行高，比如p标签嵌套一些文字的情况，默认是normal。这个normal是根据font-size大小来决定，块高稍大于font-size。同样的，对于多行的情况，是每一行加起来的和。每一种字体，已经确定了自身相应的高度，不同字体可能有很细微的差别。于是，我们可以设置line-height：1（或者100%），这样子就可以让字体饱满地填充块高。

# 5. 垂直方向的margin
前面已经说到outerHeigth的概念，也就是margin盒子。

居中条件是outerHeigth=line-height《=》vartical-align：top=bottom=0

还有我们都知道的垂直方向margin折叠：
![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c645242c2?w=923&h=253&f=png&s=28209)

用BFC或者float，margin就不会折叠了：
![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c7269446b?w=383&h=176&f=png&s=39900)

# 6.盒子模型
大家都知道的ie盒子和w3c盒子，有的人就说了，ie盒子这种旧东西，有什么意义？
其实，在响应式的情况下，比如50%宽，10pxpadding， ie盒子比w3c盒子更好了
ie：
![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c7a0da5d6?w=378&h=194&f=png&s=38028)

W3C：
![image](https://user-gold-cdn.xitu.io/2018/5/9/1634542c85161776?w=394&h=154&f=png&s=31474)
calc需要计算，所以性能上就稍微差了一点

现在bootstrap也是用ie盒子了，在响应式上比较容易操作。ie盒子，在关心盒子外部与外部整体的联系时候比较优；W3C盒子，在关心盒子内部的内容与外部的联系的时候比较优