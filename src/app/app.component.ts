import { GraphService } from './services/graph.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as joints from '../../node_modules/jointjs/dist/joint';
import { DirectedGraph } from '@joint/layout-directed-graph';
import * as joint from '../../node_modules/jointjs/dist/joint';
import * as dagre from 'dagre';
import * as graphlib from '@dagrejs/graphlib';
import * as _ from 'underscore';
// const fs = require('fs'); const path = require('path');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'jointjs-angular';
  @ViewChild('canvas') canvas: ElementRef;
  graph = new joints.dia.Graph();
  paper: joints.dia.Paper;
  nodes: Record<string, joints.dia.Element> = {};
  edges: joints.dia.Link[] = [];
  layers: string[][] = [];
  visited: Record<string, boolean> = {};

  constructor(private graphService: GraphService) {}


  buildGraphFromAdjacencyList(data: any) {
    const elements: any = [];
    const links: any = [];
    
    _.each(data.adjList, (edges, parentElementLabel) => {
        elements.push(this.makeElement(data.nodes.find((node: any)=> node.id === parentElementLabel)));

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
    return new joint.dia.Link({
        source: { id: parentId },
        target: { id: childId },
        attrs: { 
          '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
         },
        jumpover: true
    });
  }

  makeElement(node: any) {

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
            text: { text: node.type === "COMPANY" ? node.name : node.firstName, 'font-size': letterSize, 'font-family': 'monospace' },
            rect: {
                width: width, height: height,
                rx: 5, ry: 5,
                stroke: '#555'
            }
        }
    });
  }

  public ngAfterViewInit(): void {
    this.graphService.convertToAdjacencyList().subscribe((data) => {
      console.log(data);
      this.createPaper();

      const cells = this.buildGraphFromAdjacencyList(data);
      this.graph.resetCells(cells);
     
      joint.layout.DirectedGraph.layout(this.graph, {
        nodeSep: 70,
        edgeSep: 100,
        rankDir: "TB",
        setLinkVertices: false,
        dagre: dagre,
        graphlib,
      });

      const rootCenter = { x: 500, y: 100 };
      const [source] = this.graph.getSources();
      const { width, height } = source.size();
      const diff = source
          .position()
          .difference({
              x: rootCenter.x - width / 2,
              y: rootCenter.y - height / 2,
          });
      this.graph.translate(-diff.x, -diff.y);

      this.paper.transformToFitContent({
        padding: 30,
        contentArea: this.paper.getContentArea(),
        verticalAlign: 'middle',
        horizontalAlign: 'middle',
      })
    });
  }

  createPaper() {
    this.paper = new joints.dia.Paper({
      el: this.canvas.nativeElement,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 1,
      defaultConnectionPoint: { name: 'boundary', args: { offset: 5 }},
    defaultConnector: {
        name: 'straight',
        args: { cornerType: 'line', cornerRadius: 10 },
    },
    });
  }
}
