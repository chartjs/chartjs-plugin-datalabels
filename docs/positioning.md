# Positioning

## Anchoring

An anchor point is defined by an orientation (normalized) vector and a position on the data element. The orientation depends on the scale type (vertical, horizontal or radial). The position is calculated based on the `anchor` option and the orientation vector.

Supported values for `anchor`:
- `center` (default): element center
- `start`: lowest element boundary
- `end`: highest element boundary

![chartjs-plugin-datalabels](assets/anchor.png)

## Alignment and Offset

The `align` option defines the position of the label relative to the anchor point position and orientation. Its value can be expressed either by a number representing the clockwise angle (in degree) or by one of the following string presets:
- `start`: the label is positioned before the anchor point, following the same direction
- `end`: the label is positioned after the anchor point, following the same direction
- `center` (default): the label is centered on the anchor point
- `right`: the label is positioned to the right of the anchor point (0°)
- `bottom`: the label is positioned to the bottom of the anchor point (90°)
- `left`: the label is positioned to the left of the anchor point (180°)
- `top`: the label is positioned to the top of the anchor point (270°)

The `offset` represents the distance (in pixels) to pull the label *away* from the anchor point. This option is **not applicable** when `align` is `center`. Also note that if `align` is `start`, the label is moved in the opposite direction. The default value is `4`.

![chartjs-plugin-datalabels](assets/align.png)

## Rotation

This option controls the clockwise rotation angle (in degrees) of the label, the rotation center point being the label center. The default value is `0` (no rotation).

## Visibility

The `display` option controls the visibility of labels (`true` to show all labels, else `false` to hide all labels). This option is [scriptable](options.md#scriptable-options), so it's also possible to show/hide a few labels:

```javascript
display: function(context) {
    return context.dataIndex % 2; // display labels with an odd index
}
```

When the `clip` option is `true`, the part of the label which is outside the chart area will be masked (see [CanvasRenderingContext2D.clip()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip))
