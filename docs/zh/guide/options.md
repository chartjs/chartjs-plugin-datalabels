# 配置项

插件全部配置项如下：

| 属性名 | 类型 | [可脚本化配置](#脚本配置项) | [Indexable](#indexable-options) |  默认值
| ---- | ---- | :----: | :----: | ----
| [`align`](positioning.md#对齐和偏移) | `number` \| `string` | Yes | Yes | `'center'`
| [`anchor`](positioning.md#锚点) | `string` | Yes | Yes | `'center'`
| `backgroundColor` | [`Style`](#style-options) \| `null` | Yes | Yes | `null`
| `borderColor` | [`Style`](#style-options) \| `null` | Yes | Yes | `null`
| `borderRadius` | `number` | Yes | Yes | `0`
| `borderWidth` | `number` | Yes | Yes | `0`
| [`clamp`](positioning.md#clamping) | `boolean` | Yes | Yes | `false`
| [`clip`](positioning.md#clipping) | `boolean` | Yes | Yes | `false`
| `color` | [`Style`](#style-options) | Yes | Yes | [`color`](http://www.chartjs.org/docs/latest/general/fonts.html)
| [`display`](positioning.md#显示和隐藏) | `boolean` \| `string` | Yes | Yes | `true`
| `font` | `object` | Yes | Yes | -
| `font.family` | `string` | - | - | [`font.family`](http://www.chartjs.org/docs/latest/general/fonts.html)
| `font.size` | `string` | - | - | [`font.size`](http://www.chartjs.org/docs/latest/general/fonts.html)
| `font.style` | `string` | - | - | [`font.style`](http://www.chartjs.org/docs/latest/general/fonts.html)
| `font.weight` | `string` | - | - | `'normal'`
| [`font.lineHeight`](formatting.md#multiline-labels) | `number` \| `string` | - | - | `1.2`
| [`formatter`](formatting.md#data-transformation) | `function` \| `null` | - | - | -
| [`labels`](labels.md) | `object` | - | - | `undefined`
| [`listeners`](events.md) | `object` | - | - | `{}`
| [`offset`](positioning.md#对齐和偏移) | `number` | Yes | Yes | `4`
| `opacity` | `number` | Yes | Yes | `1`
| `padding` | `number` \| `object` | Yes | Yes | -
| `padding.top` | `number` | - | - | `4`
| `padding.right` | `number` | - | - | `4`
| `padding.bottom` | `number` | - | - | `4`
| `padding.left` | `number` | - | - | `4`
| [`rotation`](positioning.md#旋转) | `number` | Yes | Yes | `0`
| [`textAlign`](formatting.md#text-alignment) | `string` | Yes | Yes | `'start'`
| `textStrokeColor` | [`Style`](#style-options) | Yes | Yes | `color`
| `textStrokeWidth` | `number` | Yes | Yes | `0`
| `textShadowBlur` | `number` | Yes | Yes | `0`
| `textShadowColor` | [`Color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) | Yes | Yes | `color`

::: tip
可参考 [配置](getting-started.md#配置) 章节了解如何配置这些选项
:::

## 脚本配置项

脚本配置项支持函数，每个数据集都会调用该函数，并提供 `context` 参数（查看 [[context](options.md#option-context)]）

例子：

```javascript
color: function(context) {
    var index = context.dataIndex;
    var value = context.dataset.data[index];
    return value < 0 ? 'red' :  // draw negative values in red
        index % 2 ? 'blue' :    // else, alternate values in blue and green
        'green';
}
```

## Option Context

`Context` 上下文对象提供解析数据的信息，主要用于 [脚本配置项](#脚本配置项)，也适用函数类型的配置，如[`formatter`](formatting.md#data-transformation)。

上下文对象提供如下属性：

| 属性名 | 类型 | 描述
| -------- | ---- | -----------
| `active` | `bool` | 元素是否处于悬浮状态 ([查看 interactions](http://www.chartjs.org/docs/latest/general/interactions/)).
| `chart` | `Chart` | 图表对象
| `dataIndex` | `number` | 当前数据项的索引
| `dataset` | `object` | `datasetIndex` 索引处对应的数据集
| `datasetIndex` | `number` | 数据集索引

## Indexable Options

Indexable Options 类型的属性支持数组类型，数组中的每一项和数据项一一对应。注意：数组的长度需要和数据项的长度保持一致，大多数情况下，推荐使用 [函数](#scriptable-options)

例子：

```javascript
color: [
    'red',    // color for data at index 0
    'blue',   // color for data at index 1
    'green',  // color for data at index 2
    'black',  // color for data at index 3
    //...
]
```

## Style Options

Style options 类型通常用于 [`fillStyle`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle) or [`strokeStyle`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle) 这样的属性。

支持以下类型的值：

- [CSS 颜色](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
- [CanvasGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient) 对象 (线性和径向渐变)
- [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern) 对象

例子：

```javascript
color: 'green'                  // named color
color: '#dc143c'                // HEX color
color: 'rgb(51, 170, 51)'       // RGB color (opaque)
color: 'rgba(51, 170, 51, .5)'  // RGBa color (semi-transparent)
// ...
```
