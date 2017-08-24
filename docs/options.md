# Options

The plugin options can be changed at 3 different levels:

- globally: `Chart.defaults.global.plugins.datalabels.*`
- per chart: `options.plugins.datalabels.*`
- per dataset: `dataset.datalabels.*`

Available options:

| Name | Type | [Scriptable](#scriptable-options) | [Indexable](#indexable-options) |  Default
| ---- | ---- | :----: | :----: | ----
| [`align`](positioning.md#alignment-and-offset) | `String` | Yes | Yes | `'center'`
| [`anchor`](positioning.md#anchoring) | `String` | Yes | Yes | `'center'`
| `backgroundColor` | [`Style`](#style-options)/`null` | Yes | Yes | `null`
| `borderColor` | [`Style`](#style-options)/`null` | Yes | Yes | `null`
| `borderRadius` | `Number` | Yes | Yes | `0`
| `borderWidth` | `Number` | Yes | Yes | `0`
| `color` | [`Style`](#style-options) | Yes | Yes | `0`
| [`display`](positioning.md#visibility) | `Boolean` | Yes | Yes | `true`
| `font` | `Object` | Yes | Yes | -
| `font.family` | `String` | - | - | [`defaultFontFamily`](http://www.chartjs.org/docs/latest/general/fonts.html)
| `font.size` | `String` | - | - | [`defaultFontSize`](http://www.chartjs.org/docs/latest/general/fonts.html)
| `font.style` | `String` | - | - | [`defaultFontStyle`](http://www.chartjs.org/docs/latest/general/fonts.html)
| `font.weight` | `String` | - | - | `'normal'`
| `font.lineHeight` | `Number|String` | - | - | `1.2`
| [`offset`](positioning.md#alignment-and-offset) | `Number` | Yes | Yes | `4`
| `padding` | `Number/Object` | Yes | Yes | -
| `padding.top` | `Number` | - | - | `4`
| `padding.right` | `Number` | - | - | `4`
| `padding.bottom` | `Number` | - | - | `4`
| `padding.left` | `Number` | - | - | `4`
| [`rotation`](positioning.md#rotation) | `Number` | Yes | Yes | `0`
| [`textAlign`](formatting.md#text-alignment) | `String` | Yes | Yes | `start`
| [`formatter`](formatting.md#data-transformation) | `Function/null` | - | - | -

## Scriptable Options

Scriptable options also accept a function which is called for each data and that takes the unique argument `context` representing contextual information (see [option context](options.md#option-context)).

Example:

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

The option context is used to give contextual information when resolving options. It mainly applies to [scriptable options](#scriptable-options) but also to some function based options such as [`formatter`](formatting.md#data-transformation).

The context object contains the following properties:

- `chart`: the associated chart
- `dataIndex`: index of the current data
- `dataset`: dataset at index `datasetIndex`
- `datasetIndex`: index of the current dataset

## Indexable Options

Indexable options also accept an array in which each item corresponds to the element at the same index. Note that this method requires to provide as many items as data, so, in most cases, using a [function](#scriptable-options) is more appropriated.

Example:

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

Style options are usually inputs for [`fillStyle`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle) or [`strokeStyle`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle).

The following values are supported:

- string parsed as [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) value
- [CanvasGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient) object (linear or radial gradient)
- [CanvasPattern](https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern) object (a repetitive image)

Examples:

```javascript
color: 'green'                  // named color
color: '#dc143c'                // HEX color
color: 'rgb(51, 170, 51)'       // RGB color (opaque)
color: 'rgba(51, 170, 51, .5)'  // RGBa color (semi-transparent)
// ...
```
