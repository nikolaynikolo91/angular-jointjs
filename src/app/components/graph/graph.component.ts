import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import * as dagre from "dagre";

import { GraphService } from "src/app/services/graph.service";
import * as joint from "jointjs";
import { buildGraphFromAdjacencyList, paper } from "./utils";
import { directedGraph } from "./utils/directed-graph";

@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.scss"],
})
export class GraphComponent implements AfterViewInit {
  @ViewChild("canvas") canvas: ElementRef;

  graph = new joint.dia.Graph();
  paper: joint.dia.Paper;
  nodes: Record<string, joint.dia.Element> = {};
  edges: joint.dia.Link[] = [];
  layers: string[][] = [];
  visited: Record<string, boolean> = {};

  constructor(private graphService: GraphService) {}

  public ngAfterViewInit(): void {
    this.graphService.convertToAdjacencyList().subscribe((data) => {
      console.log(data);
      this.createPaper();

      const cells = buildGraphFromAdjacencyList(data);
      this.graph.resetCells(cells);

      directedGraph(this.graph);

      const rootCenter = { x: 500, y: 100 };
      const [source] = this.graph.getSources();
      const { width, height } = source.size();
      const diff = source.position().difference({
        x: rootCenter.x - width / 2,
        y: rootCenter.y - height / 2,
      });
      this.graph.translate(-diff.x, -diff.y);

      this.paper.transformToFitContent({
        padding: 30,
        contentArea: this.paper.getContentArea(),
        verticalAlign: "middle",
        horizontalAlign: "middle",
      });
    });
  }

  createPaper() {
    this.paper = paper(this.canvas.nativeElement, this.graph)
  }


}
