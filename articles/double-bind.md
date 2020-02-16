# 0.前言
用户最满意的，无非就是界面的操作能实事反应到数据。而实现这种的可以有双向数据绑定、单向数据流的形式。双向数据绑定是，ui行为改变model层的数据，model层的数据变了也能反映到ui上面。比如点击按钮，数字data+1，如果我们自己在控制台再给data+1，那么v层也能马上看见这个变化。而单向数据流就不同了，我们只有ui行为改变，data就改变并马上反馈到v层，而我们自己在控制台改变data这个值，v层居然不变（model是已经变了并没有反应），只能等到下一次ui行为改变，带上这个data结果一起处理。仅仅在V层的单向数据，真的能满足用户需求？数据很庞大的时候，双绑性能如何？其实，每一种都有每一种的适用场景，还是那句话，脱离实际场景谈性能，就是扯淡

# 1.单向数据（代表：react）
一般的过程：ui行为→触发action→改变数据state→mumtation再次渲染ui界面，通常就是基于view层，一个很简单的例子：
html部分：
```html
<input id="ipt" type="text" name="">
<p id="a"></p>
```
js部分：
```javascript
var str = ''
a.innerHTML = str//初始化
ipt.oninput = function(){//点击触发action
	str = ipt.value//改变state状态值
	a.innerHTML = str//重新渲染
}
```
但是如果在控制台获取input这个dom，在设置value，不会马上反映，只能等下一次带着这个结果一起作用。这仅仅是V->M的过程


我们再做一个超级简单的双绑：
html部分：
```html
<input id="ipt" type="text" name="">
<p id="a"></p>
```
js部分：
```javascript
var $scope = {
	data:''
}
a.innerHTML = ''
setInterval(function(){
	a.innerHTML = $scope.data
},60)
ipt.oninput = function(){
	 $scope.data = ipt.value
}
```
这里除了单向数据绑定，当你改变$scope.data，p标签的内容也是会马上改变。因为用了定时器，他会异步地将数据反映上去。

# 2.观察者模式
首先，我们先订阅事件，比如事件‘a’，回调函数是function （）{console.log（1）}，订阅后，如果事件‘a’被触发了，就调用回调函数。
```javascript
function Event(){
	this.list=[],
	this.on=function(key,cb){//订阅事件
		if(!this.list[key]){
			this.list[key] = []
		}
		this.list[key].push(cb)
	},
	this.emit = function(){//触发事件
		var key = Array.prototype.shift.call(arguments)
		var e = this.list[key]
		if(!e){
			return
		}
		var args = Array.prototype.slice.call(arguments)
		for(var i = 0;i<e.length;i++){
			e[i].apply(null,args)
		}
	}
}
```
尝试一下：
>
```
var a = new Event()
a.on('a',function(x){console.log(x)})
a.emit('a',1)//1
```
这样子，在1中单向数据的小例子，首先我们on里面加入事件a，回调是a.innerHTML = str，然后我们可以在改变model层的时候，顺便触发一下（emit（‘a’）），不就可以做到M->V的反映了吗？

对的，是行得通，可是这都是死的，也不能自动让他双向数据绑定，所以我们借用js底层的Object.defineproperty。

# 3.双绑的中间枢纽——Object.defineproperty（代表：vue）
在第二篇文章已经讲过，这里再重复一次：
```javascript
var obj = {name:'pp'}
console.log(obj.name)//pp
Object.defineProperty(obj,'name',{
      get:function(){
        return 1
      },
      set:function(newVal){
		console.log(newVal)
      }
    })
console.log(obj.name)//1
obj.name = 2;//2
console.log(obj.name)//1
```
这是vue双绑的核心思想，v层能让m层变了，m层也能让v层变了，只是不能互相关联起来，不能做到改变一个层另一个层也能改变。但是，现在就可以了。
html部分：
```html
<input id="ipt" type="text" name="">
<p id="a"></p>
```

