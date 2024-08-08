import * as joint from "jointjs";
import { dia } from "jointjs";

export const paper = (el: any, graph: any): dia.Paper => {
  return new joint.dia.Paper({
    el: el,
    model: graph,
    width: "100%",
    height: "100%",
    gridSize: 1,
    defaultConnectionPoint: { name: "boundary", args: { offset: 5 } },
    defaultConnector: {
      name: "straight",
      args: { cornerType: "line", cornerRadius: 10 },
    },
  });
};
