# 0. 前言
本文基于5.5.11版本!

本文基于5.5.11版本!

本文基于5.5.11版本!

Rx指的是响应式编程的实践工具扩展——reactive  extension，编程风格是响应式编程+函数式编程。Rxjs则是这种模式的js的实现，处理异步能力优秀，将异步操作抽象为时间轴上的点。既可以当作像lodash那样的工具库来用，也可以用来统一管理数据流，他的出现解决了一些问题：

- 简化了代码
- 简短且具有良好的可读性
- 很好的处理异步

**[文档看这里](https://cn.rx.js.org/)**

# 1. Observable
Rxjs核心概念就是Observable，一个可观察对象，代表着接下来将要发生的一系列事件
```javascript
Rx.Observable.create(observer => {
        observer.next(1);
        observer.next(2);
        observer.next(3);
    })  // 数据源
    .map(x => x * 2)  // 操作符
    .subscribe(x => {console.log(x)})  // 订阅数据
```
Observable作为数据源产生数据，通过内部迭代器next一个个地产生数据，observer被动接受数据，经过一系列操作符处理，在下游用subscribe订阅数据源最终结果进行操作。**每次subscribe，create里面的observer就会调用一次**

# 2. 产生数据源
Observable.create：最原始的创建数据流的方法，其他方法其实是基于此方法的封装，一般用其他的都可以满足各种场景。每次最后subscribe都会执行一次create传入的函数
```javascript
Rx.Observable.create(observer => {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.error('err');
    observer.complete();
    observer.next(4); // 完成后不再监听error或者next
}).subscribe(console.log,
 err => {console.log('err', err)},
  () => {console.log('complete')})
```
创建同步数据流的基础方法of比较常用，还有其他的各种功能的产生数据源的方法如：repeat、generate、range、never、throw等（cold observable）

异步数据流常用方法：interval、timer、fromPromise、fromEvent、ajax等 （后面三者是hot observable）

# 3. Hot  & Cold Observable
- cold：subscribe后接受的是Observable**产生过的所有的**数据
- hot：subscribe后接受的是Observable**被subscribe后产生的**数据，之前的不算
```javascript
// cold
Rx.Observable.create(observer => {
    const producer = new Producer()
    // observer与producer关联起来
})


// hot
const producer = new Producer()
Rx.Observable.create(observer => {
    // observer与producer关联起来
})
```
每一次被subscribe，会触发Rx.Observable.create(observer)里面的observer函数。cold类型的是每一次都是一个新的生产者，所以它会把所有的数据都订阅。而hot类型是共享同一个生产者，所以只是订阅以后的数据

#### 来个例子：
先来一个生产者类：
```javascript
class Producer {
    constructor(init) {
        this.num = init
    }
   connect(observer) {
        this.observer = observer
        return this
    }
    add() {
        setInterval(() => {
            this.num += 1
            this.observer && this.observer.next(this.num)
        }, 1000)
        return this
    }
}
```

hot：
```javascript
const p = new Producer(10)
const producing = p.add()
const ob = Rx.Observable.create(observer => {
    producing.connect(observer)
})

setTimeout(() => {
    ob.subscribe(x => console.log('p1',x))  
}, 1000);
setTimeout(() => {
    ob.subscribe(x => console.log('p2',x))  
}, 3000);
setTimeout(() => {
    ob.subscribe(x => console.log('p3',x))  
}, 5000);
```

cold：
```javascript
const ob = Rx.Observable.create(observer => {
    const p = new Producer(10)
    const producing = p.add()
    producing.connect(observer)
})

setTimeout(() => {
    ob.subscribe(x => console.log('p1',x))  
}, 1000);
setTimeout(() => {
    ob.subscribe(x => console.log('p2',x))  
}, 3000);
setTimeout(() => {
    ob.subscribe(x => console.log('p3',x))  
}, 5000);
```
cold类型的，所有的订阅者都会从头到尾接收到所有的数据(每一次订阅都new一个生产者)；而hot类型只接受订阅后的产生的数据（所有的订阅共享生产者）

# 5. 操作符
一个Observable对象代表一个数据流，对于实际应用上的一些复杂的问题，我们当然不直接subscribe数据流，而是先让它经过一系列处理再subscribe。这个一系列的处理就是通过操作符来处理
![image](https://user-gold-cdn.xitu.io/2018/9/18/165e896d8e024f12?w=788&h=259&f=png&s=69848)
- 接受上游的数据，经过处理流到下游
- 来自上游可能是源头、可能是其他操作符甚至其他流
- 返回的是新的Observable，整个过程链式调用

## 操作符的实现
- 链式调用：返回this、返回同类实例
- 函数式编程：纯函数、无副作用
那么很容易推理出来，底层实现是返回新的Observable对象，而rx世界中一切产生数据源的方法都是基于create封装，操作符返回的对象还具有subscribe方法。
```javascript
Rx.Observable.myof = function(...args) {
  return new Rx.Observable.create(observer => {
    args.forEach(arg => {
      observer.next(arg)
    })
  })
}

Rx.Observable.prototype.mymap = function(fn) {
  return new Rx.Observable(observer => {
    this.subscribe({
      next: x => observer.next(fn(x))
    })
  })
}

Rx.Observable.myof(1,2,3).mymap(x => x*2).subscribe(console.log)

```

# 6. 弹珠图
用弹珠图看rx的数据流，特别形象而且容易理解，下面看一下例子：
```javascript
const source1$ = Rx.Observable.interval(500).map(x => 'source1: ' + x).take(5)
const source2$ = Rx.Observable.interval(1000).map(x => 'source2: ' + x).take(5)
const source3$ = Rx.Observable.of(1, 2, 3)
source1$.merge(source2$).concat(source3$).subscribe(console.log)
```
merge是将两个数据流按时间轴顺序合并起来，concat是把数据流连接到前面一个数据流后面（不管时间轴顺序）
![image](https://user-gold-cdn.xitu.io/2018/9/18/165e896d8e16aa85?w=1007&h=382&f=png&s=104524)

很显而易见，输出结果是0012314234, 123

# 7. Subject
在Rxjs中，有一个Subject类型，它具有Observer和Observable的功能，不仅可以使用操作符，还可以使用next、error、complete，但是本身不是操作符

```javascript
// 看了前面的描述，那么我们用的时候想产生数据源，很容易就会想到这样的方法：
let obs;
Rx.Observable.create(observer => {
    obs = observer
}).subscribe(console.log)
obs.next(123)
```
但是，说好的函数式编程，不能有副作用，是纯函数，因此需要subject了
```javascript
const subject = new Rx.Subject()
subject.map(x => x * 2).subscribe(console.log)
subject.next(1)
subject.next(2)
subject.complete()
```
但是subject擅长于连接的特性，更重要的是用来做多播(一个对象被多个对象订阅)：
```javascript
const source$ = Rx.Observable.interval(1000).take(3);// 从0开始每秒输出一个数，输出三个
source$.subscribe(x => {console.log('source1', x)})
setTimeout(() => {
    source$.subscribe(x => {console.log('source2', x)})
}, 1100);
```
那么，问题来了，下面的输出结果是：
```javascript
const source$ = Rx.Observable.interval(1000).take(3);// 从0开始每秒输出一个数，输出三个
source$.subscribe(x => {console.log('source1', x)})
setTimeout(() => {
    source$.subscribe(x => {console.log('source2', x)})
}, 1100);
```
"source1先打印0，一秒后source1和2都打印1，再一秒后都打印3"

"恭喜答错了。**interval产生cold observable**，数据源来自外部的才是hot（几个Fromxx的都是hot类型的），一对多的多播当然是要hot observable的，cold的订阅一次就从新的Observable开始了。"

实际上答案应该是source1先打印0，后面两秒source1和2分别打印10、21，最后source2打印2。那么要实现上面那个理想的答案，应该用上subject。因为有一个关键点，**subject状态唯一而统一**，被自身实例subject.complete过后，再次subject.next也是无法被subscribe了。

我们利用一下subject就可以优雅而且不违反函数式编程规则来实现这个功能：
```javascript
const source$ = new Rx.Subject();
let i = 0;
const time = setInterval(() => {
    if (i === 2) {
        clearInterval(time)
    }
    source$.next(i ++)
}, 1000)
source$.subscribe(x => {console.log('s1', x)})
setTimeout(() => {
    source$.subscribe(x => {console.log('s2', x)})
}, 1100);

```

当然，我们还没发挥Rxjs的api作用，我们还可以用multicast来连接subject实例
```javascript
const source$ = Rx.Observable.interval(1000).take(3).multicast(new Rx.Subject());
source$.subscribe(x => {console.log('source1', x)})
setTimeout(() => {
    source$.subscribe(x => {console.log('source2', x)})
}, 1100);
source$.connect() //需要手动调用， 不然前面代码不会有结果
// 这才是source1先打印0，一秒后source1和2都打印1，再一秒后都打印3的情况
```
# 总结
##### 知识点：
>1. Observable.create(observer => {})是创建数据流基础方法，里面的observer有next、error方法吐出数据，complete方法表示完成整个过程（相当于empty操作符），当complete后，这个observer吐出的数据再也不能被下游subscribe到。每一次被subscribecreate里面的函数都会调用一次
>2. hot Observable是只订阅subscribe后的数据，cold Observable订阅这个Observable从头到尾产生过的数据。这是因为hot共享生产者，cold的是每一次subscribe都是一个新的生产者
>3. Subject具有Observable和observer的功能，所以我们就不用违反函数式编程的规则从外面拿到observer对象操作next了，可以直接用Subject的实例
>4. 看文档，看各种操作符，如何链式调用，画弹珠图理解，你懂的

##### 优点和特点
- Rxjs以Observable为核心，全程通过发布订阅模式实现订阅Observable的变化进行一系列操作
- 函数式+响应式编程，中间的操作符链式操作由next迭代器模式实现，并且由于是纯函数所以每一次返回一 个新的Observable实例
- 在某些程度，可以单纯拿出Observable一套当作像lodash、underscore这种工具库使用
- Rxjs将所有的异步和同步数据流抽象成放在时间轴上处理的数据点，可以通过弹珠图清晰理解整个数据流过程，处理异步的能力优秀
- 每一个数据流经过各种操作符操作，多个数据流协同、合并、连接，使得整个Rxjs应用在显得流程清晰

##### 缺点：

1. api较多，学习成本高，比较抽象
2. 代码简洁以链式操作为主，维护性不如传统的面向对象+模块化
3. 库比较庞大，简单问题需要引入一系列api使得项目文件体积变大，就算按需引入也比其他库大