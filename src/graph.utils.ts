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

  for (const tasksForResource of resources.values()) {
    // sort by position
    tasksForResource.sort((a, b) => a.position - b.position);

    // add to graph such edges so first node has second as dependency
    let prevTask: Task | undefined;
    for (const task of tasksForResource) {
      if (prevTask) {
        graph.get(prevTask.id)?.add(task.id);
      }
      prevTask = task;
    }
  }

  return graph;
};

export const makeReverseGraph = (graph: Graph): Graph => {
  const reverseGraph: Graph = new Map();

  for (const [id, parentId] of dfs(graph, { withParentId: true })) {
    const prerequesitions = reverseGraph.get(id) ?? new Set();
    if (parentId) {
      prerequesitions.add(parentId);
    }
    reverseGraph.set(id, prerequesitions);
  }

  return reverseGraph;
};

/**
 * Iterate over every node.
 * If withParentId = true, than it is possible to visit same not more then once
 * @yields {[string, string?]} [nodeId, parentNodeId?]
 */
export function* dfs(
  graph: Graph,
  options: { withParentId: boolean } = { withParentId: false }
): Generator<readonly [string, string?], void, void> {
  const visited = new Set<ID>();

  // DFS interative
  // iterate over all nodes in case of disconnected graph
  for (const node of graph.keys()) {
    if (visited.has(node)) {
      continue;
    }

    const stack: ID[] = [node];
    while (stack.length > 0) {
      const currentNode = stack.pop();
      assertIsDefined(currentNode);

      yield [currentNode];

      visited.add(currentNode);

      const dependencies = graph.get(currentNode);
      if (!dependencies) {
        continue;
      }
      for (const dependencyId of dependencies) {
        if (options.withParentId) {
          // possible to yield same nodeId multiple times (needed for making reverse graph)
          yield [dependencyId, currentNode];
        }

        if (visited.has(dependencyId)) {
          continue;
        }

        stack.push(dependencyId);
      }
    }
  }
}

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}