```javascript
//js:
var data = {
	str:''
}
a.innerHTML = data.str//初始化
function E (){
	this.list=[],
	this.on=function(key,cb){//订阅事件
		if(!this.list[key]){
			this.list[key] = []
		}
		this.list[key].push(cb)
	},
	this.emit = function(){//触发事件
		var key = Array.prototype.shift.call(arguments)
		var e = this.list[key]
		if(!e){
			return
		}
		var args = Array.prototype.slice.call(arguments)
		for(var i = 0;i<e.length;i++){
			e[i].apply(null,args)
		}
	}
}
var e = new E()//实例化
e.on('change',function(x){//订阅change这个事件
	a.innerHTML = x
})
Object.defineProperty(data,'str',{
	set:function(newval){//当data.str被设置的时候，触发事件change
		e.emit('change',newval)
		return newval
	}
})
ipt.oninput = function(){
	data.str = ipt.value//用户的action
}
```

这下，不仅仅是有改变input的内容的单向的数据绑定，而且你还可以去控制台改变data.str=1，p标签的内容马上变成1，实现了双向数据绑定。
我们的例子其实不用观察者模式都可以实现双绑，但是在实际应用中肯定也不可以不用观察者模式，为了代码可读性和可维护性以及拓展性。具体的v-model实现在前面文章已经讲过

