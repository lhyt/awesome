# 0.前言
“孩子，你会唱diff算法吗”

“twinkle，twinkle，diff start”

# 1. 主角1：Element构造函数
先介绍一下虚拟dom的数据结构，我们都知道源码里面有createElement函数，通过他创建虚拟dom，然后调用render函数。还记得VUE脚手架住入口文件那句足够装逼的`h=>h(App)`吗，其实就是类似createElement(App)这样子的过程。我们看一下他简单的结构：
```javascript
createElement('ul',{class:'ul'},[
		createElement('li',{class:'li'},['1']),
		createElement('li',{class:'li'},['2'])
	])
```
 createElement (type, props, children)传入三个参数，节点类型、属性集合、子节点集合

```javascript
function Element(type, props, children) {
		this.type = type
		this.props = props
		this.children = children || []
}

function createElement (type, props, children) {
	return new Element(type, props, children)
}
```
复制代码，自己造两个节点打印一下，在控制台观察一下。

# 2. 主角2：render函数
这个就是把虚拟dom转化为真正的dom的函数。vue里面把虚拟节点叫做vnode，那我们翻版，也要翻版得像一点才行：
```javascript
function render (vnode) {
	let el = document.createElement(vnode.type)//创建html元素
	for(let key in vnode.props){//遍历虚拟dom的属性集合，给新建的html元素加上
		el.setAttribute(key, vnode.props[key])
	}
	vnode.children&&vnode.children.forEach(child=>{//递归子节点，如果是文本节点则直接插入
			child = (child instanceof Element) ? 
			render(child)://不是文本节点，则递归render
			document.createTextNode(child)
			el.appendChild(child)
		})
	return el
}
```
这个是真正的dom喔，是不是饥渴难耐了，那好，可以试一下`document.body.appendChild(el)`，看见新节点没

# 3. 大主角： diff函数
都虚拟dom了，还不diff干啥呢。
```javascript
function  diff (oldTree, newTree) {
	const patches = {}//差异表记录差异，这个记录一个树的所有差异
	let index = 0//记录开始索引，我们给节点编号用的
	dfswalk(oldTree, newTree, index, patches)//先序深度优先遍历，涉及到树的遍历，这是必须的
	return patches
}

//老节点、新节点、第几个节点、差异表
function dfswalk (oldNode, newNode, index, patches) {
	const currentPatch = []
	//...一系列写入差异的过程
	//最后将当前差异数组写入差异表
	currentPatch.length && (patches[index] = currentPatch)
}
```
## 3.1 结果预想
我们要的最终结果，大概是旧节点根据patches来变成新节点，最终结果的基本雏形：
```javascript
let el =  render(vnode)//老的虚拟dom树生成老html节点
document.body.appendChild(el) //挂载dom节点
let patches =  diff(vnode,newvnode) //对虚拟dom进行diff得到差异表
update (el, patches) //老节点根据差异表更新，这个函数包括了dom操作
```

## 3.2 深度优先搜索
我们现在要开始完善dfs内部的逻辑

考虑几种情况：
1. 两个节点类型一样，那我们应该对比他的属性和子节点（ATTR）
2. 两个节点类型不一样，我们把他视为被替换（REPLACE）
3. 两个节点都是文本节点，直接用等号比吧（TEXT）
4. 节点被删除（DELETE）
```javascript
function dfswalk (oldNode, newNode, index, patches) {
	const currentPatch = []
	if(!newNode){//判断节点是否被删除，记录被删的index
		currentPatch.push({type: 'REMOVE',index})
	}else if(typeof oldNode === 'string' && typeof newNode === 'string'){//处理文本节点
		if(oldNode !== newNode){
			currentPatch.push({type: 'TEXT',text:newNode})
		}
	}else if(oldNode.type === newNode.type){//如果节点类型相同
		//对比属性
		let patch = props_diff(oldNode.props, newNode.props)
		//如果属性有差异则写入当前的差异数组
		Object.keys(patch).length && (currentPatch.push({type: 'ATTR',patch}))
		//对比子节点
		children_diff(oldNode.children, newNode.children, index, patches)
	}else{//节点类型不同
		currentPatch.push({type: 'REPLACE',newNode})
	}
	//将当前差异数组写入差异表
	currentPatch.length && (patches[index] = currentPatch)
}
```

