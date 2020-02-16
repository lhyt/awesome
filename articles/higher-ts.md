> ts出了几年，之前用ts还可能显得逼格高，但是ts3.0后开始更加火了，再也不是“加分项”了，更加像是“必会”的了。之前对于ts，一些人人为了用而用，可能只是为了让简历的经历好看一点，并没有发挥它的作用。他们对于ts只是一些简单、低级的特性的应用，稍微麻烦一点的，就开始使用any。下面一步步来探究进阶的一些用法，一步步解决一些ts棘手的类型问题，逐步摆脱一些情景对any的依赖

<b style="color: red">强烈建议使用vscode，因为都是同一家，对ts的支持和开发体验是非常棒的，大大增加了开发效率和质量，避免各种错误。</b>

# 泛型
定义一种type或者interface，可以传入泛型参数，达到类型复用的效果：
```ts
// 一个对象所有的key都是同一类型
// before
const o: { a: number; b: number } = {
    a: 1,
    b: 2,
}
// after
type OneType<T> = {
    [key: string]: T; 
}
const o: OneType<number> = {
    a: 1,
    b: 2,
}
```
如果再包一层数组
```ts
// 实际上就是Array<T>, T[]可以说是一个语法糖，这里为了理解泛型
type ArrType<T> = T[]; 
const e: ArrType<OneType<number>> = [
    {
        a: 1,
        b: 2
    },
    {
        c: 1,
    }
]
```
另外，函数也可以传入泛型参数：
```ts
// 一个简单的函数
function f<T>(o: T): T { return o }
f<string>('1')

// 如果是数字，那么就报错了
f<string>(1)
```
在tsx文件中，箭头函数泛型写法有点不一样，因为要避免尖括号被误判：
```ts
const f = <T extends {}>(x: T) => x
```
# 索引类型
对于js的对象，我们可以表示为object[key]。ts也有类似的，即索引访问T[K]。如果T是object的interface或者type、K是key的话，则表示object[key]具有类型T[K]。而这个K不是随便来的，一般需要索引类型查询操作符keyof的作用下返回了索引查询(number 、string类型的key)才会有效，否则报类似`Type 'K' cannot be used to index type 'T'`的错误。

想想就知道，没有任何其他条件或者约束（泛型约束），直接这样用T[K]，ts怎么可能知道这是什么类型？怎么知道你想干什么？那就报错咯。
## keyof
keyof返回某个interface或者type的所有key：
```ts
interface IExample { a: number; b: number }
keyof IExample // 'a' | 'b'
```
写一个get函数，输入对象和key，返回对应的value
```ts
// 这种时候，可能就开始写any了。因为不知道传入的是什么
function getValue(o: any, k: string): any {
    return o[k]
}
getValue({ a: 1, b: '2' }, 'a');
// 稍微好一点的可能是“觉得这是对象所以是object”
// function get(o: object, k: string): any ，但返回值还是any
// 如果不用any，那就报错object没有属性xxx，😢
```
此时，keyof和泛型配合起来就可以告别any了：
```ts
//  K extends keyof V 保证第二个泛型参数是属于o的一个key
function getValue<V, K extends keyof V>(o: V, k: K): V[K] {
    return o[k]
}
getValue<{ a: number; b: string; }, 'a'>({ a: 1, b: '2' }, 'a');
```
> 按照常规的思维，key也就是那三种类型了，写死，然后泛型K就是key值
`function getValue<V, K>(o: V, k: string | number | symbol): V[K]`
但是这样就会报错：Type 'K' cannot be used to index type 'V'，就是因为没有什么约束条件(如keyof操作符保证返回合法的key)，K是什么也不知道，所以就直接报错类型K不能用于索引类型V的索引访问

换一种方式实现，需要考虑undefined
```ts
// 此时，我们的getValue需要考虑到没取到值的情况，所以改一下泛型的逻辑
function getValue<V, K>(o: V, k: string | number | symbol): K extends keyof V ? V[K] : undefined {
    return o[k]
}
```
> 这里没有报错，因为返回值里面对K做了约束。如果K不是V的一个key，那么返回值就是undefined类型，因此保证了K无论传什么值都有被覆盖到了：属于V的一个key的K就是正常，不属于则返回undefined类型

