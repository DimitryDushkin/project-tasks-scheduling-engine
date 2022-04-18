import {
  makeGraphFromTasks,
  makeReverseGraph,
  dfs,
  dfsWithLevels,
  toposort,
} from "../graph.utils";
import { Graph } from "../scheduleTasks";
import { tasks, tasksSingleResource } from "./mocks/tasks.mocks";

describe("graph.utils", () => {
  it("should make correct graph from tasks", () => {
    expect(makeGraphFromTasks(tasks)).toMatchSnapshot();
  });

  it("should make correct graph from tasks with single resource", () => {
    expect(makeGraphFromTasks(tasksSingleResource)).toMatchSnapshot();
  });

  it("should make correct reverse graph", () => {
    const graph: Graph = new Map([
      ["0", new Set(["1", "3"])],
      ["1", new Set("2")],
      ["2", new Set("3")],
    ]);

    expect(makeReverseGraph(graph)).toMatchSnapshot();
  });

  it("should correctly iterate over all nodes DFS", () => {
    const graph: Graph = new Map([
      ["0", new Set(["1", "3"])],
      ["1", new Set("2")],
      ["2", new Set("3")],
      ["3", new Set()],
      ["4", new Set()],
    ]);

    const nodes = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
    } as any;

    const expectedSum = 10;

    let resultSum = 0;

    for (const [id] of dfs(graph)) {
      if (id in nodes) {
        resultSum += nodes[id];
      }
    }
    expect(resultSum).toEqual(expectedSum);
  });

  it("should correctly iterate over all nodes DFS with nesting levels", () => {
    /**
          ┌───┐        ┌───┐
       ┌──┤ 0 ├───┐    │ 4 │
       │  └───┘   │    └───┘
     ┌─▼─┐     ┌──▼┐
     │ 1 │     │ 2 │
     └─┬─┘     └───┘
       │
     ┌─▼─┐
     │ 3 │
     └───┘
     */
    const graph: Graph = new Map([
      ["0", new Set(["1", "2"])],
      ["1", new Set("3")],
      ["2", new Set()],
      ["3", new Set()],
      ["4", new Set()],
    ]);

    const expected = {
      "0": [1, 1],
      "1": [2, 1.01],
      "2": [2, 1.02],
      "3": [3, 1.011],
      "4": [1, 2],
    } as any;

    for (const [id, level, position] of dfsWithLevels(graph)) {
      const [expectedLevel, expectedPosition] = expected[id];
      expect(level).toEqual(expectedLevel);
      expect(position).toEqual(expectedPosition);
    }
  });

  // @TODO:!
  it("should remove cyclic dependencies", () => {});

  it("makes correct topological sort shuffle", () => {
    const shuffledTasks = [tasks[3], tasks[0], tasks[2], tasks[1]];
    const shuffledTasks2 = [tasks[1], tasks[2], tasks[0], tasks[3]];
    const graph = makeGraphFromTasks(shuffledTasks);
    const sorted = toposort(graph, shuffledTasks);
    const sorted2 = toposort(graph, shuffledTasks2);
    expect(sorted.map((t) => t.id)).toMatchSnapshot();
    expect(sorted2.map((t) => t.id)).toMatchSnapshot();
  });
});
