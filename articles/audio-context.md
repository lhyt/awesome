> web页面能发出声音的方法有两种，一种是`autio`、`video`这些标签，另外一种就是音频上下文`AudioContext`。接下来我们看一下如何使用`AudioContext`，写简易钢琴和曲子。然后赶在七夕之前，给心爱的人作一首曲子吧

# 1. AudioContext如何发出声音
[Mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)上面有具体介绍，我们这里只用下面几个
```javascript
      // 创建音频上下文
      const audioCtx = new AudioContext();
      // 创建音调控制对象
      const oscillator = audioCtx.createOscillator();
      // 创建音量控制对象
      const gainNode = audioCtx.createGain();
      // 音调音量关联
      oscillator.connect(gainNode);
      // 音量和设备关联
      gainNode.connect(audioCtx.destination);
      // 音调类型指定为正弦波。sin好听一些
      oscillator.type = "sine";
      // 设置音调频率（作曲的关键）
      oscillator.frequency.value = 400;
      // 先把当前音量设为0
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      // 0.01秒时间内音量从0到1线性变化，突然变化的话很生硬
      gainNode.gain.linearRampToValueAtTime(
        1,
        audioCtx.currentTime + 0.01
      );
      // 声音开始
      oscillator.start(audioCtx.currentTime);
```

> 不，这还没完，直接copy这段代码放你js文件里面是没用的

