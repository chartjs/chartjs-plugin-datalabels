# 事件

标签插件目前支持如下事件：

| **事件名** | **Chart events<sup>1</sup>** | **描述**
| ---- | ---- | ----
| `enter` | `mousemove` | 鼠标移动到标签触发
| `leave` | `mousemove` | 鼠标离开标签时触发
| `click` | `click` | 点击事件

::: tip
<sup>1</sup> [Chart.js events](http://www.chartjs.org/docs/latest/general/interactions/events.html)这些Chart.js事件需要先启用，不然标签事件无法触发。请注意：Chart.js会默认开启`"mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"`这些事件，也就是默认情况下无需配置即可使用。
:::

## 监听器

可通过配置 `listeners` 属性来监听标签事件，`listeners` 属性是一个对象，键表示监听的事件名，值表示回调函数并提供 `context` 上下对象参数。

`context` 参数的属性和 [上下文对象](options.md#option-context) 一样，并且可以被修改（如：添加新的属性），如果**函数返回 `true`**，标签会被新的上下文对象更新并且图表重绘。这样的好处是可以做些交互，如：高亮标签，选中标签，等等。

可通过 `options.plugin.datalabels.listener.*` 方式给所有标签注册事件监听，或者通过 `dataset.datalabels.listeners.*` 方式给特定数据集的数据标签注册监听事件。

::: tip
如果没有注册事件监听，传入的事件会被立即忽略，防止额外的计算（如：标签重叠）。不配值事件监听对性能没有影响。
:::

## 例子

```javascript
data: {
  datasets: [{
    datalabels: {
      listeners: {
        click: function(context) {
          // Receives `click` events only for labels of the first dataset.
          // The clicked label index is available in `context.dataIndex`.
          console.log('label ' + context.dataIndex + ' has been clicked!');
        }
      }
    }
  }, {
      //...
  }]
},
options: {
  plugins: {
    datalabels: {
      listeners: {
        enter: function(context) {
          // Receives `enter` events for any labels of any dataset. Indices of the
          // clicked label are: `context.datasetIndex` and `context.dataIndex`.
          // For example, we can modify keep track of the hovered state and
          // return `true` to update the label and re-render the chart.
          context.hovered = true;
          return true;
        },
        leave: function(context) {
          // Receives `leave` events for any labels of any dataset.
          context.hovered = false;
          return true;
        }
      },
      color: function(context) {
        // Change the label text color based on our new `hovered` context value.
        return context.hovered ? "blue" : "gray";
      }
    }
  }
}
```

