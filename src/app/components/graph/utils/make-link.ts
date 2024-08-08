import * as joint from "jointjs";

export function makeLink(parentId: any, childId: any): joint.dia.Link {
  return new joint.dia.Link({
    source: { id: parentId },
    target: { id: childId },
    attrs: {
      ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" },
    },
    jumpover: true,
  });
}