![](https://user-gold-cdn.xitu.io/2019/8/6/16c65724f052e249?w=1244&h=70&f=png&s=30738)

这里还需要一步：地址栏中输入chrome://flags/#autoplay-policy，把autoplay-policy改成图中所示

![](https://user-gold-cdn.xitu.io/2019/8/6/16c6573b11bc1891?w=1990&h=450&f=png&s=76774)

ok，现在代码可以发出声音了，但是不会停下来，我们需要把音频停下来：
```javascript
oscillator.stop(audioCtx.currentTime + 1);
```

# 2. 简谱怎么来
现在我们知道怎么发出声音了，接下来是如何发出想要的声音，即是如何知道哆来咪发唆这些音所对应的频率是多少。

> 搜索关键词：简谱频率、乐谱频率。很快，就可以找到映射表格

![](https://user-gold-cdn.xitu.io/2019/8/6/16c6579418a95caa?w=1376&h=738&f=png&s=139832)

我们要做的就是把`oscillator.frequency.value = 400;`这里的数字改成频率即可发出对应的声音。不妨先试一下

# 3. 根据简谱映射表输出对应的音频
上面那个表抄了一份，具体如下，代表着低中高的哆来咪发唆啦希


<details>
<summary>点击查看简谱数组</summary>

```javascript
[[261.63, 293.67, 329.63, 349.23, 391.99, 440, 493.88], [523.25, 587.33, 659.26, 698.46, 783.99, 880, 987.77], [1046.5, 1174.66, 1318.51, 1396.92, 1567.98, 1760, 1975.52]]
```

</details>


只要把它和点击事件联系起来，就可以做到一个小钢琴了。先使用js渲染出每一个按键

```javascript
    // 简谱映射
    const VOICE_MAP = {
      0: [261.63, 293.67, 329.63, 349.23, 391.99, 440, 493.88],
      1: [523.25, 587.33, 659.26, 698.46, 783.99, 880, 987.77],
      2: [1046.5, 1174.66, 1318.51, 1396.92, 1567.98, 1760, 1975.52]
    };
    function renderBtns(level) {
      let i = 0;
      let res = "";
      while (i < 7) {
        res += `<span class="btn level${level}" data-index=${i}>${i +
          1}</span>`; // 用data-属性辅助
        i++;
      }
      const container = document.createElement("section");
      container.className = `container${level}`;
      // ------------------------
      // 等下这里会加一些事件绑定
      // ------------------------
      container.innerHTML += res;
      document.body.appendChild(container);
    }

    // 渲染节点
    renderBtns(0);
    renderBtns(1);
    renderBtns(2);

```
<details>
<summary>点击查看样式</summary>


```css
      .btn {
        cursor: pointer;
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        user-select: none;
        text-align: center;
        border: 1px #a12d21 solid;
        margin: 2px;
      }

      .level0::after {
        content: ".";
        position: relative;
        top: 4px;
        left: -7px;
      }

      .level2::before {
        content: ".";
        position: relative;
        top: -16px;
        left: 7px;
      }

```

</details>

最终效果如下
![](https://user-gold-cdn.xitu.io/2019/8/6/16c677ff2b5eadf1?w=1528&h=260&f=png&s=21218)

> 绑定事件

renderBtns方法加上事件绑定，移动端只需手动换成touch系列事件。
```javascript
    // 音频开始
    function handleStart({ target }, level) {
      const {
        dataset: { index }
      } = target;
      if (index !== undefined) {
        console.log(index, "start");
        playAudio.call(target, index, level); // 后面加上playAudio的实现
      }
    }

    // 停止音频
    function handleStop({ target }) {
      const {
        dataset: { index }
      } = target;
      if (index !== undefined) {
        console.log(index, "stop");
        stopAudio.call(target); // 后面加上stopAudio的实现
      }
    }

    function renderBtns(level) {
      let i = 0;
      let res = "";
      while (i < 7) {
        res += `<span class="btn level${level}" data-index=${i}>${i +
          1}</span>`;
        i++;
      }
      const container = document.createElement("section");
      container.className = `container${level}`;
      // 传入e和level，level指的是低中高音
      const particalStart = e => handleStart(e, level);
      container.addEventListener("mousedown", e => {
        particalStart(e);
        container.addEventListener("mouseout", handleStop);
      });
      container.addEventListener("mouseup", handleStop);
      container.innerHTML += res;
      document.body.appendChild(container);
    }
```
为什么使用call？后面`stopAudio`、`playAudio`用了this，这样子就可以做到dom节点与事件和音频一对一绑定了

# 4. 播放音频和停止音频
```javascript
    // 音频上下文
    const audioCtx = new AudioContext();

    function playAudio(index, level) {
      // 如果之前正在播，那就清掉之前的音频
      this.gainNode &&
        this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      this.oscillator && this.oscillator.stop(audioCtx.currentTime + 1);
      // 创建音调控制对象
      this.oscillator = audioCtx.createOscillator();
      // 创建音量控制对象
      this.gainNode = audioCtx.createGain();
      // 音调音量关联
      this.oscillator.connect(this.gainNode);
      // 音量和设备关联
      this.gainNode.connect(audioCtx.destination);
      // 音调类型指定为正弦波。sin好听一些
      this.oscillator.type = "sine";
      // 设置音调频率
      this.oscillator.frequency.value = VOICE_MAP[level][index]; // 读取相应的简谱频率
      // 先把当前音量设为0
      this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      // 0.01秒时间内音量从刚刚的0变成1，线性变化
      this.gainNode.gain.linearRampToValueAtTime(
        1,
        audioCtx.currentTime + 0.01
      );
      // 声音开始
      this.oscillator.start(audioCtx.currentTime);
    }

    function stopAudio() {
      this.gainNode &&
        this.gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.8
        );
      // 0.8秒内停止声音
      this.oscillator && this.oscillator.stop(audioCtx.currentTime + 0.8);
      this.oscillator = this.gainNode = null;
    }
```

<details>
<summary>以上全部js代码</summary>


```javascript
    const VOICE_MAP = {
      0: [261.63, 293.67, 329.63, 349.23, 391.99, 440, 493.88],
      1: [523.25, 587.33, 659.26, 698.46, 783.99, 880, 987.77],
      2: [1046.5, 1174.66, 1318.51, 1396.92, 1567.98, 1760, 1975.52]
    };

    function handleStart({ target }, level) {
      const {
        dataset: { index }
      } = target;
      if (index !== undefined) {
        console.log(index, "start");
        playAudio.call(target, index, level);
      }
    }

    function handleStop({ target }) {
      const {
        dataset: { index }
      } = target;
      if (index !== undefined) {
        console.log(index, "stop");
        stopAudio.call(target);
      }
    }

    function renderBtns(level) {
      let i = 0;
      let res = "";
      while (i < 7) {
        res += `<span class="btn level${level}" data-index=${i}>${i +
          1}</span>`;
        i++;
      }
      const container = document.createElement("section");
      container.className = `container${level}`;
      const particalStart = e => handleStart(e, level);
      container.addEventListener("mousedown", e => {
        particalStart(e);
        container.addEventListener("mouseout", handleStop);
      });
      container.addEventListener("mouseup", handleStop);
      container.innerHTML += res;
      document.body.appendChild(container);
    }

    renderBtns(0);
    renderBtns(1);
    renderBtns(2);

    // 音频上下文
    const audioCtx = new AudioContext();

    function playAudio(index, level) {
      // 如果之前正在播，那就清掉之前的音频
      this.gainNode &&
        this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      this.oscillator && this.oscillator.stop(audioCtx.currentTime + 1);
      // 创建音调控制对象
      this.oscillator = audioCtx.createOscillator();
      // 创建音量控制对象
      this.gainNode = audioCtx.createGain();
      // 音调音量关联
      this.oscillator.connect(this.gainNode);
      // 音量和设备关联
      this.gainNode.connect(audioCtx.destination);
      // 音调类型指定为正弦波。sin好听一些
      this.oscillator.type = "sine";
      // 设置音调频率
      this.oscillator.frequency.value = VOICE_MAP[level][index];
      // 先把当前音量设为0
      this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      // 0.01秒时间内音量从刚刚的0变成1，线性变化
      this.gainNode.gain.linearRampToValueAtTime(
        1,
        audioCtx.currentTime + 0.01
      );
      // 声音开始
      this.oscillator.start(audioCtx.currentTime);
    }

    function stopAudio() {
      // 0.8秒后停止声音
      this.gainNode &&
        this.gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.8
        );
      this.oscillator && this.oscillator.stop(audioCtx.currentTime + 0.8);
      this.oscillator = this.gainNode = null;
    }
```

</details>

现在，就是一个小钢琴了，可以随便弹奏自己的歌曲。那么，问题来了，想弹一首歌，该怎么按键？搜索：xxx简谱，对着弹即可

# 5. 自动播放
当然，对于程序员肯定想办法搞自动的。我们已经知道怎么输出想要的音频了，接下来就是如何将真正的歌曲以js的数据结构保存，并使用`AudioContext API`输出的事情了。我的实现是直接复用上面的事件绑定代码，使用脚本触发原生事件。当然还有很多其他方法实现。

```javascript
    // 先来一个sleep，肯定需要使用延迟的
    function sleep(delay = 80) {
      return new Promise(r =>
        setTimeout(() => {
          r();
        }, delay)
      );
    }
    /**
     * @params arr 歌谱数组
     * @example
     * { level: 0, index: 0 } 低音的哆
     * { stop: true } 下一个循环什么都没有
     * { delay: true } 下一个循环什么都不做
     */
    async function diyPlay(arr) {
      let cursor = 0;
      const a = [...arr];
      const containers = document.querySelectorAll("section");
      let ele;
      // 一个个遍历歌曲数组
      while (arr.length) {
        // 先延迟一下，就可以避免上一个音戛然而止了
        await sleep(300);
        const current = a.shift();
        // 留一个delay接口，即是延长一下上一个音
        if (current && current.delay) {
          continue;
        }
        // 下一个按键，停下之前的音
        if (ele) {
          // 手动用js触发原生事件停止音频
          const evPre = document.createEvent("MouseEvents");
          evPre.initMouseEvent("mouseout", true, true, window);
          ele.dispatchEvent(evPre);
        }
        if (!arr.length || !current) {
          return;
        }
        // 
        if (current.stop) {
          continue;
        }
        await sleep(50); // 加一点延迟使得多个连续相同的音自然一些
        const ev = document.createEvent("MouseEvents");
        ele = containers[current.level].children[current.index - 1];
        // 手动用js触发原生事件开始音频
        if (ele) {
          ev.initMouseEvent("mousedown", true, true, window);
          ele.dispatchEvent(ev);
        }
      }
    }
```

> 如何将简谱转化为可用数据结构

比如下面简谱：
![](https://user-gold-cdn.xitu.io/2019/8/7/16c67aa66397ee4a?w=284&h=60&f=png&s=9761)
转成上文的diyPlay函数所需要的数据结构
```javascript
[
      { level: 1, index: 3 }, 
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 1, index: 7 },
      { delay: true }, // 7后面延迟一下
      { level: 1, index: 7 }, 
      { level: 1, index: 6 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { delay: true }, // 6和6是连的，delay一下
      { stop: true }, // 一句唱完了，停一下
]
```
按照规律，我们随便搜一首歌抄一下就可以用代码输出了

于是，先上一首抖音歌曲吧：
```javascript
    // 《地铁等待》
    diyPlay([{"level":2,"index":3},{"level":2,"index":4},{"level":2,"index":5},{"level":2,"index":5},{"level":2,"index":5},{"level":2,"index":3},{"level":2,"index":2},{"level":2,"index":2},{"level":2,"index":5},{"delay":true},{"stop":true},{"stop":true},{"level":2,"index":1},{"level":2,"index":1},{"level":1,"index":7},{"level":2,"index":3},{"level":2,"index":3},{"level":2,"index":1},{"level":1,"index":7},{"delay":true},{"level":2,"index":3},{"delay":true},{"stop":true},{"stop":true},{"level":1,"index":6},{"level":2,"index":1},{"level":2,"index":1},{"level":1,"index":6},{"level":1,"index":5},{"level":1,"index":5},{"level":2,"index":1},{"delay":true},{"stop":true},{"stop":true},{"level":2,"index":4},{"level":2,"index":3},{"level":2,"index":1},{"level":2,"index":2},{"level":2,"index":3},{"delay":true},{"level":2,"index":2},{"stop":true},{"stop":true},{"level":2,"index":5},{"level":2,"index":5},{"level":2,"index":5},{"level":2,"index":3},{"level":2,"index":2},{"delay":true},{"level":2,"index":5},{"level":2,"index":5},{"level":2,"index":2},{"stop":true},{"stop":true},{"level":2,"index":1},{"level":2,"index":3},{"level":2,"index":3},{"level":2,"index":1},{"level":1,"index":7},{"delay":true},{"level":2,"index":3},{"stop":true},{"stop":true},{"level":1,"index":6},{"level":2,"index":1},{"level":2,"index":1},{"level":2,"index":6},{"level":1,"index":5},{"delay":true},{"level":1,"index":6},{"level":2,"index":1},{"level":2,"index":2},{"level":2,"index":3},{"stop":true},{"stop":true},{"level":2,"index":4},{"level":2,"index":3},{"level":2,"index":1},{"level":2,"index":2},{"delay":true},{"delay":true},{"stop":true}]);
```

<details>
<summary>《小幸运简谱代码》</summary>


```javascript
// 抄得匆匆忙忙，后面有一些不准确的
diyPlay([
      { level: 1, index: 3 }, // 我听见雨落在青青草地
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 7 }, 
      { level: 1, index: 6 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { delay: true },
      { stop: true },
      { level: 1, index: 6 }, // 我听见远方下课钟声响起
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { level: 1, index: 7 },
      { level: 2, index: 3 },
      { level: 2, index: 3 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 5 }, 
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { delay: true },

      { level: 1, index: 3 },// 可是我没有听见你的声音
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { level: 2, index: 1 },
      { delay: true },

      { level: 1, index: 7 }, 
      { delay: true },
      { level: 1, index: 7 },
      { level: 1, index: 6 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { delay: true },

      { level: 1, index: 6 }, // 认真呼唤我姓名
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { delay: true },
      { stop: true },
      { stop: true },
      { level: 1, index: 3 },// 爱上你的时候不懂感情
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 7 },
      { level: 1, index: 6 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { delay: true },
      { stop: true },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { level: 1, index: 7 },
      { level: 2, index: 3 },
      { level: 2, index: 3 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 5 },
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { delay: true },
      { stop: true },
      { level: 1, index: 3 },
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 7 },
      { level: 1, index: 6 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { delay: true },
      { stop: true },
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { level: 2, index: 3 },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { delay: true },
      { delay: true },
      { stop: true },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { delay: true },
      { level: 1, index: 7 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { delay: true },
      { level: 2, index: 2 },
      { stop: true },
      { stop: true },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 6 },
      { stop: true },
      { stop: true },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { delay: true },
      { level: 1, index: 3 },
      { level: 1, index: 5 },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { delay: true },
      { delay: true },
      { stop: true },
      { stop: true },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 1, index: 5 },
      { level: 1, index: 5 },
      { level: 1, index: 1 },
      { level: 1, index: 3 },
      { level: 1, index: 2 },
      { level: 1, index: 6 },
      { delay: true },
      { stop: true },
      { stop: true },
      { level: 1, index: 6 },
      { delay: true },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { level: 1, index: 6 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 1, index: 6 },
      { level: 2, index: 1 },
      { level: 1, index: 6 },
      { delay: true },
      { stop: true },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 2, index: 2 },

      { delay: true },
      { delay: true },
      { stop: true },
      { level: 1, index: 5 },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { level: 2, index: 2 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 1, index: 5 },
      { level: 2, index: 2 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 1, index: 5 },
      { level: 2, index: 2 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 2, index: 2 },
      { level: 2, index: 3 },
      { level: 2, index: 4 },
      // { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 1, index: 7 },
      // { stop: true },
      { level: 2, index: 1 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 2, index: 1 },
      { delay: true },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { level: 1, index: 7 },
      { level: 1, index: 7 },
      { level: 2, index: 3 },
      { level: 2, index: 5 }, 
      { level: 2, index: 3 },
      { level: 2, index: 1 },
      { level: 1, index: 7 }, 
      { level: 1, index: 6 }, 
      { level: 2, index: 4 },
      { level: 2, index: 4 },
      { delay: true },
      { level: 2, index: 5 },
      { level: 2, index: 4 },
      { level: 2, index: 3 },
      { level: 1, index: 5 },
      { level: 2, index: 3 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 4 },
      { level: 2, index: 3 },
      { level: 2, index: 1 },
      { level: 1, index: 4 },
      { delay: true },
      { level: 2, index: 2 },
      { level: 2, index: 2 },
      { delay: true },
      { level: 2, index: 2 },
      { delay: true },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 2 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 1, index: 5 },
      { level: 2, index: 2 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 1, index: 5 },
      { level: 2, index: 2 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 4 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 2, index: 1 },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 2, index: 1 },
      { delay: true },
      { level: 1, index: 3 },
      { level: 1, index: 6 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 7 },
      { level: 1, index: 7 },
      { level: 2, index: 3 },
      { level: 2, index: 5 },
      { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 1 },
      { level: 1, index: 7 },
      { delay: true },
      { level: 1, index: 6 },
      { level: 2, index: 4 },
      { level: 2, index: 4 },
      { delay: true },
      { stop: true },
      { level: 2, index: 5 },
      { level: 2, index: 4 },
      { level: 2, index: 3 },
      { level: 2, index: 5 },
      { level: 2, index: 3 },
      { delay: true },
      { level: 2, index: 3 },
      { delay: true },
      { stop: true },
      { level: 2, index: 4 },
      { level: 2, index: 3 },
      { level: 2, index: 1 },
      { level: 2, index: 4 },
      { level: 2, index: 2 },
      { level: 2, index: 2 },
      { delay: true },
      { delay: true },
      { level: 2, index: 3 },
      { level: 2, index: 1 },
      { level: 2, index: 1 },
      { level: 2, index: 3 },
      { level: 2, index: 2 },
      { delay: true },
      { level: 2, index: 1 },
      { delay: true },
    ]);
```

</details>



> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)