对比属性：

我们传入新节点和老节点的属性集合，进行遍历
```javascript
function props_diff(oldProp, newProp){
	const patch = {}
	//判断新老属性的差别
	for(let k in oldProp){
		//如果属性不同，写入patch，老属性有，新属性没有或者不同，写入差异表
		oldProp[k] !== newProp[k] && (patch[k] = newProp[k])
	}
	//新节点新属性
	for(let k in newProp){
		//判断老节点的属性在新节点里面是否存在，没有就写入patch
		!oldProp.hasOwnProperty(k) && (patch[k] = newProp[k])
	}	
	return patch
}
```

对比子节点：
```javascript
let allIndex = 0
function children_diff (oldChildren, newChildren, index, patches) {
	//对每一个子节点深度优先遍历
	oldChildren&&oldChildren.forEach((child,i)=>{
		//allIndex在每一次进dfs的时候要加一，作为唯一key。注意这个是全局的、共有的allIndex，表示节点树的哪一个节点，0是根节点，子节点再走一遍dfs
		dfswalk(child, newChildren[i], ++allIndex, patches)
	})
}
```

# 4. 更新
前面我们已经大概构思了一个最终雏形：`update (el, patches)`，我们顺着这条路开始吧
```javascript
let allPatches //全局存放差异表
//这里是真的html元素喔，接下来是dom操作了
function update (HTMLNode, patches) {//根据差异表更新html元素，vnode转换为真正的节点
	allPatches = patches
	htmlwalk(HTMLNode)//遍历节点，最开始从第一个节点遍历
}
```


```javascript
let Index = 0//索引从第一个节点开始，同上面的allIndex一样的道理，全局标记
function htmlwalk (HTMLNode) {
	const currentPatch = allPatches[Index++]//遍历一个节点，就下一个节点
	const childNodes = HTMLNode.childNodes
	//有子节点就后序深度优先遍历
	childNodes && childNodes.forEach(node=>{
		htmlwalk (node)
	})
	//对当前的差异数组进行遍历，根据差异还原元素
	currentPatch && currentPatch.length && currentPatch.forEach(patch=>{
		doPatch(HTMLNode, patch)//根据差异还原
	})
}
```

差异还原：
```javascript
function doPatch (node, patch) {//还原过程，其实就是dom操作
	switch (patch.type) {
		case 'REMOVE' ://熟悉的删除节点操作
		node.parentNode.removeChild(node)
		break
		case 'TEXT' ://熟悉的textContent
		node.textContent = patch.text
		break
		case 'ATTR' :
		for(let k in patch.patch){//熟悉的setAttribute
			const v = patch.patch[k]
			if(v){
				node.setAttribute(k, v)
			}else{
				node.removeAttribute(k)
			}
		}
		break
		case 'REPLACE' ://如果是元素节点，用render渲染出来替换掉。如果是文本，自己新建一个
		const newNode = (patch.newNode instanceof Element) ?
		render(patch.newNode) : document.createTextNode(patch.newNode)
		node.parentNode.replaceChild(newNode, node)
		break						
	}
}
```

# 5. 完成
已经完成了，我们试一下吧：
```javascript
//随便命名的，就别计较了
//创建虚拟dom
var v = createElement('ul',{class:'ul'},[
		createElement('li',{class:'li'},['a']),
		createElement('li',{class:'li1'},['b']),
		createElement('li',{class:'a'},['c'])
	])
//dom diff
var d = diff(v,createElement('ul',{class:'ul'},[
		createElement('li',{class:'li'},['aaaaaaaaaaa']),
		createElement('div',{class:'li'},['b']),
                createElement('li',{class:'li'},['b'])
	]))
//vnode渲染成真正的dom
var el =  render(v)
//挂载dom
document.body.appendChild(el)
//diff后更新dom
update (el, d)
```

