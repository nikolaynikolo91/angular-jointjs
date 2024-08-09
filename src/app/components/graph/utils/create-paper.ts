import * as joint from "jointjs";
import { dia } from "jointjs";

export const paper = (el: any, graph: any): dia.Paper => {
  return new joint.dia.Paper({
    el: el,
    width: 1800,
    height: 1000,
    model: graph,
    async: true,
    sorting: joint.dia.Paper.sorting.APPROX,
    overflow: true,
    interactive: { linkMove: false },
    defaultAnchor: {
        name: 'modelCenter',
    },
    defaultConnectionPoint: {
        name: 'rectangle',
    },
    defaultConnector: {
        name: 'curve',
    },
    defaultRouter: {
      name: "manhattan",
      args: {
        step: 1,
        padding: 20
      }
    },
    preventDefaultViewAction: false,
    background: { color: 'transparent' }
  });
};


