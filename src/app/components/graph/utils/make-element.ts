import * as joint from "jointjs";

export function makeElement(node: any): joint.shapes.basic.Rect {
  // var maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length;

  // Compute width/height of the rectangle based on the number
  // of lines in the label and the letter size. 0.6 * letterSize is
  // an approximation of the monospace font letter width.

  const letterSize = 8;
  // var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
  // var height = 2 * ((label.split('\n').length + 1) * letterSize);
  const width = 50;
  const height = 50;

  return new joint.shapes.basic.Rect({
    id: node.id,
    size: { width: width, height: height },
    attrs: {
      text: {
        text: node.type === "COMPANY" ? node.name : node.firstName,
        "font-size": letterSize,
        "font-family": "monospace",
      },
      rect: {
        width: width,
        height: height,
        rx: 5,
        ry: 5,
        stroke: "#555",
      },
    },
  });
}