##### 全部代码：（希望大家别来这里复制，一步步看下来自己做一遍是最好的）
```javascript
function Element(type, props, children) {
		this.type = type
		this.props = props
		this.children = children || []
}

function createElement (type, props, children) {
	return new Element(type, props, children)
}
//将vnode转化为真正的dom
function render (vnode) {
	let el = document.createElement(vnode.type)
	for(let key in vnode.props){
		el.setAttribute(key, vnode.props[key])
	}
	vnode.children&&vnode.children.forEach(child=>{//递归节点，如果是文本节点则直接插入
			child = (child instanceof Element) ? 
			render(child):
			document.createTextNode(child)
			el.appendChild(child)
		})
	return el
}
let allIndex = 0

function  diff (oldTree, newTree) {
	const patches = {}//差异表记录差异
	let index = 0//记录开始索引
	dfswalk(oldTree, newTree, index, patches)//先序深度优先遍历
	return patches
}

function dfswalk (oldNode, newNode, index, patches) {
	const currentPatch = []
	if(!newNode){//判断节点是否被删除，记录被删的index
		currentPatch.push({type: 'REMOVE',index})
	}else if(typeof oldNode === 'string' && typeof newNode === 'string'){//处理文本节点
		if(oldNode !== newNode){
			currentPatch.push({type: 'TEXT',text:newNode})
		}
	}else if(oldNode.type === newNode.type){//如果节点类型相同
		//对比属性
		let patch = props_diff(oldNode.props, newNode.props)
		//如果属性有差异则写入当前的差异数组
		Object.keys(patch).length && (currentPatch.push({type: 'ATTR',patch}))
		//对比子节点
		children_diff(oldNode.children, newNode.children, index, patches)
	}else{//节点类型不同
		currentPatch.push({type: 'REPLACE',newNode})
	}
	//将当前差异数组写入差异表
	currentPatch.length && (patches[index] = currentPatch)
}

function children_diff (oldChildren, newChildren, index, patches) {
	//对每一个子节点深度优先遍历
	oldChildren.forEach((child,i)=>{
		//index在每一次进dfs的时候要加一，作为唯一key
		dfswalk(child, newChildren[i], ++allIndex, patches)
	})
}

function props_diff(oldProp, newProp){
	const patch = {}
	//判断新老属性的差别
	for(let k in oldProp){
		//如果属性不同，写入patch
		oldProp[k] !== newProp[k] && (patch[k] = newProp[k])
	}
	//新节点新属性
	for(let k in newProp){
		//判断老节点的属性在新节点里面是否存在，没有就写入patch
		!oldProp.hasOwnProperty(k) && (patch[k] = newProp[k])
	}	
	return patch
}

let allPatches//根据差异还原dom，记录差异表
let Index = 0//索引从第一个节点开始
function update (HTMLNode, patches) {//根据差异表更新html元素，vnode转换为真正的节点
	allPatches = patches
	htmlwalk(HTMLNode)//遍历节点，最开始从第一个节点遍历
}

function htmlwalk (HTMLNode) {
	const currentPatch = allPatches[Index++]//遍历一个节点，就下一个节点
	const childNodes = HTMLNode.childNodes
	//有子节点就后序dfs
	childNodes && childNodes.forEach(node=>{
		htmlwalk (node)
	})
	//对当前的差异数组进行遍历，根据差异还原元素
	currentPatch && currentPatch.length && currentPatch.forEach(patch=>{
		doPatch(HTMLNode, patch)
	})
}

function doPatch (node, patch) {
	switch (patch.type) {
		case 'REMOVE' :
		node.parentNode.removeChild(node)
		break
		case 'TEXT' :
		node.textContent = patch.text
		break
		case 'ATTR' :
		for(let k in patch.patch){
			const v = patch.patch[k]
			if(v){
				node.setAttribute(k, v)
			}else{
				node.removeAttribute(k)
			}
		}
		break
		case 'REPLACE' :
		const newNode = (patch.newNode instanceof Element) ?
		render(patch.newNode) : document.createTextNode(patch.newNode)
		node.parentNode.replaceChild(newNode, node)
		break						
	}
}
```

过程差不多是这样子的。我写的有很多bug，别吐槽了，我懂，以后会更新的