# 0.前言
在MDN上面有一个[弹球](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Object_building_practice)的例子，我们的小球会在屏幕上弹跳，当它们碰到彼此时会变色。

# 1.面向对象编程的实践
官网讲得太长，而且有一些漏洞，我改进一下
```javascript
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let balls = [];
let ran = (min,max) =>parseInt((max-min)*Math.random())+min;//生成随机数

let Ball = function(vx,vy,x,y,r,color){//Ball的类
	this.vx = vx;
	this.vy = vy;
	this.x = x||1;//防止速度为0
	this.y = y||1;
	this.r = r;
	this.color = color;
}



Ball.prototype.draw = function(){//绘制的方法
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
	ctx.fill();
}

Ball.prototype.update = function(){//更新的方法
  if((this.x + this.r) >= width) {
  	this.x = width - this.r - 5;//防止半身进入边缘，无限循环，黏住边缘
    this.vx = -(this.vx);//反弹
  }

  if((this.x - this.r) <= 0) {
  	this.x = this.r + 5;
    this.vx = -(this.vx);
  }

  if((this.y + this.r) >= height) {
  	this.y = height - this.r - 5;
    this.vy = -(this.vy);
  }

  if((this.y - this.r) <= 0) {
  	this.y =  this.r + 5;
    this.vy = -(this.vy);
  }
  	this.x += this.vx;//小球前进
	this.y += this.vy;
}


Ball.prototype.isCollision = function() {//是否碰撞
  for(var j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {//保证不自己和自己碰撞，因为自己也在数组里面，现在是遍历数组
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var dvx = this.vx - balls[j].vx;
      var dvy = this.vy - balls[j].vy;
      var distance = Math.sqrt(dx * dx + dy * dy);
		if (distance <= this.r + balls[j].r) {
		balls[j].x -= 7*balls[j].vx;//防止相互纠缠
		balls[j].y -= 7*balls[j].vy;
      	this.x -= 7*this.vx;
      	this.y -= 7* this.vy;
        this.vx = -this.vx;
        this.vy = -this.vy;
        this.color = "#"+(~~(Math.random()*(1<<24))).toString(16);
      }
    }
  }
};

let loop = function(){
	ctx.fillStyle = 'rgba(0,0,0,.1)';//等于黑板擦，擦除前面动画留下的痕迹
  	ctx.fillRect(0,0,width,height);
	while(balls.length<40){//生成40个球
		let ball = new Ball(ran(-7,7),ran(-7,7),ran(0,width),ran(0,height),
		ran(10,20),"#"+(~~(Math.random()*(1<<24))).toString(16));
		balls.push(ball);
	}
	for(let i = 0;i<balls.length;i++){//每一个球调用函数，保证动画进行
		balls[i].draw();
		balls[i].update();
		balls[i].isCollision();
	}
	requestAnimationFrame(loop);
}
loop();
```

# 2.相互纠缠的现象
在面对碰撞检测后还有后续动作的情况，必须考虑一下相互纠缠的问题：
如果两个小球被检测到碰撞的时候，而且加上他们的速度下一步还是处于碰撞范围内，就像引力一样无法脱离，无限原地碰撞。这时候，需要其他小球碰撞来解散这种纠缠。有时候，可能3个小球都会一起进入无限纠缠的状态。（判断碰撞-是-速度反方向-远离-判断碰撞-速度反方向-靠近-判断碰撞-是-速度反方向-远离……无限循环）

