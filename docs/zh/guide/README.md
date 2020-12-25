# 介绍

可高度自定义的 [Chart.js](http://www.chartjs.org/) 的文本标签插件，支持任意图表类型。

::: warning 兼容性
支持 [Chart.js](https://github.com/chartjs/Chart.js/releases) **3.0.0-beta.7**。
:::

::: danger 重要
插件不提供公有API（除了插件钩子函数），因此最好不要调用 `$` 或者 `_` 开头的属性和方法，包括 `$datalabels` 插件的属性。在后面的版本这些私有方法可能会被删除。
:::

## 目录

* [快速上手](getting-started.md)
* [配置项](options.md)
* [标签](labels.md)
* [位置](positioning.md)
* [格式化](formatting.md)
* [事件](events.md)
* [例子](../samples/charts/line.md)

## License

`chartjs-plugin-datalabels` 基于 [MIT license](https://github.com/chartjs/chartjs-plugin-datalabels/blob/master/LICENSE.md).
