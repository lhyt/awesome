> 游戏中，怪会追着主角打，那么这个追逐的过程是怎么实现的呢？我们来从0开始试一下

# 1. 主角与怪的位置与速度矢量
主角和怪有如下关系，主角和怪的直线斜率为tanθ
![image](https://user-gold-cdn.xitu.io/2019/8/8/16c6cec65c4cc9b0?w=816&h=430&f=png&s=54657)

假设怪的速度为v，那么一个时刻内，怪的x坐标变化：`Δ x = v * cosθ`，y坐标变化：`Δ y = v * sinθ`。注意，sin和cos是有正负的。于是，我们开始解方程求出sin和cos的值：
```md
sin^2 + cos^2 = 1
tan = sin / cos = k = (y - y1) / (x - x1) ······ 已知

解得
cos = ± √[1/(tan ^2 + 1)]
sin = ± √[tan ^2/(tan ^2 + 1)]
```

接下来就是sin和cos正负的问题了，满足如下关系
```md
sin < 0, cos < 0 | sin < 0, cos > 0
----------------敌人------------------
sin > 0, cos < 0 | sin > 0, cos > 0
```

所以我们只需要判断怪在主角哪个方向就知道了sin和cos的正负了

# 2. canvas与面向对象
html部分，就一个canvas标签就好，
```js
    // 一顿基本操作
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
```

canvas面向对象的开发模式，大概的步骤：
- 使用requestanimationframe来一帧帧绘制动画，每一个元素是一个基类实例化而来
- 每一个元素的每一帧需要draw(画元素)、update(更新元素位置给下一次用)
- 有时候需要边缘检测、碰撞检测

核心元素类
```js
    class Element {
      constructor({ v, x, y, r, color, target, width, height, ...rest }) {
        this.v = v || 1; // 防止速度为0
        this.v0 = this.v; // 备份使用的速度重置
        this.x = x || 1; // 位置
        this.y = y || 1;
        this.r = r; // 半径
        this.color = color; // 球的颜色
        this.target = target; // 攻击目标
        this.width = width; // 攻击目标
        this.height = height; // 攻击目标
        Object.assign(this, rest); // 多余的属性都assign进来
      }

      draw(ctx) {
        // 画圆
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = this.color;
      }

      checkEdge() {
        // 如果出边缘了，那就弹回来
        const d = this.r; // 调节参数，根据情况修改。碰撞边缘的时候坐标减少来矫正
        if (this.x + this.r >= this.width) {
          this.x = this.width - this.r - d; //防止半身进入边缘，无限循环，黏住边缘
          this.v = -this.v; //反弹
        }

        if (this.x - this.r <= 0) {
          this.x = this.r + d;
          this.v = -this.v;
        }

        if (this.y + this.r >= this.height) {
          this.y = this.height - this.r - d;
          this.v = -this.v;
        }

        if (this.y - this.r <= 0) {
          this.y = this.r + d;
          this.v = -this.v;
        }
      }

      update() {
        if (!this.target) {
          return;
        }
        const { x: meX, y: meY } = this.target;
        // 追逐主角算法
        if (this.x === meX) {
          // 处理tan90度
          this.y += (meY < this.y ? -1 : 1) * this.v;
        } else {
          const tan = (this.y - meY) / (this.x - meX);
          // 确保符号的正确
          const cos = (meX < this.x ? -1 : 1) * Math.sqrt(1 / (tan * tan + 1));
          const sin = (meY < this.y ? -1 : 1) * Math.sqrt((tan * tan) / (tan * tan + 1));

          this.x += this.v * cos;
          this.y += this.v * sin;
        }
        // 边缘矫正
        this.checkEdge();
      }

      isCollision() {
        if (!this.target) {
          return;
        }
        const { x: meX, y: meY } = this.target;
        const v0 = this.v || this.v0;
        let isCrash;
        //是否碰撞
        const distance = getDistance(this.x, this.y, meX, meY);
        if (distance <= this.r + this.target.r) {
          this.v = 0;
          isCrash = true;
        }
        // 没碰的，重置为原速度
        if (!isCrash) {
          this.v = v0;
        }
      }
    }
     // 主角类
    class Me extends Element{
      update() { // 主角就随便动吧
        this.y += this.v;
        this.x += this.v;
        this.checkEdge();
      }
    }

    // 两点坐标
    function getDistance(x, y, x1, y1) {
      const dx = x - x1;
      const dy = y - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }
```
元素类就这样，接下来就可以让动画走起来了
# 3. 渲染方法
```js
    // 生成随机数
    const ran = (min, max) => parseInt((max - min) * Math.random()) + min;

    // 主角
    const me = new Me({
      v: 10,
      x: ran(0, width),
      y: ran(0, height),
      r: 20,
      color: "#f00",
      width, // 活动范围
      height,
    });

    // 敌人数组
    const enemies = Array.from({ length: 3 })
      .map(() => new Element({
        v: ran(1, 7),
        x: ran(0, width),
        y: ran(0, height),
        r: ran(10, 20),
        color: '#' + (~~(Math.random() * (1 << 24))).toString(16),
        target: me, // 主角是目标
        width,
        height,
      }));

    const loop = () => {
      //等于黑板擦，擦除前面画面重新画过
      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, width, height);

      // 每一个元素的渲染
      me.draw(ctx);
      me.update();
      me.isCollision();

      enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
        enemy.isCollision();
      });
      requestAnimationFrame(loop);
    };

    loop();
```
运行代码，都追着主角走的效果出来了
![image](https://user-gold-cdn.xitu.io/2019/8/8/16c6cec65aa3abc4?w=2368&h=948&f=png&s=135905)
