# 0. 前言
广度优先搜索(BFS)和深度优先搜索(DFS)，大家可能在oj上见过，各种求路径、最短路径、最优方法、组合等等。于是，我们不妨动手试一下js版本怎么玩。

# 1.队列、栈
队列是先进先出，后进后出，常用的操作是取第一个元素（shift）、尾部加入一个元素（push）。

栈是后进先出，就像一个垃圾桶，后入的垃圾先被倒出来。常用的操作是，尾部加入元素（push），尾部取出元素（pop）

# 2.BFS
BFS是靠一个队列来辅助运行的。顾名思义，广度搜索，就是对于一个树形结构，我们一层层节点去寻找目标节点。
![image](https://user-gold-cdn.xitu.io/2018/4/28/1630b710efb813ad?w=506&h=277&f=png&s=29271)
按照这个顺序进行广度优先遍历，明显是队列可以完美配合整个过程：
1. 1进队列 【1】
2. 取出队列第一个元素1，将1的子节点234按顺序加入队列后面 【2，3，4】
3. 取出队首元素2，将他的子节点按顺序加入队列 【3，4，5，6】
4. 取出3，将子节点7加入 【4，5，6，7】
5. 取出4，将子节点89加入【5，6，7，8，9】
6. 取出5，没有子节点，没有什么干
7. 继续一个个取出

到了最后，队列清空，树也遍历了一次

# 1.1 矩阵形式的图的遍历
假设有几个点，我们需要设计一个算法，判定两个点有没有相通

假设点12345是这样的结构：
![image](https://user-gold-cdn.xitu.io/2018/4/28/1630b710efe1c12c?w=519&h=396&f=png&s=21212)

问：1能不能到达5

显然我们一眼看上去是不会到达的，如果是设计算法的话，怎么做呢？

我们把点之间的关系用一个矩阵表示，0表示不连接，n行m列的1表示点n通向点m

```javascript
var map = [ 
[0,1,1,0,0],
[0,0,1,1,0],
[0,1,1,1,0],
[1,0,0,0,0],
[0,0,1,1,0]
]
```


```javascript
function bfs(arr,start,end){
	var row = arr.length
	var quene = []
	var i = start
	var visited = {}//记录遍历顺序
	var order = [] //记录顺序，给自己看的
	quene.push(i) //先把根节点加入
	while(quene.length){ //如果队列没有被清空，也就是还没遍历完毕
		for(var j = 0;j<row;j++){
			if(arr[i][j]){ //如果是1
				if(!visited[j]){
					quene.push(j)//队列加入未访问
				}
			}
		}
		quene.shift()//取出队列第一个
		visited[i] = true//记录已经访问
		while(visited[quene[0]]){
			quene.shift()
		}
		order.push(i)//记录顺序
		i = quene[0]
	}
	return {visited:visited,result:!!visited[end],order:order}
}
bfs(map,0,4)
```

# 1.2 树的BFS举例
举个例子，3月24号今日头条笔试题第二题的最少操作步数：
>定义两个字符串变量：s和m，再定义两种操作，
第一种操作：
m = s;
s = s + s;
第二种操作：
s = s + m;
假设s, m初始化如下：
s = "a";
m = s;
求最小的操作步骤数，可以将s拼接到长度等于n
输入一个整数n，表明我们需要得到s字符长度，0<n<10000
案例：
in:
6
out:
3


思路：利用广度优先搜索，假设左节点是操作1，右节点是操作2，这样子就形成了操作树。利用bfs的规则，把上层的父节点按顺序加入队列，然后从前面按顺序移除，同时在队列尾部加上移除的父节点的子节点。我这里，先把父节点拿出来对比，他的子节点放在temp，对比完了再把子节点追加上去

![image](https://user-gold-cdn.xitu.io/2018/4/28/1630b710efc93f64?w=476&h=480&f=png&s=30269)
每个节点分别用两个数记录s，m。发现第一次两种操作是一样的，所以我就略去右边的了
```javascript
function bfs(n){
	if(n<2||n!==parseInt(n)||typeof n !=='number') return
	if(n==2) return 1
	var quene = [[2,1]]//从2开始
	var temp = []//存放父节点队列的子节点
	var count = 0
	var state = false//判断是否结束循环
	while(!state){
		while(quene.length){//如果队列不是空，从前面一个个取，并把他的子节点放在temp
			var arr = quene.pop()
			if(arr[0]==n){//找到了直接结束
				state = true
				break
			}
				temp.push([arr[0]*2,arr[1]*2])
				temp.push([arr[0]+arr[1],arr[1]])
		}
		count++//队列已经空，说明这层的节点已经全部检索完，而且子节点也保存好了
		quene = [...temp]//队列是子节点所有的元素集合,重复前面操作
		temp = []
	}
	return count
}
```

# 3.DFS
DFS着重于这个搜索的过程，一般以“染色”的形式配合栈来运行，也比较彻底。V8老生代的垃圾回收机制中的标记-清除也利用了DFS。我们定义三种颜色：黑白灰，白色是未处理过的，灰是已经经过了但没有处理，黑色是已经处理过了
还是前面那幅图
![image](https://user-gold-cdn.xitu.io/2018/4/28/1630b710efb813ad?w=506&h=277&f=png&s=29271)

我们用两个数组，一个是栈，一个是保存我们遍历顺序的，数组的元素拿到的都是原对象树的引用，是会改变原对象的节点颜色的

1. 从根节点开始，把根节点1压入栈，染成灰色 【1：灰】
2. 发现1的白色子节点2，压入栈染色【1：灰，2：灰】
3. 发现2的白色子节点5，入栈染色【1：灰，2：灰，5：灰】
4. 发现5没有白色子节点，于是5已经确认是遍历过的，5出栈染黑色【1：灰，2：灰】，【5：黑】
5. 回溯2，发现2还有白色子节点6，6入栈染灰，发现6没有子节点，6出栈染黑色，【1：灰，2：灰】，【5：黑，6：黑】；又发现2没有白色子节点，2出栈染黑色【1：灰】，【5：黑，6：黑，2：黑】
6. 2又回溯1，发现1还有白色子节点3，3入栈染灰【1：灰，3：灰】，【5：黑，6：黑，2：黑】
7. 同样的，7没有白色子节点，7入栈直接出栈染黑，【1：灰，3：灰】，【5：黑，6：黑，2：黑，7：黑】；3没有白色子节点【1：灰】出栈染黑，【5：黑，6：黑，2：黑，7：黑，3：黑】
8. 到了4，【1：灰，4：灰】，他有白色子节点89，而89没有白色子节点，所以89入栈又直接出栈了【1：灰，4：灰】，【5：黑，6：黑，2：黑，7：黑，3：黑，8：黑，9：黑】
9. 4这次就没有白色子节点了，到他出栈染黑，【1：灰】，【5：黑，6：黑，2：黑，7：黑，3：黑，8：黑，9：黑，4：黑】
10. 回溯，发现1没有白色子节点，最后1出栈染黑，【5：黑，6：黑，2：黑，7：黑，3：黑，8：黑，9：黑，4：黑，1：黑】

我们可以看到，入栈的时候，从白色染灰色，出栈的时候，从灰色到黑色。整个过程中，染黑的顺序类似于二叉树的后序遍历

v8的垃圾回收，将持有引用的变量留下，没有引用的变量清除。因为如果持有引用，他们必然在全局的树中被遍历到。如果没有引用，那这个变量必然永远是白色，就会被清理

我们用对象来表示上面这棵树：
```javascript
var tree = {
	val: 1,
	children: [
		{val: 2,children: [{val:5,children:null,color:'white'},{val: 6,children:null,color:'white'}],color:'white'},
		{val: 3,children: [{val: 7,children:null,color:'white'}],color:'white'},
		{val: 4,children: [{val:8,children:null,color:'white'},{val: 9,children:null,color:'white'}],color:'white'}
	],
	color: 'white'
}
```

开始我们的DFS：
```javascript
function dfs ( tree ) {
	var stack = []//记录栈
	var order = []//记录遍历顺序
	!function travel (node) {
		stack.push(node)//入栈
		node.color = 'gray'
		console.log(node)
		if(!node.children) {//没有子节点的说明已经遍历到底
			node.color = 'black'
			console.log(node)
			stack.pop()
			order.push(node)
			return
		}
		var children = node.children	
		children.forEach(child=>{
			travel(child)
		})
		node.color = 'black'
		stack.pop()//出栈
		order.push(node)
		console.log(node)
	}(tree)
	return order
}
```
过程用递归比较简单，上面大部分代码都是调试代码，自己可以改一下测试其他的类似场景。遍历完成后，tree上面每一个节点都是黑色了。遍历中间过程，每一个节点入栈的时候是灰色的，出栈的时候是黑色的。


# 后续更新（2019-10）
写此文章的时候，水平低了一些，有一个实战的例子可以见[另一篇文章](https://juejin.im/post/5d3496c8e51d4577596487bb#heading-3)，代码更加优雅简洁