# Labels

By default, a single label is created per data, however, it's possible to define multiple labels for each data element using the `labels` option. This option is an object where each property represents a new label, the key being the label key and the value being the options specific to each label. These options are merged on top of the options defined at the chart **and** dataset levels.

## Multiple Labels

The following snippet creates two labels for every data element, the first with `title` as key and the second with `value` as key. The `title` label text is blue with font in bold. The `value` label text is green with normal font.

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

While the previous example creates multiple labels with the same options for all datasets, it's possible to add, modify and remove labels for specific datasets by referring to the label key.

### Modifying Labels

To modify a label for a specific dataset, create an entry in the `labels` dataset options using the same key:

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

This example creates for each data element in the *first* dataset:
- a `value` label with text in yellow
- a `title` label with text in blue

and for each data element in the *second* dataset:
- a `value` label with text in pink
- a `title` label with text in green

::: warning IMPORTANT
Options defined under each `labels.<key>` always override options defined at the chart **and** dataset level (in the previous example, the `title` label text of the *first* dataset is blue, not yellow).
:::

### Adding Label

To add a new label to a specific dataset, create an entry under the `labels` dataset options using a *inexistent* label key. The following example creates one label (`title`) for each data element in the *first* dataset and two labels (`title` and `value`) for each data element in the *second* dataset:

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

### Removing Label

To remove a label for a specific dataset, create an `null` entry under the `labels` dataset options for the key of the label to remove. The following example removes the `title` label in the *second* dataset:

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
