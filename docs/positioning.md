# Positioning

## Anchoring

An anchor point is defined by an orientation (normalized) vector and a position on the data element. The orientation depends on the scale type (vertical, horizontal or radial). The position is calculated based on the `anchor` option and the orientation vector.

Supported values for `anchor`:
- `center` (default): element center
- `start`: lowest element boundary
- `end`: highest element boundary

![chartjs-plugin-datalabels](assets/anchor.png)

## Alignment and Offset

The `align` option defines the position of the label relative to the anchor point position and orientation.

Supported values for `align`:
- `start`: the label is positioned before the anchor point
- `center` (default): the label is centered on the anchor point
- `end`: the label is positioned after the anchor point

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
