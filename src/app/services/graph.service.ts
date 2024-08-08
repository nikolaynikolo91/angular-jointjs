import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private dataUrl = 'assets/test.json';
  private dataUrl2 = 'assets/test2.json';

  constructor(private http: HttpClient) { }

  getGraph(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }

  getGraph2(): Observable<any> {
    return this.http.get<any>(this.dataUrl2);
  }
  /**
   * 
   * {
   *   nodes: [{}, {}],
   *   adjList: {id1: [], id2: []...}
   * }
   */

  convertToAdjacencyList() {
    return this.getGraph().pipe(
      map((data) => {
        const edges = data.edges;
        const adjList: any = {};

        edges.forEach((edge: any) => {
          if(!adjList.hasOwnProperty(edge.fromId)) {
            adjList[edge.fromId] = []
          }

          if(!adjList.hasOwnProperty(edge.toId)) {
            adjList[edge.toId] = [this.buildObject(edge)];
          } else {
            adjList[edge.toId] = [...adjList[edge.toId], this.buildObject(edge)];
          }
        })


        return {nodes: data.nodes, edges: data.edges, adjList};
      })
    );
  }

  buildObject(edge: any) {
    return {
      id: edge.fromId,
      relationGroups: edge.relationGroups,
      description: edge.description,
      startDate: edge.startDate
    }
  }
}
