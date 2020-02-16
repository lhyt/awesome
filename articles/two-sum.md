> [【两数相加】——leetcode原题链接](https://leetcode-cn.com/problems/add-two-numbers/)

# 前言
题目描述：

给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照`逆序`的方式存储的，并且它们的每个节点只能存储`一位`数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：
> 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807

ListNode类是这样的，也就是一个链表每一个节点都是`new ListNode`出来的，而且如果有下一个节点，那么它的next就是`new`出来的一个新的`ListNode`
```js
function ListNode(val) {
  this.val = val;
  this.next = null;
}
```

基于此，我们先写一个创建链表的函数，方便测试：
```js
  const res = new ListNode();
  let temp = res;
  arr.forEach((i, j) => {
    temp.val = i;
    if (j !== arr.length - 1) {
      temp = temp.next = new ListNode();
    }
  });
  return res;
}
```

# 解题
题目已经给了我们倒序了，那么就相当于创造了一个天然的加法环境——算术都是从右边开始算。接下来，我们先同时遍历两个链表
- 取出两个链表第一项，相加结果为sum，并把sum % 10写入最终结果第一个节点；如果结果大于9，进位标志`isMoreThan10`为true
- 取出两个链表第二项，重复上面操作，直到有一个链表已经结束
- 对于剩下的那段，不是简单的直接给next赋值就行，需要考虑相加、进位。还是需要一步步来
- 取剩下的那段第一个节点，如果之前有进位标志，那么把当前节点值 + 1，如果+1后还是大于10，进位标志还是true
- 取剩下的那段第二个节点，如果之前有进位标志，那么把当前节点值 + 1，如果+1后还是大于10，进位标志还是true
- ...直到遍历完剩下那段
- 最后，如果还有进位标志，还要追加一个`new ListNode(1)`节点

```js
function addTwoNumbers(l1, l2) {
  let res;
  let temp; // 当前的节点
  let isMoreThan10 = false;
  while (l1 && l2) { // 两个链表公共部分
    const sum = l1.val + l2.val;
    const r = sum % 10;
    if (temp) {
      //  一边创建一边取下一个
      temp.next = new ListNode();
      temp = temp.next;
    }
    if (!res) {
      // 第一次进来
      res = new ListNode(r);
      temp = res;
    }
    // 所有的加法操作都要这样
    temp.val = (r + isMoreThan10) % 10;
    isMoreThan10 = sum + isMoreThan10 > 9;
    l1 = l1.next;
    l2 = l2.next;
  }
  // 剩下那段
  let rest = l1 || l2;
  while (rest) {
    temp.next = rest;
    temp = temp.next;
    if (isMoreThan10) {
      isMoreThan10 = temp.val + 1 > 9;
      temp.val = (temp.val + 1) % 10;
    }
    rest = rest.next;
  }
  // 如果还有进位，追加一个1
  if (isMoreThan10) {
    temp.next = new ListNode(1);
  }
  return res;
}
```

# 大数相加
两个很大的数字，大到失去精度的情况，就不能直接使用数字来相加了。**es10有bigint可以瞬间解决，这里不列举了**。他们的相加，需要操作字符串来实现。

还是类似的过程：
- 如果它们有共同的位数，那么让它们相加，并对10取余数作为结果。如果相加结果大于9，那么进位标志为true
- 重复操作，从后面开始遍历，直到有一个数遍历完为止
- 多出的那一段，也不是直接拼接，还是需要一个个从最后开始遍历，加法规则还是类似
- 取剩下的那段倒数第一个数，如果之前有进位标志，那么把当前值 + 1，如果+1后还是大于10，进位标志还是true
- 取剩下的那段倒数第二个数，如果之前有进位标志，那么把当前值 + 1，如果+1后还是大于10，进位标志还是true
- ...直到遍历完剩下那段字符串
- 最后，如果还有进位标志，还要追加一个字符串'1'到最前面

```js

function add(a, b) {
  let cursor = 1;
  const [{ length: aLen }, { length: bLen }] = [a, b];
  let res = "";
  let carry = 0;
  while (a[aLen - cursor] && b[bLen - cursor]) {
// 共同位数
    const sum = +a[aLen - cursor] + +b[bLen - cursor] + carry;
// 取个位数拼接到最终结果前面
    res = `${sum % 10}${res}`;
// 进位标志
    carry = +(sum > 9);
    cursor++;
  }
// 剩下是a的处理
  while (a[aLen - cursor]) {
    const sum = +a[aLen - cursor] + carry;
    res = `${sum % 10}${res}`;
    carry = +(sum > 9);
    cursor++;
  }
// 剩下是b的处理
  while (b[bLen - cursor]) {
    const sum = +b[bLen - cursor] + carry;
    res = `${sum % 10}${res}`;
    carry = +(sum > 9);
    cursor++;
  }
  return `${carry || ""}${res}`;
}
```
整体套路是差不多的，不过上面的代码有点冗余，剩余的a和b那段是一样的套路，甚至最后剩余一个进位还是一样的操作。我们可以优化一下，把这些代码复用起来
```js
function add(a, b) {
  let cursor = 1;
  const [{ length: aLen }, { length: bLen }] = [a, b];
  let res = "";
  let carry = 0;
// 全部case合并过来
  while (a[aLen - cursor] || b[bLen - cursor] || carry) {
// ~~的妙处：可以把undefined转为0
    const sum = ~~a[aLen - cursor] + ~~b[bLen - cursor] + carry;
    res = `${sum % 10}${res}`;
    carry = +(sum > 9);
    cursor++;
  }
  return res;
}
```

> 拓展，多个大数相加支持

while判断有`a[aLen - cursor] || b[bLen - cursor] `，那么多个的话，对应的就是数组的some方法了：
`arr.some(condition)`返回对每一个数组元素执行`condition`后的返回值，只要有一个是true，最终结果就是true，相当于`condition(arr[0]) || condition(arr[1]) || condition(arr[2]) || ....`

个位数的求和，使用reduce求和即可，最后补上一个进位。优化：`args.some`如果是false，不走reduce，可以自己去测试一下执行时间。

```js
// 从写死两个到数组
function addMany(...args) {
  let cursor = 1;
  let res = "";
  let carry = 0;
  while (args.some(arg => arg[arg.length - cursor]) || carry) {
    const sum =
      args.reduce((acc, arg) => acc + ~~arg[arg.length - cursor], 0) + carry;
    res = `${sum % 10}${res}`;
    carry = ~~(sum / 10);
    cursor++;
  }
  return res;
}
```

> 关注公众号《不一样的前端》，以不一样的视角学习前端，快速成长，一起把玩最新的技术、探索各种黑科技

![](https://user-gold-cdn.xitu.io/2019/7/17/16bfbc918deb438e?w=258&h=258&f=jpeg&s=26192)