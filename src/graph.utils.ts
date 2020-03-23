import { Task } from "./scheduleTasks";

type ID = string;

export type Graph = Map<ID, Set<ID>>;

/**
 * Graph respects exlicit dependecies
 * and implicit by resources (via positions)
 */
export const makeGraphFromTasks = (tasks: Task[]): Graph => {
  const graph: Graph = new Map();
  const resources = new Map<ID, Task[]>();

  // add edges for deps by resourceId and explicit dependencits
  for (const t of tasks) {
    const tasksForResource = resources.get(t.resourceId) ?? [];
    tasksForResource.push(t);
    resources.set(t.resourceId, tasksForResource);

    graph.set(t.id, new Set(t.dependencies ?? []));
  }

  resources.forEach(tasksForResource => {
    // sort by position
    tasksForResource.sort((a, b) => a.position - b.position);

    // add to graph such edges so first node has second as dependency
    let prevTask: Task;
    tasksForResource.forEach(task => {
      if (prevTask) {
        graph.get(prevTask.id)?.add(task.id);
      }
      prevTask = task;
    });
  });

  return graph;
};

export const makeReverseGraph = (graph: Graph): Graph => {
  const reverseGraph: Graph = new Map();

  dfs(graph, (id, parentId) => {
    const prerequesitions = reverseGraph.get(id) ?? new Set();
    if (parentId) {
      prerequesitions.add(parentId);
    }
    reverseGraph.set(id, prerequesitions);
  });

  return reverseGraph;
};

/**
 * Iterate over every vertex
 * @TODO: add tests
 */
export const dfs = (
  graph: Graph,
  vertexVisitor: (id: string, parentId?: string) => void
) => {
  const visited = new Set<ID>();

  // DFS interative
  // iterate over all vertexes in case of disconnected graph
  graph.forEach((_, vertex) => {
    if (visited.has(vertex)) {
      return;
    }

    const stack: ID[] = [vertex];
    while (stack.length > 0) {
      const currentVertex = stack.pop();

      assertIsDefined(currentVertex);

      vertexVisitor(currentVertex, undefined);

      visited.add(currentVertex);

      const dependencies = graph.get(currentVertex);
      dependencies?.forEach(dependencyId => {
        vertexVisitor(dependencyId, currentVertex);

        if (visited.has(dependencyId)) {
          return;
        }

        stack.push(dependencyId);
      });
    }
  });
};

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}
