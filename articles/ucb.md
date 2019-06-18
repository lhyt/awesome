> # 可能你的react函数组件从来都没有性能优化过

> 16.6之前，函数组件没有像`shouldComponentUpdate`这样的方法，也没有类似`PureComponent`这种解决方案，避免不了函数组件里面所有的代码再次的执行，要依靠外面的条件渲染来控制，或者是高阶组件。之前的话，选择使用函数组件的情况是一些比较简单的又比较纯的组件，只是负责展示的。而且函数组件最终编译babel结果是只执行`createElement`那一步；class组件一样有生命周期要实例化，最终经过Babel成es5代码的时候还很长


# memo的出现
当16.6的memo问世，函数组件就有了`PureComponent`和`shouldComponentUpdate`的解决方案，memo的使用方法：
```jsx
const C = (props) => {
    return <section>那一夜{props.name}的嫂子真美</section>
}

export default React.memo(C)
```
当父组件执行render的时候，避免不了C组件的渲染和C函数的执行（如果不在外面加判断的话：`{isShowC && <C />}`）。当到了C组件的时候，会浅比较C组件前后props值。如果都一样，会跳过函数组件C的执行，减少了不必要的渲染，达到了性能优化。


# 第二个参数


# 函数组件中传入的props值为函数时

# useCallback

