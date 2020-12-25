# 标签

默认情况下，每个数据项会创建一个标签，但是也可以使用 `labels` 配置给每个数据项定义多个标签。`labels` 配置项是一个对象类型，对象每个属性表示一个标签，值表示该标签的配置项。`labels` 配置项会被图表配置和全局配置合并。

## 多标签

下面代码会给每个数据项添加两个标签，一个是 `title`，一个是 `value`。`title` 标签的文本是蓝色，字体加粗；`value` 标签文本是绿色，字体正常。

```js
{
    options: {
        plugins: {
            datalabels: {
                color: 'blue',
                labels: {
                    title: {
                        font: {
                            weight: 'bold'
                        }
                    },
                    value: {
                        color: 'green'
                    }
                }
            }
        }
    }
}
```

## Dataset Overrides

可通过配置特定数据集（`datasets`）的属性来覆盖整个图表的数据集配置项（上面例子是整个数据集的配置，每个数据集都会应用该配置）。

### 修改标签

通过配置特定数据集的 `labels` 来覆盖图表的配置项，如：

```js
{
    data: {
        datasets: [{
            // First dataset.
            datalabels: {
                color: 'yellow'
            }
        }, {
            // Second dataset.
            datalabels: {
                labels: {
                    title: {
                        color: 'green'
                    }
                }
            }
        }]
    },
    options: {
        plugins: {
            datalabels: {
                color: 'pink',
                labels: {
                    value: {},
                    title: {
                        color: 'blue'
                    }
                }
            }
        }
    }
}
```

上面例子会给 **第一个** 数据集创建下面两个标签：
- `value` 标签，字体为黄色（opions的配置项被数据集的配置覆盖）
- `title` 标签，字体为蓝色（opions的配置项）

**第二个** 数据集的会被配置如下两个标签：
- `value` 标签，字体为粉红色（opions的配置项）
- `title` 标签，字体为绿色（opions的配置项被数据集的配置覆盖）

::: warning 重要
`labels.<key>` 定义的配置项总是会覆盖图表和数据集的配置（在上面列子中，第一个数据集的 `title` 标签颜色是蓝色，而不是黄色）。
:::

### 添加标签

可以在特定数据集下面添加 `labels` 配置来添加标签。下面例子会给**第一个**数据集的每个数据项创建一个 `title` 标签，**第二个** 数据集的每个数据项会创建 `title` 和 `value` 两个标签：

```js
{
    data: {
        datasets: [{
            // First dataset.
        }, {
            // Second dataset.
            datalabels: {
                labels: {
                    value: {
                        color: 'green'
                    }
                }
            }
        }]
    },
    options: {
        plugins: {
            datalabels: {
                labels: {
                    title: {
                        color: 'blue'
                    }
                }
            }
        }
    }
}
```

### 移除标签

可以在特定数据集上面添加 `labels` 配置并设置属性值为 `null` 来移除标签。下面例子会移除 **第二个** 数据集的标签配置：

```js
{
    data: {
        datasets: [{
            // First dataset.
        }, {
            // Second dataset.
            datalabels: {
                labels: {
                    title: null
                }
            }
        }]
    },
    options: {
        plugins: {
            datalabels: {
                labels: {
                    title: {
                        color: 'blue'
                    }
                }
            }
        }
    }
}
```
