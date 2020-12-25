# 格式化

## 数据装换

基础类型的数据会被转换为字符串类型（`'' + value`）。如果 `value` 是对象类型，默认装换规则如下：

- 如果`label`属性不为空：`value = value.label`
- 或者 `r` 属性不为空：`value = value.r`
- 或者 `value = 'key[0]: value[key[0]], key[1]: value[key[1]], ...'`

默认的转换规则可以通过 `formatter` 配置重写覆盖，它接受一个函数，并接受两个参数：

- `value`: 当前数据值
- `context`: 上下文对象（参考 [上下文对象](options.md#option-context)）

例子：

```javascript
formatter: function(value, context) {
    return context.dataIndex + ': ' + Math.round(value*100) + '%';
}

// 如果索引 0 处的值为 0.23，则标签格式为：”0: 23%“
// 如果索引 1 处的值为 0.42，则标签格式为：”1: 42%“
// ...
```

::: tip
第一个参数为值，可以直接使用泛型方法：
:::

```javascript
formatter: Math.round
formatter: Math.floor
formatter: Math.ceil
// ...
```

## 自定义标签

除了根据数据值显示对应的标签之外，还可以自定义标签内容：

```javascript
new Chart('id', {
    type: 'bar',
    data: {
        labels: ['foo', 'bar'],
        datasets: [{
            data: [42, 24]
        }]
    },
    options: {
        plugins: {
            datalabels: {
                formatter: function(value, context) {
                    return context.chart.data.labels[context.dataIndex];
                }
            }
        }
    }
});

// 索引 0 的数据，标签显示：”foo“
// 索引 1 的数据，标签显示：”bar“
// ...
```

::: tip
上面 `chart.data.labels` 只是一个例子，你可以设置任意的数据源，如：
:::

```javascript
context.dataset.data[context.dataIndex].label;  // labels in each data object
context.dataset.labels[context.dataIndex];      // labels store in the dataset
globalLabels[context.dataIndex];                // labels store outside the chart
// ...
```

## 多行标签

可以通过在字符串中嵌套 `\n` 字符达到换行的目的，也可以返回一个数组，插件内部会自动换行。

例子：

```javascript
formatter: function(value) {
    return 'line1\nline2\n' + value;
    // eq. return ['line1', 'line2', value]
}
```

::: tip
行间距可以通过 `font.lineHeight` 配置。
:::

## 文本居中

`textAlign` 配置仅适用于 [多行标签](#多行标签)，在绘制对齐方式时调用的canvas api [`CanvasRenderingContext2D.textAlign`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign))。注意：基于当前语言环境 right-to-left 配置暂未实现。

`textAlign` 可选值如下：

- `'start'` (默认值): 左对齐
- `'center'`: 居中
- `'end'`: 右对齐
- `'left'`: `'start'`别名
- `'right'`: `'end'`别名
