# 0. 前言
先丢个大家都看过的[阮一峰es6链接](http://es6.ruanyifeng.com/#docs/proxy)。最常用的方法：
```
const obj = new Proxy(obj1, {
  get(target, name){...},
  set(target, name, newval){...},
})
```
类似`Object.defineProperty`的set和get，拦截set和get操作进行一些其他逻辑。但是proxy操作的是一个新的代理对象，是对原对象的一个代理。

# 1. 拦截展示结果
最近做一个活动页，react全家桶。第一期没什么，在展示课程的时候，一个展示组件很常规的在render函数的过滤操作：
```javascript
      this.props.courses.filter(...).map((course, idx) => {
        const { course_name: courseName, real_price: realPrice, course_id: courseId  } = course;
        const courseSetting = { courseName, realPrice, courseId, cashback, idx };
        return (
          <Course
            {...courseSetting}
          />
        );
      }
```
后来，第二期来了：活动id是2的要展示合辑，活动3要展示有效期的，活动4要...
> 于是，几种想法突然浮现出来：
- filter里面写各种if或者switch？太蠢了
- 写个map映射？但是可能不是每次都有明显的规律或者简单的过滤
- 另外封装一个函数，再if和其他逻辑？还是太常规了，如果后面的filter复杂到依赖其他props呢？
- 难道，就这样了吗，不能改变现状了吗，天天封装各种函数写if吗？

忽然想到`Proxy`，在`constructor`里面做个代理：
```javascript
    this.display = new Proxy(this.props, {
      get(target, name) {
        if (name === 'courses') {
          if (props.aid === 2) { // 这里就简简单单的filter
            const specialCourse = props.courses.filter(x => x.course_id === 0);
            if (specialCourse.length === 1) { // 理论上这里是多余判断，但是能防止运营后台错误配置
              return specialCourse;
            }
          } else if (props.aid === 3 && !props.courses) { // 省去了this.props.course && this.props.course.length判断以及数组长度为0的判断
            return [{
              noCourse: true,
            }];
          }
        }
        return target[name];
      },
    });
```
2期我们就展示那个id是0的合辑，3期我们会在没课程的时候展示一个新的卡片，而返回的还是一个数组就不用`if return`了，我们下面render函数也就改个变量和加个`noCourse`：
```javascript
      this.display.courses.map((course, idx) => {
        const { course_name: courseName, real_price: realPrice, course_id: courseId, noCourse  } = course;
        const courseSetting = { courseName, realPrice, courseId, cashback, idx, noCourse };
        return (
          <Course
            {...courseSetting}
          />
        );
      }
```
后面在Course组件里面有切换`className`的`classnames`库（用react开发应该会接触到：[链接](https://www.npmjs.com/package/classnames)），而文案我这里是用伪元素抓取的，所以也省去了`if return`的代码。后期无论活动要干什么，只要前面把props丢过来就是了，proxy会处理，最后返回一个数组。我们只要在上一层组件加state甚至直接把cgi请求的结果都丢过来，下面一层proxy加逻辑，Course组件加样式就可以了。整个过程总的来说省了一些if以及render函数简化，不过更复杂的情况Course组件里面还是要写`if return`了。

另一个例子：一个有点复杂的页面，根据后台返回的几十个字段渲染一个列表。这里我们就看底部文案：已购买、已结束、xx人购买、xx时候开始等等，而且有不同样式与Icon：
![image](https://user-gold-cdn.xitu.io/2018/12/8/1678b9766b20c428?w=218&h=472&f=png&s=57265)
![image](https://user-gold-cdn.xitu.io/2018/12/8/1678b9766b4cab8e?w=198&h=424&f=png&s=49159)
上一部分proxy里面的switch分支代码：
```javascript
      switch (name) {
          case 'hint':
            if (target.applied === 1) {
              return '已购买';
            }
            if (sb > now) {
              return `${formatDate('YYYY年MM月DD日 hh:mm', sb * 1000)}开售`;
            }
            if (!max) {
              return `${num}人已报名`;
            } else if (max === num) {
              return '已报满';
            }
            if (now < se && se < now + 86400 * 3) {
              displayse = `，距停售还有${parseInt((se - now) / 86400, 10)}天`;
            }
            return `剩${max - num}个名额${displayse}`;
        }
```
最后，在jsx里面只需要配合classnames这个工具就可以切换样式，而不同样式有不同的伪元素，所以无论有多少种情况，都不用大改jsx。
```jsx
            <div
              className={cx(
                'hint',
                /开售/.test(hint) && 'no-start',
                /已购买/.test(hint) && 'purchase-ok'
                )}
            >
              {hint}
            </div>
```
# 2. 驼峰命名
cgi返回的字段总是下划线，url不区分大小写也总是下划线，前端的js又是建议驼峰命名，不驼峰一个eslint就标红。比如前面的代码：
```javascript
const { course } = this.props;
const { course_name: courseName, real_price: realPrice, course_id: courseId  } = course;
```
这个时候，就有一种期望：
```javascript
const { course } = this.props;
const { courseName, realPrice, courseId  } = course;
```
很快，大家就想到了封装一个函数深度遍历对象改key再删旧key。但是这是props啊，住手，你想干啥？那就重新拷贝一份吧。重新搞个新的对象，是可以达到目的，而且有很多这种思路又稳定在生产环境使用的包，不如我们不从改变结果出发，直接从最开始的时候出发——get劫持name：
```javascript
const destruction = new Proxy(obj, {
  get(target, name) {
    const _name_ = underscored(name); //驼峰转下划线
    if (_name_ !== name) {
      return target[_name_];
    }
    return target[name];
  },
});
```
然后我们封装一波就可以了。当然，这只能兼顾到一层对象，我基于proxy写了一个[npm包](https://www.npmjs.com/package/proxy-destruction)，能兼顾深层对象，当然，只是个不稳定的版本

# 3. 自定义cgi名字
我们在项目里面，总会有一个assets或者utils之类的文件夹，然后有一个专门放请求的js——比如api.js，里面的代码一般就是：
```javascript
export function api1(args) {
  return request({
      url: `someurl`,
      method: 'GET',
      params: {
        ...args,
      },
    });
}

export function api2(args) {
  return request({
      url: `someurl`,
      method: 'POST',
      params: {
        ...args,
      },
    });
}
export function api3() {}
// ...
export function apin() {}
```
回头看看自己的代码，很多是直接简单带参数的get请求，而且命名一般也是根据接口下划线风格的名字转成驼峰命名的函数：
```javascript
function isNewUser(args) {
  return request({
      url: `${root}/is_new_user`,
      method: 'GET',
      params: {
        ...args,
      },
    });
}

function getList(args) {
  return request({
      url: `${root}/get_list`,
      method: 'GET',
      params: {
        ...args,
      },
    });
}

function getRecord(args) {
  return request({
      url: `${root}/get_record`,
      method: 'GET',
      params: {
        ...args,
      },
    });
}
```

于是，我们就这样写了一堆基本一模一样的重复代码，总感觉很不舒服，此时proxy来了：
```javascript
const simpleCGI = new Proxy({}, {
  get(target, name) {
    const _name_ = underscored(name);
    return (args) => request({
      url: `${config.rootCGI}/${_name_}`,
      ...defaultSetting, // 默认配置
      method: 'GET',
      params: {
        ...args,
      },
    });
  },
});
```

**usage:**
```javascript
simpleCGI.getList({ aid: 1, forward: 'aasdasdasd'})
// 实际上和上面的getList一样的效果
```
从此以后，再也不用写那么多export了99%相似的function了。只要拿到simpleCGI这个对象，随便你定义函数名字和传入参数，你只需要留下的，也许就是一些霸气而简短的注释

> 这太难看了吧，每次都是simpleCGI.xx然后再传入一个对象

我们再弄个配置表，可以定义接口path也可以取默认，也可以给参数，这是最终效果：
```javascript
/**
 * 极简cgi列表配置，一次配置无需写cgi函数
 * @member <FunctionName>: <Setting>
 * @template Setting path |  arguments (path： 可选，通常path和函数名转下划线后不一样才配。arguments： 可选，按顺序传入准确的参数名用英文逗号隔开，参数用=给默认值) 
 * @requires name Setting的path支持驼峰以及下划线, FunctionName建议用驼峰不然eslint可能找你了
 */
const CGI = {
  isNewUser: 'activity_id',
  getRecord: 'record|page=1,count=20,min_value=0',
  getPoster: 'get_exclusive_poster|activity_id, course_id',
  isSubscribe: 'isSubscribePubAccount|',
  getLessonList: 'activity_id, forward',
};

const CGIS = applyMapToSimpleCGI(CGI);

// 建议用commonjs规范的模块方案
module.exports = {
  ...CGIS,
};
```
接下来我们实现`applyMapToSimpleCGI`方法：
```javascript
const applyMapToSimpleCGI = (map) => {
  const res = {};
  Object.keys(map).forEach(key => {
    map[key] = map[key].replace(' ', '');
    const exec = map[key].match(/\w+(?=\|)/);
    const _key = (exec && exec[0]) || key;
    const argNames = map[key].split('|').pop().split(',');
    res[key] = (...args) => {
      const obj = {};
      argNames.forEach((name, i) => {
        if (name) {
          const [_name, defaultValue] = name.split('=');
          obj[_name] = args[i] !== undefined ? args[i] : defaultValue;
        }
      });
      return simpleCGI[_key](obj);
    };
  });
  return res;
};
```

已经把CGIS暴露出去了，我们用的时候可以这样：
```javascript
export { isNewUser, getRecord } from 'assets/api';
```

前面为什么说不建议用export default呢，因为es6模块是编译时输出接口，我们写好所有cgi请求函数在assets里面，另外一边的某个组件的api.js引用的assets的部分函数时候不能直接用export from，需要这样：
```javascript
// 某个组件的api.js引用总的api里面某些函数
 import __ from 'assets/api';
 const { isNewUser } = __;
 export { isNewUser };
```
用了es6模块意味着写了什么就只能用什么，而commonjs规范输出一个取值的函数，调用的时候就可以拿到变化的值。

从此，每次加接口，就在CGI对象加一行足够了，或者不加直接用`simpleCGI.function`，代码不用多写，函数名字随你定义，只需要注释到位`// xx接口： xxx，传入xxx`。

> 最后，更复杂的情况就自行发挥吧，总有方法让你代码更简短和优雅