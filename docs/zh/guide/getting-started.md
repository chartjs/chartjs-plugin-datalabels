# 快速上手

## 安装

### npm

[![npm](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chartjs-plugin-datalabels) [![npm downloads](https://img.shields.io/npm/dm/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chartjs-plugin-datalabels)

```
npm install chartjs-plugin-datalabels --save
```

::: tip
也支持 [Bower](https://bower.io/) 安装。
:::

### CDN

[![jsdelivr](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?label=jsdelivr&style=flat-square&maxAge=600)](https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@latest/dist/) [![jsdelivr hits](https://data.jsdelivr.com/v1/package/npm/chartjs-plugin-datalabels/badge)](https://www.jsdelivr.com/package/npm/chartjs-plugin-datalabels)

`https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels` 默认返回当前最新的压缩版本，但是还是建议指定特定版本，以免出现新版的兼容性问题。可通过在 url 后面添加 `@{version}` 的方式指定版本。

```
https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@1.1.2    // 指定特定版本
https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@1        // 指定主版本号
```

更多关于 jsDeliver 版本问题，可查看 [官网](http://www.jsdelivr.com/)

### 下载

[![github](https://img.shields.io/github/release/chartjs/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest) [![github downloads](https://img.shields.io/github/downloads/chartjs/chartjs-plugin-datalabels/total.svg?style=flat-square&maxAge=600)](http://www.somsubhra.com/github-release-stats/?username=chartjs&repository=chartjs-plugin-datalabels)

你可以从 [GitHub releases](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest) 下载最新的 `chartjs-plugin-datalabels` 版本：

- `chartjs-plugin-datalabels.js` (建议开发环境使用)
- `chartjs-plugin-datalabels.min.js` (建议生成环境使用)
- `chartjs-plugin-datalabels.zip` (包含 `.js` and `.min.js` 版本)

## 集成

### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.7.3/dist/Chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script>
```

::: warning 重要
`chartjs-plugin-datalabels` 必须在 Chart.js **之后**加载
:::

插件导入成功后，会新增全局属性 `ChartDataLabels`，在之后插件的 [注册/取消注册](#注册) 中会使用到。

### ES6模块

```javascript
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
```

## 注册

引入插件后会自动注册为**全局插件 [globally](https://www.chartjs.org/docs/latest/developers/plugins.html#global-plugins)**，因此所有图表都会开启文本标签的功能，可通过下面方式取消全局注册：

```javascript
// 提示: 当用 <script> 标签方式导入时，需要使用全局属性 `ChartDataLabels`
Chart.plugins.unregister(ChartDataLabels);
```

然后通过下面方式对特定图表开启插件功能：

```javascript
var chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    options: {
        // ...
    }
})
```

参考 [Chart.js &rsaquo; Using plugins](https://www.chartjs.org/docs/latest/developers/plugins.html)。

::: warning 废弃
从 1.x 版本开始，插件不再支持自动注册（详情 [#42](https://github.com/chartjs/chartjs-plugin-datalabels/issues/42)）。
:::

## 配置

插件[配置项](options.md)有三个不同的优先级，优先级顺序如下：

- 数据集配置： `dataset.datalabels.*`
- 图表配置： `options.plugins.datalabels.*`
- 全局配置： `Chart.defaults.plugins.datalabels.*`

例子:

```javascript
// 修改全局插进配置
Chart.defaults.set('plugins.datalabels', {
    color: '#FE777B'
});

var chart = new Chart(ctx, {
    options: {
        plugins: {
            // 修改图表插件配置
            datalabels: {
                color: '#36A2EB'
            }
        }
    },
    data: {
        datasets: [{
            // 修改数据集的插件配置
            datalabels: {
                color: '#FFCE56'
            }
        }]
    }
});
```