![default](https://user-gold-cdn.xitu.io/2018/6/23/1642ad1ad2d30298?w=429&h=235&f=jpeg&s=7071)

# 3.解决方案
对于边界，防止黏住边界，我们可以重置它的位置，让他刚刚好离开边界，比如右边界
> this.x = width - this.r - 5//-5保证它绝对离开，-1有时候也会黏住，但1和5距离差别还是不大的

其他边界同理

对于两个小球，我们也是重置位置，这个重置的算法那个常数就看实际情况了。
```javascript
this.x -= 7*this.vx; //我这里，实践证明大于6才比较低概率发生纠缠
//而且6帧也刚刚好是游戏中的爆炸，那个瞬间有6帧，这样我们才感觉到存在这个瞬间
//我直接让他回退6帧，当然球的大小更大的，这个数字也更大
this.y -= 7* this.vy;
```
解决方案2：
可以给Ball构造函数再初始化一个值:this.isleave = true;
对于Ball.prototype.isCollision函数，我们改动一下，等到碰撞的时候，this.isleave变成false
```javascript
if(!this.isleave){
    if(distance> this.r + balls[j].r){
      this.isleave =true;//远离后
    }else{
       //do something
       return;
    }
}else if(distance <= this.r + balls[j].r){
   this.isleave = false;
  //前面的代码
}
```

# 4.模拟核裂变
碰撞的时候，旁边生成一个新的小球。
因为链式反应，可能会一瞬间就把浏览器炸了，所以我们限制小球数量
```javascript
//Ball.prototype.isCollision一部分更改
if (distance <= this.r + balls[j].r) {
		balls[j].x -= 7*balls[j].vx;
		balls[j].y -= 7*balls[j].vy;
      	this.x -= 7*this.vx;
      	this.y -= 7* this.vy;
        this.vx = -this.vx;
        this.vy = -this.vy;
        if(balls.length<30){//裂变到30个就停止
          let ball = new Ball(ran(-7,7),ran(-7,7),this.x-17*this.vx,this.y-17* this.vy,
          this.r,
          "#"+(~~(Math.random()*(1<<24))).toString(16));
          balls.push(ball);
        }
      }

//loop一部分更改
let loop = function(){
	ctx.fillStyle = 'rgba(0,0,0,.2)';
  	ctx.fillRect(0,0,width,height);
	while(balls.length<2){//初始两个球
		let ball = new Ball(ran(-7,7),ran(-7,7),ran(0,width),ran(0,height),
		ran(10,20),"#"+(~~(Math.random()*(1<<24))).toString(16));
		balls.push(ball);
	}
	for(let i = 0;i<balls.length;i++){
		balls[i].draw();
		balls[i].update();
		balls[i].isCollision();
	}
    requestAnimationFrame(loop);
}
```


# 5.大鱼吃小鱼
MDN上面说再生成一个eval（这里指的是这个会吃掉小球的敌人），是吃掉小球的。我这里把这个eval也设置成和小球是同一个类的，但是他的isCollision方法就有点不同，会把小球吃掉。为了保证无限循环，当小球被吃剩5个，eval就会爆炸，又生成原本那么多小球，继续循环。

```javascript
//对这个eval进行定义
Eval.prototype.draw = function(){
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
  ctx.fill();
}
Eval.prototype.update = Ball.prototype.update;
Eval.prototype.isCollision = function(){
   for(var j = 0; j < balls.length; j++) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= this.r + balls[j].r) {
          balls.splice(j,1)
          this.vx = -this.vx;
          this.vy = -this.vy;
          this.r += 1;
      }
   }
}
let e = new Eval(10,10,ran(0,width),ran(0,height),20,'#fff');

//初始30个球
while(balls.length<30){
  let ball = new Ball(ran(-7,7),ran(-7,7),ran(0,width),ran(0,height),
  ran(10,20),"#"+(~~(Math.random()*(1<<24))).toString(16));
  balls.push(ball);
}

//loop的改动
let loop = function(){
	ctx.fillStyle = 'rgba(0,0,0,.2)';
  	ctx.fillRect(0,0,width,height);
  if(balls.length<5){//少于5个，eval又是一个新的eval
    e = new Eval(10,10,e.x,e.y,20,'#fff');
    while(balls.length<30){//循环生成30个球
      let ball = new Ball(ran(-7,7),ran(-7,7),ran(e.x,e.x),ran(e.x,e.x),
      ran(10,20),"#"+(~~(Math.random()*(1<<24))).toString(16));
      balls.push(ball);
    }
  }else{
    e.draw();
    e.update();
    e.isCollision();
    
  }
  for(let i = 0;i<balls.length;i++){
    balls[i].draw();
    balls[i].update();
    balls[i].isCollision();
  }
  requestAnimationFrame(loop);
}
```
更加壮观，是不是？