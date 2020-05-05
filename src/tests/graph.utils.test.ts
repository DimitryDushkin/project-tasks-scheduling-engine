import {
  makeGraphFromTasks,
  Graph,
  makeReverseGraph,
  dfs,
} from "../graph.utils";
import { tasks } from "./mocks/tasks.mocks";

describe("graph.utils", () => {
  it("should make correct graph from tasks", () => {
    expect(makeGraphFromTasks(tasks)).toMatchSnapshot();
  });

  it("should make correct reverse graph", () => {
    const graph: Graph = new Map([
      ["0", new Set(["1", "3"])],
      ["1", new Set("2")],
      ["2", new Set("3")],
    ]);

    expect(makeReverseGraph(graph)).toMatchSnapshot();
  });

  it("should correctly iterate over all nodes", () => {
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
    };

    const expectedSum = 10;

    let resultSum = 0;

    for (const [id] of dfs(graph)) {
      if (hasKey(nodes, id)) {
        resultSum += nodes[id];
      }
    }
    expect(resultSum).toEqual(expectedSum);
  });
});

// since an object key can be any of those types, our key can too
// in TS 3.0+, putting just "string" raises an error
function hasKey<O>(obj: O, key: string | number | symbol): key is keyof O {
  return key in obj;
}
