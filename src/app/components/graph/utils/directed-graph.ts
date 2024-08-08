import * as dagre from "dagre";
import * as joint from "jointjs";
import * as graphlib from "@dagrejs/graphlib";

export const directedGraph = (graph: joint.dia.Graph): void => {
  joint.layout.DirectedGraph.layout(graph, {
    nodeSep: 70,
    edgeSep: 100,
    rankDir: "TB",
    setLinkVertices: false,
    dagre: dagre,
    graphic: graphlib,
  });
};