最后，使用方法
```ts
interface IExample { a: number; b: number }
getValue<IExample, 'a'>({ a: 1, b: 2 }, 'a');
```
这里注意，最后还是要写死'a'，为什么呢？因为ts只能帮到你在写代码的时候，明确的告诉ts我要取a的值。如果依赖用户输入的那种key，已经脱离了ts力所能及的范围。此时在vscode中，逻辑还是可以写着先，只是没有享受到返回值类型推断的这种福利

# 类似三元的语法
上面有一段`K extends keyof V ? V[K] : undefined`，这是ts的`condition type`，但是前面的condition只能使用extends的语句。比如像antd一些组件，仅仅有几种值：
- Button的size有"large", "default", "small"
- Button的type有"default", "primary", "ghost", "dashed", "danger", "link"

如果我们想写一个类型逻辑：是那几种type的就是那几种，否则返回default的type，那么就可以使用`condition type`了
```ts
declare const collection: ['a', 'b', 'c', 'default'];
declare type collectionType = (typeof collection)[number];

type isBelongCollection<T extends string> = T extends collectionType ? T : 'default'
type a = isBelongCollection<'a'> // 'a'
type b = isBelongCollection<'b'> // 'b'
type aa = isBelongCollection<'aa'>  // 'default'
```
如果想写一个getType函数，保证输入的type一定是那几个的一种：
```ts
const arr: collectionType[] = ['a', 'b', 'c', 'default'];

function getSize<T extends collectionType>(size: string): collectionType {
    return arr.find(x => x === size) || 'default'
}
```

# window as any
有时候，我们想给window加上一些辅助变量，发现会报错：
```ts
window.a = 1; // 类型“Window”上不存在属性“a”
```
此时可能就会给window 强行as any了：
```ts
(window as any).a = 1;
```

这样做，报错是解决了，但是又是依赖了any，而且还不能享受到在vsc写代码的时候，对window.a的代码提示。如果再次需要读取或者赋值window.a，那又要(window as any).a了。其实，优雅的解决方法是interface。**interface可以写多个重名，多个会合并**
```ts
interface I {
  a: number;
}
interface I {
  b: string;
}
const o: I = {
  a: 1,
  b: '2'
}

// 那么对window扩展的话，我们只需要在项目的根的.d.ts文件里面再写一份扩展的Window interface即可
interface Window {
  a: number;
}
```

# 动态修改的情况
我们使用其他方法修改了一些属性，比如装饰器、对象assign，ts代码肯定是标红的，但实际上我们都知道那是没有问题的：
```ts
let ao: {
    a: number
} = { a: 1 }
ao = Object.assign(ao, { b: 11 })
ao.b // Property 'b' does not exist on type '{ a: number; }'
```
由于后面也是人为的加上的属性b，那么我们只能一开始的时候就直接声明b属性：
```ts
let ao: {
    a: number,
    b?: number,
} = { a: 1 }
ao = Object.assign(ao, { b: 11 })
ao.b
```
使用装饰器的时候，我们给Greeter类加上console方法。但是使用的时候会说`Property 'console' does not exist on type 'Greeter'`。当然，使用的时候`(this as any).console(this.wording)`就可以解决了
```ts
function injectConsole(target) {
    target.prototype.console = function (txt) {
        console.log(txt);
    }
}

@injectConsole
class Greeter {
    wording: string;
    constructor(wording: string) {
        this.wording = wording;
    }
    public greet() {
        this.console(this.wording)
    }
}
```
实际上，和wording也是同理，事先声明一下console即可优雅解决:
```ts
@injectConsole
class Greeter {
    wording: string;
    console: (txt: string) => void; // 声明一下console方法
    constructor(wording: string) {
        this.wording = wording;
    }
    public greet() {
        this.console(this.wording)
    }
}
```
> 一些常见的场景

mobx和react一起使用的时候，也是有类似场景：
```ts
import { inject, observer } from 'mobx-react';

interface IState {
  // state的声明
}

// props的声明
type IProps = {
  user: UserState;  // 来自于inject的props需要提前声明一下
  // ...其他原本组件的props声明
};
@inject('user')
@observer
class App extends React.Component<IProps, IState>{
  // ...
  public componentDidMount() {
    console.log(this.props.user); // user是被inject进去的，实际上是存在的
    // 如果不事先声明user在props上，ts会报user不存在的错
  }
}
```
react router的路由匹配的params也是会有这个情况:
```tsx
import { RouteComponentProps } from 'react-router';

// 前面路由匹配那个组件
<Route path="/a/:id" component={App} />

// props的声明
type IProps = RouteComponentProps<{
  id: string;  // 使用react-router里面的泛性类型RouteComponentProps给props声明匹配的参数
}> & {
  // ...其他原本组件的props声明
};

class App extends React.Component<IProps>{
  // ...
  public componentDidMount() {
    // 这一串在Route的path使用`:<key>`这种方式匹配到的时候会存在
    //  当前path为'/a/1'的时候，打印1
    console.log(this.props.match.params.id);
  }
}
```

