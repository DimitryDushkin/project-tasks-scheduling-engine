import {
  makeGraphFromTasks,
  dfs,
  removeCyclicDependencies,
  toposort,
} from "./graph.utils";
import {
  addDays,
  getNowDate,
  maxDateTime,
  subtractDays,
  updateTaskDatesByStart,
} from "./date.utils";

export type ID = string;

export type Graph = Map<ID, Set<ID>>;
export type TasksById = { [id: string]: Task };
export type Task = {
  id: ID;
  title: string;
  start: Date;
  end: Date;
  duration: number;

  /**
   * Approximation of priority
   */
  position: number;
  progress: number;
  resourceId: ID;
  /**
   * Current task blocked by these tasks (depends on)
   */
  blockedBy?: Array<ID>;
};

export const scheduleTasks = (
  inputTasks: Array<Task>,
  today: Date = getNowDate()
): Array<Task> => {
  const dayBeforeToday = subtractDays(today, 1);
  const tasks: Array<Task> = inputTasks.map((t) => ({ ...t }));
  const tasksById: TasksById = Object.fromEntries(tasks.map((t) => [t.id, t]));
  const graph = makeGraphFromTasks(tasks);
  let cyclesToFullyUpdateDates = 1;

  // 1. Remove cyclic dependencies
  removeCyclicDependencies(graph, tasks);

  // 2. Initial update of all tasks start and ends days taking into account business days
  for (const task of tasks) {
    updateTaskDatesByStart(task, today, true);
  }

  // Repeat until dates remains unchanged, max graph.size times.
  // Similar to optimization in Bellman-Ford algorithm
  // @see https://en.wikipedia.org/wiki/Bellman–Ford_algorithm#Improvements
  for (let i = 0; i < tasks.length; i++) {
    let isAnyTaskTimelineChanged = false;

    for (const [taskId] of dfs(graph)) {
      const task = tasksById[taskId];
      // if blockedBy task not in initial data set
      if (task === undefined) {
        continue;
      }
      const blockedByTasks = Array.from(graph.get(task.id) ?? [])
        .map((blockedById) => tasksById[blockedById])
        // do not take into account tasks not in graph
        .filter(Boolean);
      const blockedByEndDates = blockedByTasks.map((t) => t.end);
      // add dayBeforeToday by default, so task without blockedBy starts on today
      blockedByEndDates.push(dayBeforeToday);

      // Start task on the next day after previous (blockedBy) tasks ends
      const maxBlockedByEndDate = addDays(maxDateTime(blockedByEndDates), 1);
      const isTaskTimelineUpdated = updateTaskDatesByStart(
        task,
        maxBlockedByEndDate
      );
      if (isTaskTimelineUpdated) {
        isAnyTaskTimelineChanged = true;
      }
    }

    if (isAnyTaskTimelineChanged === false) {
      break;
    }
    cyclesToFullyUpdateDates++;

    if (isAnyTaskTimelineChanged && i === tasks.length - 1) {
      console.error(
        'It\'s not enought "tasks.length" interations to fully schedule all tasks!'
      );
    }
  }

  console.debug(
    `Cycles to fully update dates ${cyclesToFullyUpdateDates}/${tasks.length}`
  );

  return toposort(graph, tasks);
};
