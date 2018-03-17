# Events

This plugin currently supports the following label events:

| **Name** | **Chart events<sup>1</sup>** | **Description**
| ---- | ---- | ----
| `enter` | `mousemove` | the mouse is moved over a label
| `leave` | `mousemove` | the mouse is moved out of an label
| `click` | `click` | the mouse's primary button is pressed and released on a label

> <sup>1</sup> [Chart.js events](http://www.chartjs.org/docs/latest/general/interactions/events.html) that need to be enabled in order to get the associated label event working. Note that by default Chart.js enables `"mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"`, meaning that label events work out-of-the-box.

## Listeners

The `listeners` option allows to register callbacks to be notified when an event is detected on a specific label. This option is an object where the property is the type of the event to listen and the value is a callback with a unique `context` argument.

The `context` contains the same information as for [scriptable options](options.md#option-context), can be modified (e.g. add new properties) and thus, **if the callback explicitly returns `true`**, the label is updated with the new context and the chart re-rendered. This allows to implement visual interactions with labels such as highlight, selection, etc.

Listeners can be registered for any label (`options.plugin.datalabels.listener.*`) or for labels of a specific dataset (`dataset.datalabels.listeners.*`).

> **Tip:** if no listener is registered, incoming events are immediately ignored, preventing extra computation such as intersecting label bounding box. That means there should be no performance penalty for configurations that don't use events.

## Example

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