# 不懂其他库的类型系统就点进去看源码
> **当我们使用别人的库、框架的时候，不懂人家的类型系统、不懂人家的数据结构，代码各种标红。有的人可能又开始按耐不住使用了any大法。此时，我必须站出来阻止："no way!!"**

比如上面的RouteComponentProps，按住cmd点击进入，发现其源码如下
```ts
export interface match<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

export interface RouteComponentProps<P, C extends StaticContext = StaticContext> {
  history: H.History;
  location: H.Location;
  match: match<P>;
  staticContext?: C;
}
```
这就很明显的，告诉我们匹配到的参数就在props.match.params里面。这不仅知道了结构，还相当于半个文档，看一下命名就知道是做什么的了

> 使用antd的时候，忘记了某个组件的props怎么办🤔️？打开antd官网查。不！不需要。只需要按下cmd+鼠标点击组件，进入源码的d.ts文件即可。来，跟我左边一起看个文件，右边看下一个文件

```ts
// 我要通过接口拉数据展示到table上，而且点击某行要弹出修改
// 我知道这里要用Table组件，但不知道有什么属性，点进去看看

// 一进去就发现Table可以传泛型参数
export default class Table<T> extends React.Component<TableProps<T>, TableState<T>> {}

// TableProps<T>是一个关键，确定了这个组件的props了，点进去看看
export interface TableProps<T> {
    rowSelection?: TableRowSelection<T>;
    pagination?: PaginationConfig | false;
    size?: TableSize;
    dataSource?: T[];
    components?: TableComponents;
    columns?: ColumnProps<T>[];
    rowKey?: string | ((record: T, index: number) => string);
    rowClassName?: (record: T, index: number) => string;
    expandedRowRender?: (record: T, index: number, indent:
    onChange?: (pagination: PaginationConfig, filters: Record<keyof T, string[]>, sorter: SorterResult<T>, extra: TableCurrentDataSource<T>) => void;
    loading?: boolean | SpinProps;
    locale?: TableLocale;
    indentSize?: number;
    onRowClick?: (record: T, index: number, event: Event) => void;
    onRow?: (record: T, index: number) => TableEventListeners;
    footer?: (currentPageData: Object[]) => React.ReactNode;
    title?: (currentPageData: Object[]) => React.ReactNode;
    scroll?: {
        x?: boolean | number | string;
        y?: boolean | number | string;
    };
}
```
- 看命名，数据应该就放dataSource、表格有哪些列就配置一下columns
- 注意到ColumnProps<T>，而T是泛型接口TableProps来的，TableProps的T又是Table组件的泛型参数。ok，这就确定了dataSource的数据结构了
- 数据还没加载完使用loading，照顾到小屏还可以使用scroll控制距离多大才滚动
- 看onChange的参数pagination，翻页的回调实锤了，那pagination肯定是配置翻页的
- onRowClick？顾名思义，这就是我要的点击某行要弹出修改的效果呀

```tsx
type ListType = { name: string };
const list: ListType = [{ name: 'a' }, { name: 'b' }];
return (
        <Table<ListType>
            dataSource={list}
            scroll={{ x: 800 }}
            loading={isLodaing}
            onChange={onChange}
            onRowClick={onRowClick}
        >
          <Column dataIndex="name" title="大名" />
        </Table>
);
// Column组件是另一种写法，可以不用columns了
```

# 本身没有d.ts文件的库怎么办
```ts
// 随便找一个比较冷门且小型的库
import parser from 'big-json-parser';
```
如果他不支持，ts也会报错: 无法找到模块“xxx”的声明文件。import就报错了，as any大法都不行了！

