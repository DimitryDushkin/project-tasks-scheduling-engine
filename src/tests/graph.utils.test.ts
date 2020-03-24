import { makeGraphFromTasks, Graph, makeReverseGraph } from "../graph.utils";
import { tasks } from "./mocks/tasks.mocks";

describe("graph.utils", () => {
  it("should make correct graph from tasks", () => {
    expect(makeGraphFromTasks(tasks)).toMatchSnapshot();
  });

  it("should make correct reverse graph", () => {
    const graph: Graph = new Map([
      ["0", new Set(["1", "3"])],
      ["1", new Set("2")],
      ["2", new Set("3")]
    ]);

    expect(makeReverseGraph(graph)).toMatchSnapshot();
  });
});
