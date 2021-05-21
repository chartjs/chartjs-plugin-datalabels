# Options

The following table lists all available options:

| Name | Type | [Scriptable](#scriptable-options) | [Indexable](#indexable-options) |  Default
| ---- | ---- | :----: | :----: | ----
| [`align`](positioning.md#alignment-and-offset) | `number` \| `string` | Yes | Yes | `'center'`
| [`anchor`](positioning.md#anchoring) | `string` | Yes | Yes | `'center'`
| `backgroundColor` | [`Style`](#style-options) \| `null` | Yes | Yes | `null`
| `borderColor` | [`Style`](#style-options) \| `null` | Yes | Yes | `null`
| `borderRadius` | `number` | Yes | Yes | `0`
| `borderWidth` | `number` | Yes | Yes | `0`
| [`clamp`](positioning.md#clamping) | `boolean` | Yes | Yes | `false`
| [`clip`](positioning.md#clipping) | `boolean` | Yes | Yes | `false`
| `color` | [`Style`](#style-options) | Yes | Yes | [`color`](https://www.chartjs.org/docs/latest/general/fonts.html)
| [`display`](positioning.md#visibility) | `boolean` \| `string` | Yes | Yes | `true`
| `font` | `object` | Yes | Yes | -
| `font.family` | `string` | - | - | [`font.family`](https://www.chartjs.org/docs/latest/general/fonts.html)
| `font.size` | `string` | - | - | [`font.size`](https://www.chartjs.org/docs/latest/general/fonts.html)
| `font.style` | `string` | - | - | [`font.style`](https://www.chartjs.org/docs/latest/general/fonts.html)
| `font.weight` | `string` | - | - | `'normal'`
| [`font.lineHeight`](formatting.md#multiline-labels) | `number` \| `string` | - | - | `1.2`
| [`formatter`](formatting.md#data-transformation) | `function` \| `null` | - | - | -
| [`labels`](labels.md) | `object` | - | - | `undefined`
| [`listeners`](events.md) | `object` | - | - | `{}`
| [`offset`](positioning.md#alignment-and-offset) | `number` | Yes | Yes | `4`
| `opacity` | `number` | Yes | Yes | `1`
| `padding` | `number` \| `object` | Yes | Yes | -
| `padding.top` | `number` | - | - | `4`
| `padding.right` | `number` | - | - | `4`
| `padding.bottom` | `number` | - | - | `4`
| `padding.left` | `number` | - | - | `4`
| [`rotation`](positioning.md#rotation) | `number` | Yes | Yes | `0`
| [`textAlign`](formatting.md#text-alignment) | `string` | Yes | Yes | `'start'`
| `textStrokeColor` | [`Style`](#style-options) | Yes | Yes | `color`
| `textStrokeWidth` | `number` | Yes | Yes | `0`
| `textShadowBlur` | `number` | Yes | Yes | `0`
| `textShadowColor` | [`Color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) | Yes | Yes | `color`

::: tip
Refer to the [Configuration](getting-started.md#configuration) section if you don't know how to configure these options.
:::

## Scriptable Options

Scriptable options also accept a function which is called for each data and that takes the unique argument `context` representing contextual information (see [option context](options.md#option-context)).

Example:

```javascript
color: function(context) {
  var index = context.dataIndex;
  var value = context.dataset.data[index];
  return value < 0 ? 'red' :  // draw negative values in red
    index % 2 ? 'blue' :      // else, alternate values in blue and green
    'green';
}
```

## Option Context

The option context is used to give contextual information when resolving options. It mainly applies to [scriptable options](#scriptable-options) but also to some function options such as [`formatter`](formatting.md#data-transformation).

The context object contains the following properties:

| Property | Type | Description
| -------- | ---- | -----------
| `active` | `bool` | Whether the associated element is hovered ([see interactions](https://www.chartjs.org/docs/latest/configuration/interactions.html)).
| `chart` | `Chart` | The associated chart.
| `dataIndex` | `number` | The index of the associated data.
| `dataset` | `object` | The dataset at index `datasetIndex`.
| `datasetIndex` | `number` | The index of the associated dataset.

::: tip
The option context can be extended dynamically with user custom properties, for example to implement [event based label customizations & interactions](events.md#listeners).
:::

## Indexable Options

Indexable options also accept an array in which each item corresponds to the element at the same index. Note that this method requires to provide as many items as data, so, in most cases, using a [function](#scriptable-options) is more appropriate.

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
