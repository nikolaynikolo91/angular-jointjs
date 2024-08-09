import * as _ from "underscore";
import { makeElement } from "./make-element";
import { makeLink } from "./make-link";
import { makeHtmlElement } from "./make-html-element";

export const buildGraphFromAdjacencyList = (data: any) => {
  const elements: any = [];
  const links: any = [];

  _.each(data.adjList, (edges, parentElementLabel) => {
    // elements.push(
    //   makeElement(
    //     data.nodes.find((node: any) => node.id === parentElementLabel)
    //   )
    // );
      elements.push(
        makeHtmlElement(
        data.nodes.find((node: any) => node.id === parentElementLabel)
      )
    );

    _.each(edges, (childElementLabel) => {
      links.push(makeLink(parentElementLabel, childElementLabel.id));
    });
  });

  // Links must be added after all the elements. This is because when the links
  // are added to the graph, link source/target
  // elements must be in the graph already.
  return elements.concat(links);
};
