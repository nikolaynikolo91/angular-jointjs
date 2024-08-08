import { GraphService } from './services/graph.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as joints from '../../node_modules/jointjs/dist/joint';

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

  public ngAfterViewInit(): void {
    this.graphService.getGraph().subscribe((e)=> {
      console.log(e, 'data')
      this.createNode(e.nodes);

      this.createArrows(e);
      this.arrangeNodesInLayers();
    });


    this.createPaper();
    console.log(this.nodes)
    // const rect = new joints.shapes.standard.Rectangle();

    // rect.position(100, 30);
    // rect.resize(100, 40);
    // rect.attr({
    //   body: {
    //     fill: 'blue',
    //   },
    //   label: {
    //     text: 'Hello',
    //     fill: 'white',
    //   },
    // });
    // rect.addTo(this.graph);
    // const rect2 = rect.clone();
    // rect2.translate(300, 0);
    // rect2.attr('label/text', 'World!');
    // rect2.addTo(this.graph);

    // const link = new joints.shapes.standard.Link();
    // link.source(rect);
    // link.target(rect2);
    // link.appendLabel({
    //   attrs: {
    //     text: {
    //       text: '30@',
    //     },
    //   },
    // });
    // link.addTo(this.graph);
    // const link2 = new joints.shapes.standard.Link();
    // link2.source(rect2);
    // link2.target(rect);

    // link2.appendLabel({
    //   attrs: {
    //     text: {
    //       text: '14$',
    //     },
    //   },
    // });
    // link2.translate(150, 150);
    // link2.addTo(this.graph);

    // const card = this.customElement();
    // card.position(250, 150);
    // card.resize(180, 100);
    // card.addTo(this.graph);
    // const link3 = new joints.shapes.standard.Link();
    // link3.source(rect2);
    // link3.target(card);
    // link3.addTo(this.graph);
    // const link4 = new joints.shapes.standard.Link();
    // link4.source(rect);
    // link4.appendLabel({
    //   attrs: {
    //     text: {
    //       text: '30%',
    //     },
    //   },
    // });
    // link4.target(card);
    // link4.addTo(this.graph);
    // console.log(this.graph, 'test');
  }

  createPaper() {
    this.paper = new joints.dia.Paper({
      el: this.canvas.nativeElement,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
    });

    // this.paper.fitToContent({
    //   // useModelGeometry: true
    // })
  }

  customElement(id: string) {
    const test = joints.dia.Element.define(
      'test',
      {},
      {
        markup: joints.util.svg/* xml */ `
<rect width="250" height="50" fill="white" stroke="black" />
<text x="25" y="25" text-anchor="middle" dominant-baseline="central" fill="black">
${id}
</text>
`,
      }
    );
    return new test();
  }

  createNode(data: any) {
    data.forEach((node: any) => {
      const nodeId = String(node.id); // Convert the ID to string

      const rect = new joints.shapes.standard.Rectangle({
        id: nodeId,
        position: { x: 0, y: 0 },
        size: { width: 200, height: 50 },
        attrs: {
          // body: {
          //   fill: 'white',
          //   rx: 10,
          //   ry: 10,
          //   strokeWidth: 2,
          //   stroke: 'white',
          // },
          label: {
            text: node.id,
            fill: 'black',
            fontFamily: 'arial',
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
      });
      // const rect = this.customElement(node.id);

      this.nodes[nodeId] = rect;
      this.graph.addCell(rect);
    });


  }

  private arrangeNodesInLayers(): void {

    console.log(this.nodes, 'TEST')

    const calculateLayers = (nodeId: string, currentLayer: number): void => {
      if (this.visited[nodeId]) return;
      this.visited[nodeId] = true;

      if (!this.layers[currentLayer]) {
        this.layers[currentLayer] = [];
      }
      this.layers[currentLayer].push(nodeId);
console.log(this.nodes[nodeId], 'TEST2')
      const successors = this.graph.getSuccessors(this.nodes[nodeId]);
      console.log(successors, 's')
      if(successors.length){
        successors.forEach((successor: joints.dia.Element) => {
          const successorId = successor.id.toString();
          calculateLayers(successorId, currentLayer + 1);
        });
      }

    };

    Object.keys(this.nodes).forEach((nodeId) => {
      if (!this.graph.getPredecessors(this.nodes[nodeId]).length) {
        calculateLayers(nodeId, 0);
      }
    });

    console.log('Layers:', this.layers);

    // Position nodes on the paper
    const layerHeight = 350;
    const layerWidth = 200;

    this.layers.forEach((layer, layerIndex) => {
      const offsetY = (layerIndex + 1) * layerHeight;

      layer.forEach((nodeId, nodeIndex) => {
        const offsetX = (nodeIndex + 1) * layerWidth;

        const node = this.nodes[nodeId];
        const position = node.position();
        node.position(offsetX - position.x, offsetY);
      });
    });
  }

  private createArrows(data: any): void {
    data.edges.forEach((edge: any) => {
      const sourceId = String(edge.toId);
      const targetId = String(edge.fromId);
      const link = new joints.shapes.standard.Link({
        source: { id: sourceId },
        target: { id: targetId },
        attrs: {
          line: {
            stroke: 'black',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 Z',
              stroke: 'black',
              fill: 'black',
            },
          },
        },
      });

      this.edges.push(link);
      this.graph.addCell(link);
    });
  }
}
