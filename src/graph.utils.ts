import { nullthrows } from "./misc";
import { TasksById, Graph, Task } from "./scheduleTasks";

type ID = string;

/**
 * Graph respects exlicit dependecies
 * and implicit by resources (via positions)
 */
export const makeGraphFromTasks = (tasks: Array<Task>): Graph => {
  // task and blockedBy
  const graph: Graph = new Map();
  const resourcesTasks = new Map<ID, Array<Task>>();

  // Create graphs
  for (const t of tasks) {
    // resource and its tasks
    const tasksOfResource = resourcesTasks.get(t.resourceId) ?? [];
    tasksOfResource.push(t);

    resourcesTasks.set(t.resourceId, tasksOfResource);

    graph.set(t.id, new Set(t.blockedBy ?? []));
  }

  // Now add deps
  for (const tasksOfResource of resourcesTasks.values()) {
    // first sort by position so links of tasks starts with higher position
    // then topological sort to reduce cyclic deps
    tasksOfResource.sort((a, b) => a.position - b.position);
    const sortedTasks = toposort(graph, tasksOfResource);

    // add to graph such edges so current node has prev as dependency (blocked by prev)
    let prevTask: Task | void;
    for (const task of sortedTasks) {
      if (prevTask && prevTask.id !== task.id) {
        graph.get(task.id)?.add(prevTask.id);
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
    if (parentId !== undefined) {
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
): Generator<[string, string | void], void, void> {
  const visited = new Set<ID>();

  // DFS interative
  // iterate over all nodes in case of disconnected graph
  for (const node of graph.keys()) {
    if (visited.has(node)) {
      continue;
    }

    const stack: Array<ID> = [node];
    while (stack.length > 0) {
      const currentNode = stack.pop();
      nullthrows(currentNode);

      yield [currentNode, undefined];

      visited.add(currentNode);

      const blockedBy = graph.get(currentNode);
      if (!blockedBy) {
        continue;
      }
      for (const dependencyId of blockedBy) {
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

/**
 * Main source of cyclic dependecies is previous step where graph is created
 * Often top-level task has same owner as children tasks
 * Since we create edge in graph also by same owner that's why there is cyclic deps
 *
 * IDEA: mitigate the issue by starting DFS walk from top-level (source) tasks!
 */
export const removeCyclicDependencies = (
  graph: Graph,
  tasks: Array<Task>
): void => {
  // Track visited to avoid computing path for already computed nodes
  const visited = new Set();

  const dfsAndFix = (rootTaskId: ID) => {
    // [current task ID, set of previously visited tasks]
    const stack: Array<[ID, Set<ID>]> = [[rootTaskId, new Set()]];

    while (stack.length > 0) {
      const nextValue = stack.pop();
      nullthrows(nextValue);
      const [taskId, prevSet] = nextValue;

      const blockedBy = graph.get(taskId) ?? new Set();

      visited.add(taskId);

      for (const blockedById of blockedBy) {
        // cycle detected!
        if (prevSet.has(blockedById)) {
          // remove that edge
          blockedBy.delete(blockedById);
          continue;
        }

        const newPrevSet = new Set(prevSet);
        newPrevSet.add(blockedById);
        stack.push([blockedById, newPrevSet]);
      }
    }
  };

  for (const task of tasks) {
    if (visited.has(task.id)) {
      continue;
    }

    dfsAndFix(task.id);
  }
};

/**
 * Topological sort. DFS variant. TO-DO: try Kahn version
 * IMPORTANT! Graph shouldn't have cyclic deps.
 */
export const toposort = (graph: Graph, nodes: Array<Task>): Array<Task> => {
  const nodesById: TasksById = Object.fromEntries(nodes.map((t) => [t.id, t]));
  const visited = new Set<ID>();
  const order: Array<Task> = [];

  const dfs = (node: Task) => {
    const nodeId = node.id;
    const blockedBy = graph.get(nodeId) ?? new Set<ID>();

    if (visited.has(nodeId)) {
      return;
    }
    visited.add(nodeId);

    for (const idBlockedBy of blockedBy) {
      const nextNode = nodesById[idBlockedBy];
      if (nextNode) {
        dfs(nextNode);
      }
    }

    order.push(node);
  };

  for (const node of nodes) {
    if (visited.has(node.id)) {
      continue;
    }

    dfs(node);
  }

  return order;
};

/**
 * Iterate over every node setting nested levels
 * i.e. T1 (level 1) -> T2 (level 1.1) -> T3 (level 1.11)
 * @yields {[string, number, number]} [nodeId, nestingLevel, position]
 */
export function* dfsWithLevels(
  graph: Graph
): Generator<[string, number, number], void, void> {
  const visited = new Set<ID>();

  // DFS interative
  // iterate over all nodes in case of disconnected graph
  let topNodesCount = 1;
  for (const node of graph.keys()) {
    if (visited.has(node)) {
      continue;
    }

    const stack: Array<[ID, number, number]> = [[node, 1, topNodesCount++]];
    while (stack.length > 0) {
      const nextValue = stack.pop();
      nullthrows(nextValue);
      const [currentNodeId, currentNodeNesting, currentNodePosition] =
        nextValue;
      nullthrows(currentNodeId);

      yield [currentNodeId, currentNodeNesting, currentNodePosition];

      visited.add(currentNodeId);

      const blockedBy = graph.get(currentNodeId);
      if (!blockedBy) {
        continue;
      }

      let i = 1;
      for (const dependencyId of blockedBy) {
        if (visited.has(dependencyId)) {
          continue;
        }
        const nestingLevel = currentNodeNesting + 1;
        stack.push([
          dependencyId,
          nestingLevel,
          currentNodePosition + i * (1 / Math.pow(10, nestingLevel)),
        ]);

        i++;
      }
    }
  }
}
