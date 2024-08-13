import { GraphService } from './services/graph.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as _ from 'underscore';
import { dia, layout, shapes, ui, util } from 'jointjs-plus';
import { Link } from './models/shapes';
import { DirectedGraph } from '@joint/layout-directed-graph';
// const fs = require('fs'); const path = require('path');

const cellNamespace = {
  ...shapes,
  Link,
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'jointjs-angular';
  @ViewChild('canvas') canvas: ElementRef;
  graph = new dia.Graph({}, { cellNamespace: cellNamespace });
  paper: dia.Paper;
  nodes: Record<string, dia.Element> = {};
  edges: dia.Link[] = [];
  layers: string[][] = [];
  visited: Record<string, boolean> = {};

  constructor(private graphService: GraphService) { }


  buildGraphFromAdjacencyList(data: any) {
    const elements: any = [];
    const links: any = [];

    _.each(data.adjList, (edges, parentElementLabel) => {
      elements.push(this.makeElement(data.nodes.find((node: any) => node.id === parentElementLabel)));

      _.each(edges, (childElementLabel) => {
        links.push(this.makeLink(parentElementLabel, childElementLabel.id));
      });
    });

    // Links must be added after all the elements. This is because when the links
    // are added to the graph, link source/target
    // elements must be in the graph already.
    return elements.concat(links);
  }

  makeLink(parentId: any, childId: any) {
    return new Link({
      source: { id: parentId },
      target: { id: childId },
    });
  }

  makeElement(node: any) {
    const letterSize = 8;
    const width = 50;
    const height = 50;

    return new shapes.standard.Rectangle({
      id: node.id,
      size: { width: width, height: height },
      attrs: {
        text: { text: node.type === "COMPANY" ? node.name : node.firstName, 'font-size': letterSize, 'font-family': 'monospace' },
        rect: {
          width: width, height: height,
          rx: 5, ry: 5,
          stroke: '#555'
        },
        label: {
          text: node.type === "COMPANY" ? node.name : node.firstName
        }
      },
    });
  }

  public ngAfterViewInit(): void {
    this.graphService.convertToAdjacencyList().subscribe((data) => {
      console.log(data);

      // CREATE PAPER
      this.paper = new dia.Paper({
        model: this.graph,
        width: 1000,
        height: 600,
        gridSize: 10,
        async: true,
        frozen: true,
        interactive: { linkMove: false },
        preventDefaultViewAction: false,

        clickThreshold: 10,
        sorting: dia.Paper.sorting.APPROX,
        background: { color: '#F3F7F6' },
        cellViewNamespace: cellNamespace,
        defaultRouter: {
          name: 'manhattan',
        },
        defaultConnector: {
          name: 'straight',
          args: {
            cornerType: 'line',
          }
        },
        defaultAnchor: {
          name: 'modelCenter'
        },
        // defaultLink: () => new Link()
      });

      // CREATE PAPER SCROLLER
      const scroller = new ui.PaperScroller({
        paper: this.paper,
        autoResizePaper: true,
        cursor: 'grab',
        baseWidth: 1,
        baseHeight: 1,
        contentOptions: {
          allowNewOrigin: 'any',
          padding: 100,
          useModelGeometry: true
        }
      });

      // BUILD GRAPH ADJ LIST
      const cells = this.buildGraphFromAdjacencyList(data);
      this.graph.resetCells(cells);
      this.canvas.nativeElement.appendChild(scroller.el);

      const graphLayout =  DirectedGraph.layout(this.graph, {
        nodeSep: 50,
        edgeSep: 80,
        rankDir: "TB"
    });
    
      scroller.render().centerContent({ useModelGeometry: true });

      this.paper.unfreeze();

      this.paper.on('blank:pointerdown', (evt: dia.Event) => scroller.startPanning(evt));
    });
  }

}