[点击跳转文章](https://github.com/lhyt/issue/issues/2)

到这里，你大概比较深入理解双向数据绑定是什么了。网上有很多人有vue双绑demo，但是他们有一部分是仅仅单向绑定的，不妨手动去控制台改一下那个核心绑定的数据，V层的显示内容能马上变化的就是双绑、不能马上有变化的只是单向数据

# 4. 脏值检测（代表：angular1）
# 前面说的定时器双绑是扯淡
前面特地埋了个坑，关于Angular脏检查，并不是一些人想象的那样子用定时器周期性进行脏检测（我前面写的那个超级简单的双绑就是人们传闻的angular）

只有当UI事件，ajax请求或者 timeout 等异步事件，才会触发脏检查。而我们前面的vue，当我们在控制台改了数据，就可以马上反映到v层。angular并没有这个操作，也没有意义。因为双绑的M->V一般就是基于ui行为、定时器、ajax这些异步动作，所以这就知道为什么ng-model只能对表单有效了。想做到像vue那样的极致双绑，能够在控制台改个数据就改变视图的，大概就只有defineproperty（听说新版vue现在用ES6的proxy了）和定时器轮询了吧。

在angular1中，私有变量以$$开头，$$watch是一个存放很多个绑定的对象的数组，用`$watch`方法来添加的，每一个被绑定的对象属性是：变量名、变量旧值、一个函数（用来返回变量新值）、检测变化的回调函数。
对于为什么使用一个函数来记录新值（类似vue的computed）？这样子可以每次调用都得到数据上最新的值，如果把这个值写死，不就是不会变化了吗？这是监控函数的一般形式：从作用域获取值再返回。
接着我们对`$scope`的非函数数据进行绑定，再到 核心的`$digest`循环，对于每一个`$$watch`里面的每一个watch,我们使用 `getNewValue()` 并且把scope实例 传递进去,得到数据最新值。然后和上一次值进行比较，如果不同，那就调用 getListener，同时把新值和旧值一并传递进去。 最终，我们把last属性设置为新返回的值，也就是最新值。`$digest`里会调用每个getNewValue()，因此，最好关注监听器的数量，还有每个独立的监控函数或者表达式的性能。
在作用域上添加数据本身不会有性能问题。如果没有监听器在监控某个属性，它在不在作用域上都无所谓。`$digest`并不会遍历作用域的属性，它遍历的是监听器。一旦将数据绑定到UI上，就会添加一个监听器。
最后，我们需要将新的变量值更新到DOM上，只要加上ng的指令，并解释，触发`$digest`循环即可
html:
```html
    <input type="text" ng-bind="s" />
    <div ng-bind="s"></div>
```


js:
```javascript
function Scope(){
        this.$$watchers=[];         //监听器
    }

    Scope.prototype.$watch=function(name,exp,listener){
        this.$$watchers.push({
            name:name,                              //数据变量名
            last:'',                                //数据变量旧值
            newVal:exp,                             //返回数据变量新值的函数
            listener:listener || function(){}       //监听回调函数，变量“脏”时触发
        })
    }

    Scope.prototype.$digest=function(){
        var bindList = document.querySelectorAll("[ng-bind]");      //获取所有含ng-bind的DOM节点
        var dirty=true;
        while(dirty){
            dirty=false;
            for(var i=0;i<this.$$watchers.length;i++){
                var newVal=this.$$watchers[i].newVal();
                var oldVal=this.$$watchers[i].last;
                if(newVal!==oldVal && !isNaN(newVal) && !isNaN(oldVal)){
                    dirty=true;
                    this.$$watchers[i].listener(oldVal,newVal);
                    this.$$watchers[i].last=newVal;
                    for (var j = 0; j < bindList.length; j++) {
                        //获取DOM上的数据变量的名称
                        var modelName=bindList[j].getAttribute("ng-bind");
                        //数据变量名相同的DOM才更新
                        if(modelName==this.$$watchers[i].name) {
                            if (bindList[j].tagName == "INPUT") {
                                //更新input的输入值
                                bindList[j].value = this[modelName];
                            }
                            else {
                                //更新非input的值
                                bindList[j].innerHTML = this[modelName];
                            }
                        }
                    }
                }
            }
        }
    };
        var $scope=new Scope();
        $scope.count=0;
        var inputList=document.querySelectorAll("input[ng-bind]");         
        for(var i=0;i<inputList.length;i++){
            inputList[i].addEventListener("input",(function(index){
                return function(){
                    $scope[inputList[index].getAttribute("ng-bind")]=inputList[index].value;
                    $scope.$digest();           //调用函数时触发$digest
                }
            })(i));
        }
        //绑定非函数数据
        for(var key in $scope){
            if(key!="$$watchers" && typeof $scope[key]!="function") {     
                $scope.$watch(key, (function (index) {
                    return function(){
                        return $scope[index];
                    }
                })(key))
            }
        }
        $scope.$digest();//第一次digest
```
当然，还会有一个问题，当有两个`$watch`循环监听（`watch1`监听`watch2`，`watch2`监听`watch1`），一个`$digest`循环执行很多次，而且是多余操作（并且可能把浏览器炸了）。
```javascript
var scope = new $scope();
scope.a = 5;
scope.b = 1;
scope.$watch('a', function(scope) {
  return scope[this.name]
 },
 function(newValue, oldValue) {
  scope.b ++;
 })
 
scope.$watch('b', function(scope) {
  return scope[this.name]
 },
 function(newValue, oldValue) {
  scope.a ++;
 })
```
angular有一个概念叫迭代的最大值：TTL（short for Time To Live）。这个值默认是10。因为digest经常被执行，而且每个digest运行了所有的$watch，再加上用户一般不会创建10个以上链状的监听器。
angular的处理办法是
```javascript
$scope.prototype.$digest = function() {
        var dirty = true;
        var checkTimes = 0;
         while(dirty) {
            dirty = this.$$digestOnce();
            checkTimes++;
             if(checkTimes>10 &&dirty){
                   throw new Error();
         }
     };
};
```

对于双绑，如果是大循环，循环改变一个值，vue的setter这种即时性的双绑就会在每一次循环都跑一次，而angular1的脏检测这种慢性双绑你可以控制在循环后才一次跑一次，性能取舍就看实际场景吧。
### 单向数据流和单向数据绑定是什么区别呢？
单向数据流，你得按照他的顺序办事。比如我们假设有一个这样的生命周期：1.从data里面读取数据2.ui行为（如果没有ui行为就停在这里等他有了为止）3.触发data更新4.再回到步骤1

改了一个数，v层不能反回头来找他来更新v层视图（从步骤2跳回去1），你得等下一个循环（转了一圈）的步骤1才能更新视图。react都是这样子，你得setState触发更新，如果你this.state = {...}，是没用的，他一直不变。

单向数据绑定，就是绑定事件，比如绑定oninput、onchange、storage这些事件，只要触发事件，立刻执行对应的函数。所以，不要再说一个input绑一个oninput，然后回调改变一个视图层数据就叫他双向数据绑定了。