既然他没有，那就帮他写。来到自己项目的d.ts根文件下，加入声明:
```ts
// 翻了一下源码，这里因为他没有d.ts，所以真的是去node_modules翻了
// 发现这是一个把对象转成schema结构的函数
declare module 'big-json-parser' {
  export default function parse(source: string, reviver?: (key: string, value: any)=>any ): string;
}
```
> 如果想快速使用，或者某一环节代码比较复杂，那就给any也行。如果是认真看源码知道每一个参数是干什么的，把所有的函数参数类型补全也不错。对方没有对他的库进行定义，那么你就来给他定义，看文档、看源码搞清楚每一个参数和类型，如果不错的话还可以给作者提一个pr呢

最后，给出如何编写d.ts的常见几种模块化方案：
```ts
// ES module:
declare const a: string
export { a }
export default a;

// commonjs:
declare module 'xxx' {
  export const a: string
}

// 全局，如果是umd则把其他模块化规范也加进来
declare namespace xxx{
    const a: string
}
// 此时在业务代码里面输入window. 的时候，提示a
```

# dom选择器不知道是什么类型
像这种情况是真的不能在写代码的时候推断类型的，可以使用any，但是失去了类型提示。其实可以使用is来挽回一点局面：
```ts
// 如果是canvas标签，使用canvas标签的方法
function isCanvas(ele: any): ele is HTMLCanvasElement {
  return ele.nodeName === 'canvas'
}

function query(selector: string) {
  const e = document.querySelector(selector)
  if (isCanvas(e)) {
    e.getContext('2d')
  }
}
```

# 一些高级的泛型类型
使用ts基本语法和关键字，可以实现一些高级的特性(如Partial，Required，Pick，Exclude，Omit等等)，增加了类型复用性。按住cmd，再点击这些类型进入ts源码里面(lib.es5.d.ts)的看到一些内置类型的实现：
```ts
// 全部变成可选
type Partial<T> = {
    [P in keyof T]?: T[P];
};
type t = Partial<{ a: string, b: number }> // { a?: string, b?: number }

// 全部变成必填
type Required<T> = {
    [P in keyof T]-?: T[P];
};
type p = Required<{ a: string, b?: number }> // { a: string, b: number }

// 全部变成只读
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 从T里面挑几个key
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
type p = Pick<{ a: string, b?: number }, 'a'> // { a: string }

// K extends keyof，说明第一个泛型参数是key。也就是对于给定key，都是T类型
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
type p = Record<'a' | 'b', string> // { a: string, b: string }
// Record版本的Readonly和Required，应该怎么实现，也很明显了

// 返回T里面除了U的
type Exclude<T, U> = T extends U ? never : T;
type p = Exclude<'a' | 'b', 'a'> // 'b'

// Exclude反向作用
type Extract<T, U> = T extends U ? T : never; //  'a'

// Pick的反向作用，从T里面选取非K里面的key出来
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type p = Omit<{ a: string, b?: number }, 'b'> // { a: string }

// 过滤null和undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type p1 = NonNullable<{ a: number, b: string }> // { a: number, b: string }
type p2 = NonNullable<undefined>  // never

// 把函数的参数抠出来
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type op = Parameters<(a: string, b: number) => void> // [string, number]
```

# is
有时候，我们真的是不知道结果是什么，然后就上了any。比如querySelector，选择了一个什么结果都是一个未知数，下面的代码就标红了：
```ts
function commonQuery(selector: string) {
  const ele = document.querySelector(selector)
  if (ele && ele.nodeName === 'DIV') {
    console.log(ele.innerHTML)
  } else if (ele && ele.nodeName === 'CANVAS') {
    console.log(ele.getContext)
  }
}
```
此时我们可以使用is来补救一下：
```ts
function isDiv(ele: any): ele is HTMLDivElement {
  return ele && ele.nodeName === 'DIV'
}

function isCanvas(ele: any): ele is HTMLCanvasElement {
  return ele && ele.nodeName === 'CANVAS'
}

function commonQuery(selector: string) {
  const ele = document.querySelector(selector)
  if (isDiv(ele)) {
    console.log(ele.innerHTML)
  } else if (isCanvas(ele)) {
  // 不会报错，且有代码提示
    console.log(ele.getContext)
  }
}
```

# 总结
- 首先需要主动积极维护项目代码的类型系统，遇到稍微麻烦的情况要先尝试能不能有解决方案，而不是马上妥协使用any
- 如果不知道一个外部的库、框架的类型系统，可以点进去看他的d.ts源码。如果没有d.ts文件，可以自己去看一下文档和源码，自己给它定义类型
- learn by doing，step by step


> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)